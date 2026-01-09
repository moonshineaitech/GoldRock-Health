import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
}

export function SEOHead({ title, description, keywords = [], canonicalPath, ogImage }: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | GoldRock Health`;
    
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMeta('description', description);
    if (keywords.length > 0) {
      updateMeta('keywords', keywords.join(', '));
    }
    
    const fullTitle = `${title} | GoldRock Health`;
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://goldrock.health${canonicalPath}`;
      updateMeta('og:url', `https://goldrock.health${canonicalPath}`, true);
    }
    
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
      updateMeta('twitter:image', ogImage);
    }
    
    return () => {
      document.title = 'GoldRock Health - Medical Debt Keeps You Up at Night. We Help You Sleep Again.';
    };
  }, [title, description, keywords, canonicalPath, ogImage]);
  
  return null;
}

interface SEOContentProps {
  content: string[];
}

export function SEOContent({ content }: SEOContentProps) {
  return (
    <div 
      className="sr-only absolute left-[-9999px] top-[-9999px] overflow-hidden"
      aria-hidden="true"
      style={{ 
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
    >
      {content.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}

export const SEO_KEYWORDS = {
  billAnalysis: [
    'medical bill reduction', 'hospital bill help', 'medical debt relief', 'negotiate medical bills',
    'medical bill errors', 'overcharged medical bill', 'hospital billing mistakes', 'healthcare cost reduction',
    'medical bill dispute', 'fight hospital bills', 'lower medical bills', 'medical bill advocacy',
    'itemized bill review', 'medical billing codes', 'CPT code errors', 'duplicate charges medical',
    'charity care programs', 'financial assistance hospitals', 'medical bill negotiation',
    'out of pocket maximum', 'surprise medical bills', 'balance billing', 'medical debt forgiveness'
  ],
  drugInteractions: [
    'drug interaction checker', 'medication interactions', 'pill identifier', 'medicine safety',
    'drug side effects', 'medication lookup', 'prescription drug interactions', 'pharmacy tool',
    'polypharmacy checker', 'medication safety', 'drug contraindications', 'CYP450 interactions',
    'serotonin syndrome', 'warfarin interactions', 'blood thinner interactions', 'SSRI drug interactions',
    'medication guide', 'drug information', 'prescription safety', 'drug allergy checker'
  ],
  labResults: [
    'lab results explained', 'blood test interpretation', 'CBC interpretation', 'metabolic panel explained',
    'cholesterol results meaning', 'blood sugar levels', 'A1C meaning', 'kidney function test',
    'liver function test', 'thyroid test results', 'vitamin D levels', 'iron levels blood test',
    'lab values normal range', 'abnormal lab results', 'blood work explained', 'medical test results'
  ],
  symptoms: [
    'symptom checker', 'symptoms meaning', 'what do my symptoms mean', 'health symptoms',
    'medical symptoms', 'when to see doctor', 'urgent symptoms', 'emergency symptoms',
    'health concern checker', 'am I sick', 'symptom analyzer', 'medical triage'
  ],
  medicalTraining: [
    'medical education', 'clinical training', 'diagnostic skills', 'medical cases',
    'clinical reasoning', 'differential diagnosis', 'medical student resources', 'USMLE prep',
    'board exam preparation', 'clinical decision making', 'patient diagnosis', 'medical simulation'
  ],
  proteinAnalysis: [
    'protein structure prediction', 'AlphaFold', 'drug discovery', 'molecular docking',
    'protein folding', 'binding site prediction', 'mutation analysis', 'structural biology',
    'computational biology', 'bioinformatics', 'protein visualization', 'amino acid sequence'
  ],
  insurance: [
    'insurance benefits explained', 'health insurance help', 'denied claim appeal',
    'prior authorization', 'insurance coverage', 'deductible explained', 'copay vs coinsurance',
    'Medicare enrollment', 'Medicaid eligibility', 'ACA marketplace', 'insurance denials'
  ]
};
