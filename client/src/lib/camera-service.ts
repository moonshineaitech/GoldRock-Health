/**
 * Camera Service - Capacitor-enabled with web fallback
 * This provides camera and photo library access for bill scanning
 * On iOS (Capacitor): Uses native Camera plugin
 * On web: Uses HTML5 Camera/File APIs
 */

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

export interface CameraPhoto {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

export class CameraService {
  private static instance: CameraService;
  private isNative: boolean;

  private constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  /**
   * Check if camera is available on this device
   */
  async isCameraAvailable(): Promise<boolean> {
    if (this.isNative) {
      try {
        const permissions = await Camera.checkPermissions();
        return permissions.camera !== 'denied';
      } catch (error) {
        return false;
      }
    }

    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.some(device => device.kind === 'videoinput');
      }
      return false;
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  }

  /**
   * Request camera permissions
   */
  async requestCameraPermission(): Promise<boolean> {
    if (this.isNative) {
      try {
        const permissions = await Camera.requestPermissions();
        return permissions.camera === 'granted';
      } catch (error) {
        console.error('Camera permission denied:', error);
        return false;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera
      });
      
      // Stop the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  /**
   * Capture photo from camera
   * iOS (Capacitor): Uses native Camera plugin
   * Web: Opens camera via file input
   */
  async capturePhoto(): Promise<CameraPhoto | null> {
    if (this.isNative) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          quality: 90,
          allowEditing: false,
          saveToGallery: false,
        });

        return {
          uri: `data:image/${photo.format};base64,${photo.base64String}`,
          base64: `data:image/${photo.format};base64,${photo.base64String}`,
        };
      } catch (error) {
        console.error('Error capturing photo:', error);
        return null;
      }
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Request back camera on mobile
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          const base64 = await this.fileToBase64(file);
          
          resolve({
            uri,
            base64,
          });
        } else {
          resolve(null);
        }
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  /**
   * Pick photo from library
   * iOS (Capacitor): Uses native Photos picker
   * Web: Opens file picker
   */
  async pickFromLibrary(): Promise<CameraPhoto | null> {
    if (this.isNative) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Photos,
          quality: 90,
          allowEditing: false,
        });

        return {
          uri: `data:image/${photo.format};base64,${photo.base64String}`,
          base64: `data:image/${photo.format};base64,${photo.base64String}`,
        };
      } catch (error) {
        console.error('Error picking photo:', error);
        return null;
      }
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          const base64 = await this.fileToBase64(file);
          
          resolve({
            uri,
            base64,
          });
        } else {
          resolve(null);
        }
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  /**
   * Pick multiple photos
   */
  async pickMultipleFromLibrary(): Promise<CameraPhoto[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      
      input.onchange = async (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        const photos: CameraPhoto[] = [];
        
        for (const file of files) {
          const uri = URL.createObjectURL(file);
          const base64 = await this.fileToBase64(file);
          photos.push({ uri, base64 });
        }
        
        resolve(photos);
      };

      input.oncancel = () => resolve([]);
      input.click();
    });
  }

  /**
   * Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Compress image before upload
   */
  async compressImage(uri: string, maxWidth = 1920, quality = 0.8): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = uri;
    });
  }
}

export const cameraService = CameraService.getInstance();
