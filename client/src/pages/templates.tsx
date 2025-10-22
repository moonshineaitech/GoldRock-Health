import { MobileLayout } from "@/components/mobile-layout";
import { PremiumTemplatesLibrary } from "@/components/premium-templates-library";

export default function Templates() {
  const handleSendMessage = (message: string) => {
    // Message handler for template queries
    console.log("Template message:", message);
  };

  return (
    <MobileLayout title="Templates" showBottomNav={true}>
      <PremiumTemplatesLibrary onSendMessage={handleSendMessage} />
    </MobileLayout>
  );
}
