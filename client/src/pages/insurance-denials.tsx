import { MobileLayout } from "@/components/mobile-layout";
import { InsuranceDenialsIntelligence } from "@/components/insurance-denials-intelligence";

export default function InsuranceDenials() {
  const handleSendMessage = (message: string) => {
    console.log('Insurance denial message:', message);
  };

  return (
    <MobileLayout title="Insurance Denials" showBottomNav={true}>
      <InsuranceDenialsIntelligence onSendMessage={handleSendMessage} />
    </MobileLayout>
  );
}
