/**
 * Share Service - Native sharing capabilities
 * Web: Uses Web Share API
 * iOS: Would use React Native Share and iOS Share Sheet
 */

export interface ShareContent {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export class ShareService {
  private static instance: ShareService;

  private constructor() {}

  static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  /**
   * Check if native sharing is available
   */
  isAvailable(): boolean {
    return 'share' in navigator;
  }

  /**
   * Share content using native share sheet
   */
  async share(content: ShareContent): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
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
      text: `I found $${savings.toFixed(2)} in potential savings on my ${billName}!\n\n${summary}\n\nAnalyzed with GoldRock Health`,
    });
  }

  /**
   * Share reduction strategies
   */
  async shareStrategies(billName: string, strategies: string[]): Promise<boolean> {
    const text = `My Bill Reduction Strategies for ${billName}:\n\n${strategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nGet your own analysis at GoldRock Health`;

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
      title: 'Fight Medical Bills with AI',
      text: 'I\'m saving thousands on medical bills with GoldRock Health! Check it out:',
      url: 'https://goldrockhealth.com',
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
