import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface SavingsReportData {
  billAmount: number;
  procedureType: string;
  hospitalType: string;
  insuranceType: string;
  state: string;
  overallScore: number;
  scores: {
    billingAccuracy: number;
    priceFairness: number;
    documentationQuality: number;
    negotiationLeverage: number;
    complianceScore: number;
  };
  savings: {
    lowEstimate: number;
    highEstimate: number;
    methods: string[];
  };
  issues: {
    critical: string[];
    major: string[];
    minor: string[];
  };
  recommendations: string[];
  generatedAt: Date;
}

function getScoreGrade(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export async function generateSavingsReportPDF(data: SavingsReportData): Promise<{ blob: Blob; filename: string }> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  pdf.setFillColor(10, 22, 40);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  pdf.setTextColor(0, 246, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GoldRock Health', margin, 25);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.text('Medical Bill Savings Report', margin, 35);

  y = 60;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill Summary', margin, y);
  y += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const summaryData = [
    ['Total Bill Amount:', formatCurrency(data.billAmount)],
    ['Procedure Type:', data.procedureType || 'Not specified'],
    ['Hospital Type:', data.hospitalType || 'Not specified'],
    ['Insurance Type:', data.insuranceType || 'Not specified'],
    ['State:', data.state || 'National']
  ];

  summaryData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 50, y);
    y += 7;
  });

  y += 10;

  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, y - 5, contentWidth, 40, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Bill Score', margin + 5, y + 5);
  
  const scoreColor = getScoreColor(data.overallScore);
  pdf.setTextColor(scoreColor);
  pdf.setFontSize(36);
  pdf.text(`${data.overallScore}/100`, margin + 5, y + 25);
  
  pdf.setFontSize(14);
  pdf.text(getScoreGrade(data.overallScore), margin + 45, y + 25);
  
  pdf.setTextColor(0, 0, 0);
  y += 45;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Score Breakdown:', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const scoreBreakdown = [
    ['Billing Accuracy:', data.scores.billingAccuracy],
    ['Price Fairness:', data.scores.priceFairness],
    ['Documentation Quality:', data.scores.documentationQuality],
    ['Negotiation Leverage:', data.scores.negotiationLeverage],
    ['Compliance Score:', data.scores.complianceScore]
  ];

  scoreBreakdown.forEach(([label, score]) => {
    pdf.text(`${label} ${score}/100`, margin + 5, y);
    y += 6;
  });

  y += 10;

  pdf.setFillColor(34, 197, 94);
  pdf.rect(margin, y - 5, contentWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Potential Savings', margin + 5, y + 5);
  
  pdf.setFontSize(20);
  pdf.text(`${formatCurrency(data.savings.lowEstimate)} - ${formatCurrency(data.savings.highEstimate)}`, margin + 5, y + 20);
  
  pdf.setTextColor(0, 0, 0);
  y += 40;

  if (data.issues.critical.length > 0 || data.issues.major.length > 0 || data.issues.minor.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Issues Identified', margin, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    if (data.issues.critical.length > 0) {
      pdf.setTextColor(220, 38, 38);
      data.issues.critical.forEach(issue => {
        pdf.text(`• CRITICAL: ${issue}`, margin + 5, y);
        y += 6;
      });
    }

    if (data.issues.major.length > 0) {
      pdf.setTextColor(234, 179, 8);
      data.issues.major.forEach(issue => {
        pdf.text(`• MAJOR: ${issue}`, margin + 5, y);
        y += 6;
      });
    }

    if (data.issues.minor.length > 0) {
      pdf.setTextColor(107, 114, 128);
      data.issues.minor.forEach(issue => {
        pdf.text(`• Minor: ${issue}`, margin + 5, y);
        y += 6;
      });
    }

    pdf.setTextColor(0, 0, 0);
    y += 8;
  }

  if (y > 230) {
    pdf.addPage();
    y = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommendations', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  data.recommendations.forEach((rec, index) => {
    if (y > 270) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(`${index + 1}. ${rec}`, margin + 5, y);
    y += 6;
  });

  y += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Savings Methods:', margin, y);
  y += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  data.savings.methods.forEach((method) => {
    if (y > 270) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(`✓ ${method}`, margin + 5, y);
    y += 6;
  });

  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setFillColor(10, 22, 40);
  pdf.rect(0, footerY - 5, pageWidth, 20, 'F');
  
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(8);
  pdf.text(`Generated: ${data.generatedAt.toLocaleDateString()} | GoldRock Health | goldrock.ai`, margin, footerY);
  pdf.text('This report is for informational purposes only and does not constitute medical or legal advice.', margin, footerY + 5);

  const blob = pdf.output('blob');
  const filename = `savings-report-${data.procedureType.replace(/\s+/g, '-').toLowerCase() || 'bill'}-${Date.now()}.pdf`;

  return { blob, filename };
}

export async function downloadSavingsReport(data: SavingsReportData): Promise<void> {
  const { blob, filename } = await generateSavingsReportPDF(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function getSavingsReportFile(data: SavingsReportData): Promise<File> {
  const { blob, filename } = await generateSavingsReportPDF(data);
  return new File([blob], filename, { type: 'application/pdf' });
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function nativeSaveAndSharePDF(data: SavingsReportData): Promise<{ success: boolean; filePath?: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { success: false };
  }

  try {
    const { blob, filename } = await generateSavingsReportPDF(data);
    const base64Data = await blobToBase64(blob);

    await Filesystem.writeFile({
      path: filename,
      data: `data:application/pdf;base64,${base64Data}`,
      directory: Directory.Cache,
      recursive: true,
    });

    const uriResult = await Filesystem.getUri({
      directory: Directory.Cache,
      path: filename,
    });

    await Share.share({
      title: 'GoldRock Health Savings Report',
      text: `Medical bill savings analysis for ${data.procedureType || 'your bill'}. Potential savings: ${formatCurrency(data.savings.lowEstimate)} - ${formatCurrency(data.savings.highEstimate)}`,
      url: uriResult.uri,
      dialogTitle: 'Share Your Savings Report',
    });

    return { success: true, filePath: uriResult.uri };
  } catch (error) {
    console.error('Native PDF save/share error:', error);
    return { success: false };
  }
}

export async function nativeDownloadPDF(data: SavingsReportData): Promise<{ success: boolean; filePath?: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { success: false };
  }

  try {
    const { blob, filename } = await generateSavingsReportPDF(data);
    const base64Data = await blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: filename,
      data: `data:application/pdf;base64,${base64Data}`,
      directory: Directory.Documents,
      recursive: true,
    });

    return { success: true, filePath: result.uri };
  } catch (error) {
    console.error('Native PDF download error:', error);
    return { success: false };
  }
}
