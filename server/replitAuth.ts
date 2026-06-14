// Authentication layer.
//
// Identity is provided by Clerk (managed sign-in: Google / Apple / email).
// This module is an ADAPTER: it keeps the same exported surface the rest of the
// app already depends on (`setupAuth`, `isAuthenticated`, `requiresAiAgreement`,
// `requiresSubscription`, `isAdmin`, `getSession`) and always exposes the acting
// user as `req.user.claims.sub` set to our INTERNAL `users.id`. That keeps all
// existing route handlers and ownership checks working unchanged.
//
// The legacy passport/express-session stack is retained ONLY to power the
// email/password demo login used by the App Store reviewer.

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { clerkMiddleware, getAuth, createClerkClient } from "@clerk/express";
import { storage } from "./storage";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

// When keys are absent the app still runs (demo login only); Clerk is inert.
export const clerkEnabled = !!CLERK_SECRET_KEY;

const clerkClient = clerkEnabled
  ? createClerkClient({
      secretKey: CLERK_SECRET_KEY,
      publishableKey: CLERK_PUBLISHABLE_KEY,
    })
  : null;

// Maps a Clerk user id -> our internal user (id + email). Avoids hitting the
// Clerk API + DB on every authenticated request. Only stable identifiers are
// cached; fresh user state (subscription, terms, etc.) is always re-read
// downstream via storage.getUser(claims.sub).
const clerkUserCache = new Map<
  string,
  { id: string; email: string | null; expires: number }
>();
const CLERK_CACHE_TTL = 5 * 60 * 1000;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

// Resolve a Clerk user id to our internal user record, creating/linking as
// needed. Linking to an existing account by email is ONLY done when Clerk
// reports the email as verified (prevents account-takeover via unverified
// emails).
async function resolveClerkUser(
  clerkUserId: string,
): Promise<{ id: string; email: string | null } | null> {
  const cached = clerkUserCache.get(clerkUserId);
  if (cached && cached.expires > Date.now()) {
    return { id: cached.id, email: cached.email };
  }

  let user = await storage.getUserByClerkId(clerkUserId);

  if (!user && clerkClient) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primary = clerkUser.emailAddresses.find(
      (e: any) => e.id === clerkUser.primaryEmailAddressId,
    );
    const rawEmail =
      primary?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || "";
    const email = rawEmail ? rawEmail.toLowerCase() : null;
    const emailVerified = primary?.verification?.status === "verified";

    // Link to an existing account ONLY by a verified email.
    if (email && emailVerified) {
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        user = await storage.setUserClerkId(existing.id, clerkUserId);
      }
    }

    // Otherwise provision a fresh account (id defaults to a uuid).
    if (!user) {
      user = await storage.upsertUser({
        clerkUserId,
        email,
        firstName: clerkUser.firstName ?? null,
        lastName: clerkUser.lastName ?? null,
        profileImageUrl: clerkUser.imageUrl ?? null,
      } as any);
    }
  }

  if (!user) return null;

  clerkUserCache.set(clerkUserId, {
    id: user.id,
    email: user.email ?? null,
    expires: Date.now() + CLERK_CACHE_TTL,
  });
  return { id: user.id, email: user.email ?? null };
}

export async function setupAuth(app: Express) {
  // Session + passport retained for the demo-login path only.
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Clerk: reads the session token (cookie/header) and populates req.auth.
  if (clerkEnabled) {
    app.use(
      clerkMiddleware({
        secretKey: CLERK_SECRET_KEY,
        publishableKey: CLERK_PUBLISHABLE_KEY,
      }),
    );
    console.log("Clerk authentication enabled");
  } else {
    console.warn(
      "CLERK_SECRET_KEY not set — Clerk sign-in is disabled (demo login only).",
    );
  }

  // Login: hand off to the in-app Clerk sign-in page, preserving the redirect.
  // All existing `/api/login?redirect=...` links continue to work unchanged.
  app.get("/api/login", (req, res) => {
    const raw = typeof req.query.redirect === "string" ? req.query.redirect : "";
    // Only allow same-origin, local paths. Reject protocol-relative ("//evil")
    // and backslash ("/\\evil") values to prevent open-redirect abuse.
    const redirect =
      raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")
        ? raw
        : "/";
    res.redirect(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
  });

  // Logout: clear the demo/passport session, then let the client clear Clerk.
  app.get("/api/logout", (req: any, res) => {
    const done = () => res.redirect("/sign-out");
    if (typeof req.logout === "function") {
      req.logout(() => done());
    } else {
      done();
    }
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // 1) Demo / passport session (App Store reviewer).
  if (
    typeof req.isAuthenticated === "function" &&
    req.isAuthenticated() &&
    req.user?.claims?.sub
  ) {
    const expiresAt = req.user.expires_at;
    if (!expiresAt || Math.floor(Date.now() / 1000) <= expiresAt) {
      return next();
    }
  }

  // 2) Clerk session.
  if (clerkEnabled) {
    try {
      const auth = getAuth(req);
      if (auth?.userId) {
        const resolved = await resolveClerkUser(auth.userId);
        if (resolved) {
          req.user = { claims: { sub: resolved.id, email: resolved.email } };
          return next();
        }
      }
    } catch (error) {
      // fall through to 401
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user has accepted AI terms.
export const requiresAiAgreement: RequestHandler = async (req: any, res, next) => {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const userData = await storage.getUser(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userData.acceptedAiTerms) {
      return res.status(451).json({
        message: "AI agreement acceptance required",
        code: "AI_AGREEMENT_REQUIRED",
        requiresAgreement: true,
      });
    }
    return next();
  } catch (error) {
    console.error("Error checking AI agreement status:", error);
    return res.status(500).json({ message: "Failed to verify AI agreement status" });
  }
};

// Middleware to check if user has an active subscription.
export const requiresSubscription: RequestHandler = async (req: any, res, next) => {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const userData = await storage.getUser(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userData.subscriptionStatus !== "active") {
      return res.status(402).json({
        message: "Premium subscription required",
        code: "SUBSCRIPTION_REQUIRED",
        upgradeRequired: true,
      });
    }
    return next();
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return res.status(500).json({ message: "Failed to verify subscription status" });
  }
};

// Admin email whitelist - only these users can have admin access.
const ADMIN_EMAIL_WHITELIST = ["ryan@moonshineai.com"];

// Middleware to check if user is an admin.
export const isAdmin: RequestHandler = async (req: any, res, next) => {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const userData = await storage.getUser(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isWhitelisted =
      userData.email &&
      ADMIN_EMAIL_WHITELIST.includes(userData.email.toLowerCase());

    if (!userData.isAdmin || !isWhitelisted) {
      return res.status(403).json({
        message: "Admin access required",
        code: "ADMIN_REQUIRED",
      });
    }
    return next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Failed to verify admin status" });
  }
};
