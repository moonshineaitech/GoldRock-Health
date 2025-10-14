import { Share2, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { shareService } from "@/lib/share-service";
import { motion } from "framer-motion";

interface ShareButtonsProps {
  type: 'bill-analysis' | 'dispute-letter' | 'strategies' | 'app';
  data?: {
    billName?: string;
    savings?: number;
    summary?: string;
    letter?: string;
    strategies?: string[];
  };
}

export function ShareButtons({ type, data }: ShareButtonsProps) {
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    let success = false;

    switch (type) {
      case 'bill-analysis':
        if (data?.billName && data?.savings !== undefined && data?.summary) {
          success = await shareService.shareBillAnalysis(
            data.billName,
            data.savings,
            data.summary
          );
        }
        break;

      case 'dispute-letter':
        if (data?.letter && data?.billName) {
          success = await shareService.shareDisputeLetter(data.letter, data.billName);
        }
        break;

      case 'strategies':
        if (data?.billName && data?.strategies) {
          success = await shareService.shareStrategies(data.billName, data.strategies);
        }
        break;

      case 'app':
        success = await shareService.shareApp();
        break;
    }

    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleCopy = async () => {
    let textToCopy = '';

    switch (type) {
      case 'dispute-letter':
        textToCopy = data?.letter || '';
        break;
      case 'bill-analysis':
        textToCopy = `${data?.billName} - $${data?.savings?.toFixed(2)} in savings\n\n${data?.summary}`;
        break;
      case 'strategies':
        textToCopy = data?.strategies?.join('\n') || '';
        break;
    }

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    switch (type) {
      case 'dispute-letter':
        if (data?.letter && data?.billName) {
          shareService.downloadFile(
            data.letter,
            `dispute-letter-${data.billName}.txt`,
            'text/plain'
          );
        }
        break;
      case 'bill-analysis':
        if (data?.billName && data?.summary) {
          const content = `Bill Analysis - ${data.billName}\n\nPotential Savings: $${data.savings?.toFixed(2)}\n\n${data.summary}`;
          shareService.downloadFile(
            content,
            `analysis-${data.billName}.txt`,
            'text/plain'
          );
        }
        break;
    }
  };

  const shareAvailable = shareService.isAvailable();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Native Share Button */}
      {shareAvailable && (
        <Button
          variant="default"
          size="sm"
          onClick={handleShare}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          data-testid="button-share"
        >
          {shared ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Shared!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </>
          )}
        </Button>
      )}

      {/* Copy Button */}
      {(type === 'dispute-letter' || type === 'bill-analysis' || type === 'strategies') && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          data-testid="button-copy"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      )}

      {/* Download Button */}
      {(type === 'dispute-letter' || type === 'bill-analysis') && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          data-testid="button-download"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      )}

      {/* iOS Notice */}
      {!shareAvailable && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500"
        >
          📱 Share sheet available on iOS app
        </motion.p>
      )}
    </div>
  );
}
