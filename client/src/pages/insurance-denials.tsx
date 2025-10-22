import { MobileLayout } from "@/components/mobile-layout";
import { InsuranceDenialsIntelligence } from "@/components/insurance-denials-intelligence";

export default function InsuranceDenials() {
  return (
    <MobileLayout title="Insurance Denials" showBottomNav={true}>
      <InsuranceDenialsIntelligence />
    </MobileLayout>
  );
}
