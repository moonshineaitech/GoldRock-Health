import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkSignOut() {
  const { signOut } = useClerk();
  useEffect(() => {
    signOut({ redirectUrl: "/" }).catch(() => {
      window.location.href = "/";
    });
  }, [signOut]);
  return null;
}

export default function SignOutPage() {
  useEffect(() => {
    if (!clerkEnabled) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-muted border-t-foreground rounded-full" />
      {clerkEnabled && <ClerkSignOut />}
    </div>
  );
}
