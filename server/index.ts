import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Privacy-safe logging function that redacts PII
function sanitizeForLogging(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return obj;

  // Define PII-sensitive routes and fields
  const sensitiveRoutes = ['/api/auth/user', '/api/subscription-status', '/api/user/', '/api/chat'];
  const piiFields = ['email', 'firstName', 'lastName', 'profileImageUrl', 'stripeCustomerId', 'stripeSubscriptionId'];
  
  const isSensitiveRoute = sensitiveRoutes.some(route => path.includes(route));
  
  if (!isSensitiveRoute) {
    return obj; // No redaction needed for non-sensitive routes
  }

  // For arrays, sanitize each item
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLogging(item, path));
  }

  // Create sanitized copy of object
  const sanitized = { ...obj };
  
  // Redact PII fields
  piiFields.forEach(field => {
    if (sanitized[field]) {
      if (field === 'email') {
        // Show domain but hide local part: user@domain.com -> ***@domain.com
        const email = sanitized[field];
        const atIndex = email.indexOf('@');
        if (atIndex > 0) {
          sanitized[field] = '***' + email.substring(atIndex);
        } else {
          sanitized[field] = '***';
        }
      } else {
        sanitized[field] = '[REDACTED]';
      }
    }
  });

  // Recursively sanitize nested objects
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLogging(sanitized[key], path);
    }
  });

  return sanitized;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Only log response body for debugging, but sanitize PII
      if (capturedJsonResponse && (res.statusCode >= 400 || process.env.NODE_ENV === 'development')) {
        const sanitizedResponse = sanitizeForLogging(capturedJsonResponse, path);
        const responseStr = JSON.stringify(sanitizedResponse);
        logLine += ` :: ${responseStr}`;
      }

      if (logLine.length > 200) {
        logLine = logLine.slice(0, 199) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
