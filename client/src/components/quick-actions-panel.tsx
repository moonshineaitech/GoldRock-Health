import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  FileEdit, 
  Phone, 
  Bookmark, 
  Share2, 
  Copy,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface QuickActionsPanelProps {
  billAmount?: number;
  providerName?: string;
  potentialSavings?: number;
  onGenerateDisputeLetter: () => void;
  onGenerateCallScript: () => void;
  onSaveBill: () => void;
  analysisComplete: boolean;
}

export function QuickActionsPanel({
  billAmount,
  providerName,
  potentialSavings,
  onGenerateDisputeLetter,
  onGenerateCallScript,
  onSaveBill,
  analysisComplete
}: QuickActionsPanelProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    const shareText = `I found potential savings of $${potentialSavings?.toLocaleString() || '0'} on my medical bill from ${providerName || 'my provider'} using GoldRock Health!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Medical Bill Savings',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Share your savings with friends and family"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    onSaveBill();
    toast({
      title: "Bill saved! ✓",
      description: "View it anytime in your Bill History"
    });
  };

  const actions = [
    {
      id: "dispute",
      icon: FileEdit,
      label: "Generate Dispute Letter",
      description: "Professional letter ready to send",
      color: "from-purple-500 to-indigo-500",
      onClick: onGenerateDisputeLetter,
      premium: false
    },
    {
      id: "call",
      icon: Phone,
      label: "Get Call Script",
      description: "What to say when you call",
      color: "from-emerald-500 to-teal-500",
      onClick: onGenerateCallScript,
      premium: false
    },
    {
      id: "save",
      icon: saved ? Check : Bookmark,
      label: saved ? "Saved!" : "Save to My Bills",
      description: "Track progress and follow up",
      color: "from-amber-500 to-orange-500",
      onClick: handleSave,
      premium: false,
      disabled: saved
    },
    {
      id: "share",
      icon: copied ? Check : Share2,
      label: copied ? "Copied!" : "Share Analysis",
      description: "Send to family or advocate",
      color: "from-blue-500 to-cyan-500",
      onClick: handleShare,
      premium: false
    }
  ];

  if (!analysisComplete) {
    return null;
  }

  return (
    <Card className="p-4 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-500" />
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
              action.disabled 
                ? "bg-gray-100 cursor-default" 
                : "bg-white shadow-md hover:shadow-lg"
            }`}
            data-testid={`quick-action-${action.id}`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-gray-900 text-sm">{action.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
          </motion.button>
        ))}
      </div>

      {potentialSavings && potentialSavings > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${potentialSavings.toLocaleString()}
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              data-testid="start-saving-button"
            >
              Start Saving
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
