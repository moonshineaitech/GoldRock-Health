import { SignIn } from "@clerk/clerk-react";
import { Link } from "wouter";
import { useState } from "react";

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const GOLD_FILL = {
  background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))",
};

function getRedirect(): string {
  const params = new URLSearchParams(window.location.search);
  const r = params.get("redirect");
  // Only allow same-origin, local paths. Reject protocol-relative ("//evil")
  // and backslash ("/\\evil") values to prevent open-redirect abuse.
  if (r && r.startsWith("/") && !r.startsWith("//") && !r.startsWith("/\\")) {
    return r;
  }
  return "/";
}

function DemoSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = getRedirect();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Sign in failed. Check your details and try again.");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[color:var(--gold)]";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8"
        data-testid="link-home-logo"
      >
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={GOLD_FILL}
        />
        <span className="font-serif text-xl tracking-tight text-foreground">
          GoldRock
        </span>
      </Link>

      <div className="w-full max-w-sm luxury-card rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
          Welcome back
        </p>
        <h1 className="font-serif text-2xl text-foreground mb-1">
          Sign in to GoldRock
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Access your bills, analyses, and savings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-signin">
          <div>
            <label
              htmlFor="email"
              className="text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              data-testid="input-email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputClass}
              data-testid="input-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" data-testid="text-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-medium text-white shadow-sm disabled:opacity-60 transition-transform hover:-translate-y-0.5"
            style={GOLD_FILL}
            data-testid="button-signin"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setEmail("appreviewer@goldrockhealth.com");
            setPassword("GoldRock2026!");
          }}
          className="mt-5 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-use-demo"
        >
          Use demo account
        </button>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-testid="link-back-home"
      >
        ← Back to home
      </Link>
    </div>
  );
}

export default function SignInPage() {
  // Without Clerk keys, render the working email/password sign-in.
  if (!clerkEnabled) {
    return <DemoSignIn />;
  }

  const redirect = getRedirect();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          routing="virtual"
          forceRedirectUrl={redirect}
          signUpForceRedirectUrl={redirect}
          appearance={{
            variables: {
              colorPrimary: "hsl(38, 52%, 46%)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </div>
  );
}
