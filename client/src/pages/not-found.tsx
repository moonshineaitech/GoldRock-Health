import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <MobileLayout title="Page Not Found" showBottomNav={true}>
      <div className="flex items-center justify-center py-20">
        <MobileCard className="text-center border-red-200 bg-red-50">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-red-900 mb-2">Page Not Found</h1>
          <p className="text-red-700 mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <MobileButton>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </MobileButton>
          </Link>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
