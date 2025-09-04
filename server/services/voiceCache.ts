import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface VoiceCacheEntry {
  audioUrl: string;
  audioBuffer: Buffer;
  timestamp: number;
  textHash: string;
}

export class VoiceCacheService {
  private cacheDir: string;
  private memoryCache = new Map<string, VoiceCacheEntry>();

  constructor() {
    this.cacheDir = path.join(process.cwd(), "voice_cache");
    this.ensureCacheDir();
  }

  private async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn("Failed to create voice cache directory:", error);
    }
  }

  // Generate unique hash for text + patient profile combination
  private generateCacheKey(text: string, patientProfile?: {
    age: number;
    gender: string;
    condition?: string;
  }): string {
    const combined = `${text}_${patientProfile?.age || 'unknown'}_${patientProfile?.gender || 'unknown'}_${patientProfile?.condition || 'none'}`;
    return crypto.createHash('md5').update(combined).digest('hex');
  }

  // Check if we have cached audio for this text/profile combination
  async getCachedAudio(text: string, patientProfile?: {
    age: number;
    gender: string;
    condition?: string;
  }): Promise<VoiceCacheEntry | null> {
    const cacheKey = this.generateCacheKey(text, patientProfile);
    
    // Check memory cache first
    if (this.memoryCache.has(cacheKey)) {
      const entry = this.memoryCache.get(cacheKey)!;
      console.log(`Voice cache HIT (memory): ${cacheKey.substring(0, 8)}...`);
      return entry;
    }

    // Check file cache
    try {
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.mp3`);
      const audioBuffer = await fs.readFile(cacheFile);
      
      const entry: VoiceCacheEntry = {
        audioUrl: `/api/voice-cache/${cacheKey}.mp3`,
        audioBuffer,
        timestamp: Date.now(),
        textHash: cacheKey,
      };
      
      // Store in memory cache for faster future access
      this.memoryCache.set(cacheKey, entry);
      console.log(`Voice cache HIT (disk): ${cacheKey.substring(0, 8)}...`);
      
      return entry;
    } catch (error) {
      // Cache miss
      console.log(`Voice cache MISS: ${cacheKey.substring(0, 8)}...`);
      return null;
    }
  }

  // Store generated audio in cache
  async storeAudio(text: string, audioBuffer: Buffer, patientProfile?: {
    age: number;
    gender: string;
    condition?: string;
  }): Promise<VoiceCacheEntry> {
    const cacheKey = this.generateCacheKey(text, patientProfile);
    
    const entry: VoiceCacheEntry = {
      audioUrl: `/api/voice-cache/${cacheKey}.mp3`,
      audioBuffer,
      timestamp: Date.now(),
      textHash: cacheKey,
    };

    // Store in memory cache
    this.memoryCache.set(cacheKey, entry);
    
    // Store in file cache
    try {
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.mp3`);
      await fs.writeFile(cacheFile, audioBuffer);
      console.log(`Voice cached: ${cacheKey.substring(0, 8)}... (${text.substring(0, 50)}...)`);
    } catch (error) {
      console.warn("Failed to cache audio file:", error);
    }
    
    return entry;
  }

  // Get cached audio file by filename
  async getCachedAudioFile(filename: string): Promise<Buffer | null> {
    // Check memory cache first
    const cacheKey = filename.replace('.mp3', '');
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry) {
      return memoryEntry.audioBuffer;
    }

    // Check file cache
    try {
      const cacheFile = path.join(this.cacheDir, filename);
      return await fs.readFile(cacheFile);
    } catch (error) {
      return null;
    }
  }

  // Clean up old cache entries (older than 7 days)
  async cleanupOldEntries() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.timestamp < oneWeekAgo) {
        this.memoryCache.delete(key);
      }
    }

    // Clean file cache
    try {
      const files = await fs.readdir(this.cacheDir);
      for (const file of files) {
        if (file.endsWith('.mp3')) {
          const filePath = path.join(this.cacheDir, file);
          const stats = await fs.stat(filePath);
          if (stats.mtime.getTime() < oneWeekAgo) {
            await fs.unlink(filePath);
            console.log(`Cleaned up old voice cache file: ${file}`);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to cleanup voice cache:", error);
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      cacheDir: this.cacheDir,
    };
  }
}

export const voiceCacheService = new VoiceCacheService();