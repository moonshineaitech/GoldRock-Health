import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Security headers with Helmet
const isDev = process.env.NODE_ENV === 'development';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'", 
        "https://api.stripe.com", 
        "https://api.openai.com", 
        "https://api.anthropic.com", 
        "https://generativelanguage.googleapis.com",
        // Allow WebSocket connections for Vite HMR in development
        ...(isDev ? ["ws:", "wss:"] : []),
      ],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [], // Always use empty array to avoid type issues
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some external resources
}));

// CORS configuration - permissive for Replit environment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin, mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any Replit-related domains
    const replitDomains = ['.replit.dev', '.replit.app', '.repl.co', 'riker.replit.dev', 'picard.replit.dev', 'kirk.replit.dev'];
    if (replitDomains.some(domain => origin.includes(domain))) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (isDev) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Global rate limiter - 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for webhooks (they have their own verification)
    return req.path === '/api/stripe-webhook' || req.path === '/api/webhooks/revenuecat';
  },
});

// Strict rate limiter for auth and payment endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI endpoint rate limiter - more restrictive due to cost
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: 'AI request limit reached. Please wait before making more requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply global rate limiter
app.use('/api/', globalLimiter);

// Apply strict limiter to sensitive endpoints
app.use('/api/create-subscription', strictLimiter);
app.use('/api/create-payment-intent', strictLimiter);
app.use('/api/create-donation-session', strictLimiter);
app.use('/api/admin/', strictLimiter);

// Apply AI limiter to AI endpoints
app.use('/api/bill-ai-chat', aiLimiter);
app.use('/api/analyze-bill-ai', aiLimiter);
app.use('/api/medical-chat', aiLimiter);
app.use('/api/health-insights-chat', aiLimiter);
app.use('/api/ai/', aiLimiter);
app.use('/api/cases/:id/ask', aiLimiter);
app.use('/api/cases/:id/diagnose', aiLimiter);
app.use('/api/synthetic-patients/:id/analyze', aiLimiter);
app.use('/api/analyze-labs', aiLimiter);
app.use('/api/analyze-symptoms', aiLimiter);

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

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
