import { voiceCacheService } from './voiceCache';

export interface VoiceSynthesisOptions {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  modelId?: string;
}

export interface VoiceSynthesisResponse {
  audioUrl: string;
  audioBuffer?: Buffer;
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Voice synthesis will be disabled.');
    }
  }

  async synthesizeText(options: VoiceSynthesisOptions, patientProfile?: {
    age: number;
    gender: string;
    condition?: string;
  }): Promise<VoiceSynthesisResponse> {
    const { text } = options;
    
    // VOICE PROCESSING DISABLED - Always return mock response
    console.log('Voice synthesis disabled - returning mock response');
    const mockBuffer = Buffer.from('mock-audio-data');
    const cacheEntry = await voiceCacheService.storeAudio(text, mockBuffer, patientProfile);
    return {
      audioUrl: cacheEntry.audioUrl,
      audioBuffer: mockBuffer,
    };
  }

  async getAvailableVoices() {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  // Medical-specific voice presets
  getPatientVoices() {
    return {
      maleElderly: 'pNInz6obpgDQGcFmaJgB', // Professional male voice
      femaleAdult: '21m00Tcm4TlvDq8ikWAM', // Professional female voice
      maleAdult: 'VR6AewLTigWG4xSOukaG', // Young adult male
      femaleElderly: 'AZnzlk1XvdvUeBnXmlld', // Elderly female
      pediatric: 'EXAVITQu4vr4xnSDxMaL', // Child-like voice
    };
  }

  async synthesizePatientResponse(text: string, patientProfile: {
    age: number;
    gender: string;
    condition?: string;
  }): Promise<VoiceSynthesisResponse> {
    // VOICE PROCESSING DISABLED - Always return mock response
    console.log('Patient voice synthesis disabled - returning mock response');
    const mockBuffer = Buffer.from('mock-patient-audio-data');
    const cacheEntry = await voiceCacheService.storeAudio(text, mockBuffer, patientProfile);
    return {
      audioUrl: cacheEntry.audioUrl,
      audioBuffer: mockBuffer,
    };
  }
}

export const elevenLabsService = new ElevenLabsService();
