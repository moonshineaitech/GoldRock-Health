import { GeminiService } from './gemini';
import { OpenAIService } from './openai';

export type ThinkingLevel = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
export type AIProviderType = 'gemini' | 'openai' | 'auto';

export interface AIOptions {
  provider?: AIProviderType;
  maxTokens?: number;
  temperature?: number;
  thinkingLevel?: ThinkingLevel;
}

class AIProvider {
  private geminiService: GeminiService;
  private openAIService: OpenAIService;

  constructor() {
    this.geminiService = new GeminiService();
    this.openAIService = new OpenAIService();
  }

  private isGeminiAvailable(): boolean {
    return !!process.env.GOOGLE_GEMINI_API_KEY;
  }

  private isOpenAIAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  private resolveProvider(options?: AIOptions): 'gemini' | 'openai' {
    const requestedProvider = options?.provider || 'auto';

    if (requestedProvider === 'gemini') {
      if (!this.isGeminiAvailable()) {
        throw new Error('Gemini provider requested but GOOGLE_GEMINI_API_KEY is not configured');
      }
      return 'gemini';
    }

    if (requestedProvider === 'openai') {
      if (!this.isOpenAIAvailable()) {
        throw new Error('OpenAI provider requested but OPENAI_API_KEY is not configured');
      }
      return 'openai';
    }

    if (this.isGeminiAvailable()) {
      return 'gemini';
    }

    if (this.isOpenAIAvailable()) {
      return 'openai';
    }

    throw new Error('No AI provider available. Please configure GOOGLE_GEMINI_API_KEY or OPENAI_API_KEY');
  }

  private log(method: string, provider: string): void {
    console.log(`[AIProvider] ${method} using ${provider.toUpperCase()}`);
  }

  async generateText(
    prompt: string,
    systemPrompt?: string,
    options?: AIOptions
  ): Promise<string> {
    const provider = this.resolveProvider(options);
    this.log('generateText', provider);

    if (provider === 'gemini') {
      try {
        return await this.geminiService.generateContent(prompt, systemPrompt, {
          maxTokens: options?.maxTokens,
          temperature: options?.temperature,
          thinkingLevel: options?.thinkingLevel,
        });
      } catch (error) {
        if (options?.provider === 'gemini') {
          throw error;
        }
        if (this.isOpenAIAvailable()) {
          console.warn('[AIProvider] Gemini failed, falling back to OpenAI:', error);
          this.log('generateText (fallback)', 'openai');
          return this.generateTextWithOpenAI(prompt, systemPrompt, options);
        }
        throw error;
      }
    }

    return this.generateTextWithOpenAI(prompt, systemPrompt, options);
  }

  private async generateTextWithOpenAI(
    prompt: string,
    systemPrompt?: string,
    options?: AIOptions
  ): Promise<string> {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.openAIService.openai.chat.completions.create({
      model: 'gpt-5.2',
      messages,
      max_tokens: options?.maxTokens,
      temperature: options?.temperature,
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options?: AIOptions
  ): Promise<T> {
    const provider = this.resolveProvider(options);
    this.log('generateJSON', provider);

    if (provider === 'gemini') {
      try {
        return await this.geminiService.generateJSONContent<T>(prompt, systemPrompt, {
          maxTokens: options?.maxTokens,
          temperature: options?.temperature,
          thinkingLevel: options?.thinkingLevel,
        });
      } catch (error) {
        if (options?.provider === 'gemini') {
          throw error;
        }
        if (this.isOpenAIAvailable()) {
          console.warn('[AIProvider] Gemini failed, falling back to OpenAI:', error);
          this.log('generateJSON (fallback)', 'openai');
          return this.generateJSONWithOpenAI<T>(prompt, systemPrompt, options);
        }
        throw error;
      }
    }

    return this.generateJSONWithOpenAI<T>(prompt, systemPrompt, options);
  }

  private async generateJSONWithOpenAI<T>(
    prompt: string,
    systemPrompt?: string,
    options?: AIOptions
  ): Promise<T> {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    const jsonSystemPrompt = systemPrompt
      ? `${systemPrompt}\n\nIMPORTANT: You must respond with valid JSON only.`
      : 'You must respond with valid JSON only.';
    
    messages.push({ role: 'system', content: jsonSystemPrompt });
    messages.push({ role: 'user', content: prompt });

    const response = await this.openAIService.openai.chat.completions.create({
      model: 'gpt-5.2',
      messages,
      max_tokens: options?.maxTokens,
      temperature: options?.temperature,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }

  async generateWithImage(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<string> {
    if (this.isGeminiAvailable()) {
      this.log('generateWithImage', 'gemini');
      try {
        return await this.geminiService.generateWithImage(prompt, imageBase64, mimeType);
      } catch (error) {
        if (this.isOpenAIAvailable()) {
          console.warn('[AIProvider] Gemini failed for image, falling back to OpenAI:', error);
          this.log('generateWithImage (fallback)', 'openai');
          return this.generateWithImageOpenAI(prompt, imageBase64, mimeType);
        }
        throw error;
      }
    }

    if (this.isOpenAIAvailable()) {
      this.log('generateWithImage', 'openai');
      return this.generateWithImageOpenAI(prompt, imageBase64, mimeType);
    }

    throw new Error('No AI provider available for image analysis');
  }

  private async generateWithImageOpenAI(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<string> {
    const response = await this.openAIService.openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 4096,
    });

    return response.choices[0]?.message?.content || '';
  }

  getAvailableProviders(): AIProviderType[] {
    const providers: AIProviderType[] = [];
    if (this.isGeminiAvailable()) providers.push('gemini');
    if (this.isOpenAIAvailable()) providers.push('openai');
    return providers;
  }

  getPrimaryProvider(): 'gemini' | 'openai' | null {
    if (this.isGeminiAvailable()) return 'gemini';
    if (this.isOpenAIAvailable()) return 'openai';
    return null;
  }
}

export const aiProvider = new AIProvider();
