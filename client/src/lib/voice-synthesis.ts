import { apiRequest } from "./queryClient";

export interface VoiceSynthesisOptions {
  text: string;
  patientProfile?: {
    age: number;
    gender: string;
    condition?: string;
  };
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoiceSynthesisResponse {
  audioUrl: string;
  audioBuffer?: ArrayBuffer;
}

export class VoiceSynthesisService {
  private audioCache = new Map<string, string>();
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize Web Audio API context if supported
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }

  async synthesizeText(options: VoiceSynthesisOptions): Promise<VoiceSynthesisResponse> {
    const { text, patientProfile } = options;
    const cacheKey = this.generateCacheKey(text, patientProfile);

    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return {
        audioUrl: this.audioCache.get(cacheKey)!
      };
    }

    try {
      const response = await apiRequest("POST", "/api/voice/synthesize", {
        text,
        patientProfile
      });

      const data = await response.json() as VoiceSynthesisResponse;
      
      // Cache the audio URL
      if (data.audioUrl) {
        this.audioCache.set(cacheKey, data.audioUrl);
      }

      return data;
    } catch (error) {
      console.error('Voice synthesis failed:', error);
      throw new Error('Failed to synthesize speech. Please try again.');
    }
  }

  async playAudio(audioUrl: string): Promise<void> {
    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      
      return new Promise((resolve, reject) => {
        audio.oncanplaythrough = () => {
          audio.play()
            .then(() => {
              audio.onended = () => resolve();
            })
            .catch(reject);
        };
        
        audio.onerror = () => {
          reject(new Error('Failed to load audio'));
        };
        
        // Fallback: if audio doesn't load within 5 seconds, reject
        setTimeout(() => {
          reject(new Error('Audio loading timeout'));
        }, 5000);
      });
    } catch (error) {
      console.error('Audio playback failed:', error);
      throw new Error('Failed to play audio. Please check your speakers.');
    }
  }

  async getAvailableVoices() {
    try {
      const response = await apiRequest("GET", "/api/voice/voices");
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return [];
    }
  }

  // Medical-specific voice presets
  getPatientVoicePresets() {
    return {
      maleElderly: {
        description: 'Elderly Male Patient',
        characteristics: 'Slower speech, lower pitch, occasional breathiness'
      },
      femaleAdult: {
        description: 'Adult Female Patient',
        characteristics: 'Clear articulation, moderate pace, professional tone'
      },
      maleAdult: {
        description: 'Adult Male Patient', 
        characteristics: 'Confident tone, clear speech, moderate pitch'
      },
      femaleElderly: {
        description: 'Elderly Female Patient',
        characteristics: 'Gentle tone, careful pronunciation, wisdom in voice'
      },
      pediatric: {
        description: 'Pediatric Patient (Family Speaking)',
        characteristics: 'Caring parental tone, concerned but clear'
      }
    };
  }

  // Generate a cache key for audio caching
  private generateCacheKey(text: string, patientProfile?: VoiceSynthesisOptions['patientProfile']): string {
    const profileKey = patientProfile ? 
      `${patientProfile.age}-${patientProfile.gender}-${patientProfile.condition || ''}` : 
      'default';
    return `${text.slice(0, 50)}-${profileKey}`;
  }

  // Clear audio cache
  clearCache() {
    this.audioCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      entries: this.audioCache.size,
      memoryUsage: `~${this.audioCache.size * 0.1}MB` // Rough estimate
    };
  }

  // Preload common medical phrases
  async preloadCommonPhrases(patientProfile: VoiceSynthesisOptions['patientProfile']) {
    const commonPhrases = [
      "Yes, that's correct.",
      "No, that's not quite right.",
      "I'm not sure about that.",
      "The pain started about a week ago.",
      "It's been getting worse lately.",
      "I haven't experienced this before.",
      "Yes, I'm taking medication for that.",
      "No, I don't have any allergies.",
      "I'd rate the pain about a 7 out of 10."
    ];

    const promises = commonPhrases.map(phrase => 
      this.synthesizeText({ text: phrase, patientProfile })
        .catch(error => {
          console.warn(`Failed to preload phrase: ${phrase}`, error);
          return null;
        })
    );

    await Promise.allSettled(promises);
  }

  // Health check for voice synthesis service
  async healthCheck(): Promise<boolean> {
    try {
      await this.synthesizeText({ 
        text: "Health check test", 
        patientProfile: { age: 35, gender: "Male" } 
      });
      return true;
    } catch (error) {
      console.error('Voice synthesis health check failed:', error);
      return false;
    }
  }

  // Clean up resources
  dispose() {
    this.clearCache();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

export const voiceSynthesisService = new VoiceSynthesisService();

// Utility function for medical-specific text preprocessing
export function preprocessMedicalText(text: string): string {
  // Common medical abbreviations and their pronunciations
  const medicalAbbreviations: Record<string, string> = {
    'BP': 'blood pressure',
    'HR': 'heart rate',
    'RR': 'respiratory rate',
    'O2': 'oxygen',
    'CO2': 'carbon dioxide',
    'MI': 'myocardial infarction',
    'CHF': 'congestive heart failure',
    'COPD': 'chronic obstructive pulmonary disease',
    'UTI': 'urinary tract infection',
    'ICU': 'intensive care unit',
    'ER': 'emergency room',
    'IV': 'intravenous',
    'IM': 'intramuscular',
    'PO': 'by mouth',
    'PRN': 'as needed',
    'BID': 'twice daily',
    'TID': 'three times daily',
    'QID': 'four times daily'
  };

  let processedText = text;

  // Replace abbreviations with full words
  Object.entries(medicalAbbreviations).forEach(([abbr, fullForm]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    processedText = processedText.replace(regex, fullForm);
  });

  // Add pauses for better clarity
  processedText = processedText.replace(/\./g, '. <break time="0.5s"/>');
  processedText = processedText.replace(/,/g, ', <break time="0.3s"/>');

  // Emphasize important medical terms
  const importantTerms = ['pain', 'fever', 'bleeding', 'difficulty breathing', 'chest pain'];
  importantTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    processedText = processedText.replace(regex, `<emphasis level="moderate">${term}</emphasis>`);
  });

  return processedText;
}
