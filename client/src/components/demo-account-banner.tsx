import { useAuth } from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";

export function DemoAccountBanner() {
  const { user } = useAuth();
  
  // Only show for demo account
  if (user?.email !== "appreviewer@goldrock.com") {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 shadow-lg"
      data-testid="banner-demo-account"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <AlertCircle className="h-4 w-4" />
        <span>
          📱 <strong>App Store Demo Account</strong> - Pre-loaded with sample bills and analysis results for review
        </span>
      </div>
    </div>
  );
}
