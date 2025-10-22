/**
 * Share Service - Capacitor Share with web fallback
 * iOS (Capacitor): Uses native Share plugin  
 * Web: Uses Web Share API
 */

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export interface ShareContent {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export class ShareService {
  private static instance: ShareService;
  private isNative: boolean;

  private constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  /**
   * Check if native sharing is available
   */
  async isAvailable(): Promise<boolean> {
    if (this.isNative) {
      try {
        const result = await Share.canShare();
        return result.value;
      } catch {
        return false;
      }
    }
    return 'share' in navigator;
  }

  /**
   * Share content using native share sheet
   */
  async share(content: ShareContent): Promise<boolean> {
    try {
      if (this.isNative) {
        await Share.share({
          title: content.title,
          text: content.text,
          url: content.url,
          dialogTitle: content.title || 'Share',
        });
        return true;
      }

      const available = await this.isAvailable();
      if (!available) {
        // Fallback to copy to clipboard
        await this.copyToClipboard(content.text || content.url || '');
        return true;
      }

      await navigator.share({
        title: content.title,
        text: content.text,
        url: content.url,
        files: content.files,
      });

      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled share
        return false;
      }
      console.error('Error sharing:', error);
      return false;
    }
  }

  /**
   * Share dispute letter
   */
  async shareDisputeLetter(letter: string, billName: string): Promise<boolean> {
    const blob = new Blob([letter], { type: 'text/plain' });
    const file = new File([blob], `dispute-letter-${billName}.txt`, { type: 'text/plain' });

    return await this.share({
      title: `Dispute Letter - ${billName}`,
      text: 'Here is my medical bill dispute letter',
      files: [file],
    });
  }

  /**
   * Share bill analysis results
   */
  async shareBillAnalysis(billName: string, savings: number, summary: string): Promise<boolean> {
    return await this.share({
      title: `Bill Analysis - ${billName}`,
      text: `I found $${savings.toFixed(2)} in potential savings on my ${billName}!\n\n${summary}\n\nAnalyzed with GoldRock AI`,
    });
  }

  /**
   * Share reduction strategies
   */
  async shareStrategies(billName: string, strategies: string[]): Promise<boolean> {
    const text = `My Bill Reduction Strategies for ${billName}:\n\n${strategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nGet your own analysis at GoldRock AI`;

    return await this.share({
      title: `Reduction Strategies - ${billName}`,
      text,
    });
  }

  /**
   * Share app with friends (referral)
   */
  async shareApp(): Promise<boolean> {
    return await this.share({
      title: 'Analyze Medical Bills with AI',
      text: 'Check out GoldRock AI for medical bill analysis! Identify potential billing errors:',
      url: 'https://goldrock.ai',
    });
  }

  /**
   * Copy to clipboard (fallback)
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }

  /**
   * Download file (fallback for desktop)
   */
  downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const shareService = ShareService.getInstance();
