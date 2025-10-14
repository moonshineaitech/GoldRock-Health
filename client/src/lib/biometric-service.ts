/**
 * Biometric Authentication Service
 * Web: Uses Web Authentication API (WebAuthn) for fingerprint/face
 * iOS: Would use expo-local-authentication for Face ID/Touch ID
 */

export class BiometricService {
  private static instance: BiometricService;

  private constructor() {}

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  /**
   * Check if biometric hardware is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Check for WebAuthn support (Face ID, Touch ID, Windows Hello, etc.)
      if (!window.PublicKeyCredential) {
        return false;
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedTypes(): Promise<string[]> {
    const types: string[] = [];
    
    if (await this.isAvailable()) {
      // On web, we can't determine specific type, so we return generic
      types.push('biometric');
      
      // On iOS, this would return ['faceID', 'touchID', 'passcode']
    }

    return types;
  }

  /**
   * Authenticate with biometrics
   */
  async authenticate(reason: string = 'Authenticate to access GoldRock Health'): Promise<boolean> {
    try {
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('Biometric authentication not available');
      }

      // Create credential for authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: this.generateChallenge(),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000,
        },
      });

      return !!credential;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  /**
   * Enroll biometrics (first-time setup)
   */
  async enroll(userId: string): Promise<boolean> {
    try {
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('Biometric authentication not available');
      }

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: this.generateChallenge(),
          rp: {
            name: 'GoldRock Health',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userId,
            displayName: 'GoldRock User',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },  // ES256
            { type: 'public-key', alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      });

      if (credential) {
        // Save credential info to localStorage for future use
        localStorage.setItem('biometric_enrolled', 'true');
        localStorage.setItem('biometric_credential_id', userId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
      return false;
    }
  }

  /**
   * Check if biometrics are enrolled
   */
  isEnrolled(): boolean {
    return localStorage.getItem('biometric_enrolled') === 'true';
  }

  /**
   * Disable biometrics
   */
  disable(): void {
    localStorage.removeItem('biometric_enrolled');
    localStorage.removeItem('biometric_credential_id');
  }

  /**
   * Generate random challenge for WebAuthn
   */
  private generateChallenge(): Uint8Array {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    return challenge;
  }

  /**
   * Quick biometric check (for app unlock)
   */
  async quickAuth(): Promise<boolean> {
    if (!this.isEnrolled()) {
      return false;
    }

    return await this.authenticate('Unlock GoldRock Health');
  }
}

export const biometricService = BiometricService.getInstance();
