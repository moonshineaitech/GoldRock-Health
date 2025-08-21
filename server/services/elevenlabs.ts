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

  async synthesizeText(options: VoiceSynthesisOptions): Promise<VoiceSynthesisResponse> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const {
      text,
      voiceId = 'pNInz6obpgDQGcFmaJgB', // Default professional voice
      stability = 0.5,
      similarityBoost = 0.75,
      modelId = 'eleven_monolingual_v1'
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      
      // In a real implementation, you'd save this to a file storage service
      // For now, we'll return a placeholder URL
      const audioUrl = `/api/audio/${Date.now()}.mp3`;

      return {
        audioUrl,
        audioBuffer,
      };
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error('Failed to synthesize speech');
    }
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
    const voices = this.getPatientVoices();
    let voiceId = voices.maleAdult;

    // Select appropriate voice based on patient profile
    if (patientProfile.age < 18) {
      voiceId = voices.pediatric;
    } else if (patientProfile.age > 65) {
      voiceId = patientProfile.gender === 'Female' ? voices.femaleElderly : voices.maleElderly;
    } else {
      voiceId = patientProfile.gender === 'Female' ? voices.femaleAdult : voices.maleAdult;
    }

    // Adjust voice settings based on medical condition
    let stability = 0.5;
    let similarityBoost = 0.75;

    if (patientProfile.condition?.toLowerCase().includes('anxiety')) {
      stability = 0.3; // More variation for anxious speech
    } else if (patientProfile.condition?.toLowerCase().includes('pain')) {
      stability = 0.4; // Slightly strained voice
    }

    return this.synthesizeText({
      text,
      voiceId,
      stability,
      similarityBoost,
    });
  }
}

export const elevenLabsService = new ElevenLabsService();
