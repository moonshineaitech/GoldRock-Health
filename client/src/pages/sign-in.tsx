import { SignIn } from "@clerk/clerk-react";
import { Redirect } from "wouter";

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function getRedirect(): string {
  const params = new URLSearchParams(window.location.search);
  const r = params.get("redirect");
  return r && r.startsWith("/") ? r : "/";
}

export default function SignInPage() {
  // Before keys are configured, fall back to the existing landing (demo login).
  if (!clerkEnabled) {
    return <Redirect to="/" />;
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
