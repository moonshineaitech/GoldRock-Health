type ThinkingLevel = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';

interface GeminiOptions {
  thinkingLevel?: ThinkingLevel;
  maxTokens?: number;
  temperature?: number;
}

interface GeminiContent {
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
  role?: string;
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: { parts: Array<{ text: string }> };
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
    thinkingConfig?: { thinkingBudget: number };
    responseMimeType?: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

const THINKING_BUDGETS: Record<ThinkingLevel, number> = {
  MINIMAL: 128,
  LOW: 1024,
  MEDIUM: 8192,
  HIGH: 24576,
};

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

export class GeminiService {
  private apiKey: string;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_GEMINI_API_KEY is not set. Gemini service will not function.');
    }
    this.apiKey = apiKey || '';
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, retryCount);
          console.log(`Gemini API rate limited or server error. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`);
          await this.sleep(delay);
          return this.fetchWithRetry(url, options, retryCount + 1);
        }
      }
      
      return response;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.baseDelay * Math.pow(2, retryCount);
        console.log(`Gemini API request failed. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`);
        await this.sleep(delay);
        return this.fetchWithRetry(url, options, retryCount + 1);
      }
      throw error;
    }
  }

  private async makeRequest(request: GeminiRequest): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    const url = `${API_ENDPOINT}?key=${this.apiKey}`;
    
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data: GeminiResponse = await response.json();

    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message} (code: ${data.error.code})`);
    }

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    return data;
  }

  private extractTextFromResponse(response: GeminiResponse): string {
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No response candidates received from Gemini API');
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('No content parts in Gemini API response');
    }

    const textParts = parts.filter(part => part.text).map(part => part.text);
    return textParts.join('');
  }

  async generateContent(
    prompt: string,
    systemPrompt?: string,
    options: GeminiOptions = {}
  ): Promise<string> {
    try {
      const request: GeminiRequest = {
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user',
          },
        ],
        generationConfig: {},
      };

      if (systemPrompt) {
        request.systemInstruction = {
          parts: [{ text: systemPrompt }],
        };
      }

      if (options.maxTokens) {
        request.generationConfig!.maxOutputTokens = options.maxTokens;
      }

      if (options.temperature !== undefined) {
        request.generationConfig!.temperature = options.temperature;
      }

      if (options.thinkingLevel) {
        request.generationConfig!.thinkingConfig = {
          thinkingBudget: THINKING_BUDGETS[options.thinkingLevel],
        };
      }

      const response = await this.makeRequest(request);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error in Gemini generateContent:', error);
      throw error;
    }
  }

  async generateJSONContent<T>(
    prompt: string,
    systemPrompt?: string,
    options: GeminiOptions = {}
  ): Promise<T> {
    try {
      const jsonSystemPrompt = systemPrompt 
        ? `${systemPrompt}\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no code blocks, just raw JSON.`
        : 'You must respond with valid JSON only. No markdown, no code blocks, just raw JSON.';

      const request: GeminiRequest = {
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user',
          },
        ],
        systemInstruction: {
          parts: [{ text: jsonSystemPrompt }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
        },
      };

      if (options.maxTokens) {
        request.generationConfig!.maxOutputTokens = options.maxTokens;
      }

      if (options.temperature !== undefined) {
        request.generationConfig!.temperature = options.temperature;
      }

      if (options.thinkingLevel) {
        request.generationConfig!.thinkingConfig = {
          thinkingBudget: THINKING_BUDGETS[options.thinkingLevel],
        };
      }

      const response = await this.makeRequest(request);
      const text = this.extractTextFromResponse(response);
      
      try {
        return JSON.parse(text) as T;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', text);
        throw new Error(`Invalid JSON response from Gemini: ${parseError}`);
      }
    } catch (error) {
      console.error('Error in Gemini generateJSONContent:', error);
      throw error;
    }
  }

  async generateWithImage(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<string> {
    try {
      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageBase64,
                },
              },
              { text: prompt },
            ],
            role: 'user',
          },
        ],
      };

      const response = await this.makeRequest(request);
      return this.extractTextFromResponse(response);
    } catch (error) {
      console.error('Error in Gemini generateWithImage:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
