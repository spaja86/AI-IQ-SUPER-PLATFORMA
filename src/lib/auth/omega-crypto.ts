// SpajaUltraOmegaCore -∞Ω+∞ — Omega Crypto Engine
// Kompanija SPAJA — Digitalna Industrija
// Koristi Node.js built-in crypto modul (bez eksternih zavisnosti)

import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { ΩKey, ΩKeyPair, ΩEncryptedPayload } from './types';

// ΩCryptoEngine — enkapsulira sve kriptografske operacije
export class ΩCryptoEngine {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_LENGTH = 32;
  private static readonly PBKDF2_ITERATIONS = 310000; // OWASP preporuka za PBKDF2-SHA512
  private static readonly PBKDF2_KEYLEN = 64;
  private static readonly PBKDF2_DIGEST = 'sha512';

  // generateKeyPair — generiše Ed25519 par ključeva
  static async generateKeyPair(): Promise<ΩKeyPair> {
    const { generateKeyPairSync } = await import('crypto');
    const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    });

    return {
      publicKey: publicKey.toString('hex'),
      privateKey: privateKey.toString('hex'),
      algorithm: 'Ed25519',
      createdAt: Date.now(),
    };
  }

  // generateSymmetricKey — generiše AES-256-GCM ključ
  static generateSymmetricKey(): ΩKey {
    return {
      value: randomBytes(this.KEY_LENGTH).toString('hex'),
      algorithm: 'AES-256-GCM',
      createdAt: Date.now(),
    };
  }

  // hashPassword — kriptografski hash lozinke (PBKDF2-SHA512 sa solju)
  // Prati OWASP preporuku za PBKDF2: 310.000 iteracija sa SHA-512
  // Napomena: Za maksimalnu bezbednost u produkciji, koristiti Argon2id (zahteva native modul)
  static async hashPassword(pwd: string): Promise<string> {
    const { pbkdf2 } = await import('crypto');
    const salt = randomBytes(this.SALT_LENGTH);

    return new Promise<string>((resolve, reject) => {
      pbkdf2(
        pwd,
        salt,
        this.PBKDF2_ITERATIONS,
        this.PBKDF2_KEYLEN,
        this.PBKDF2_DIGEST,
        (err, derivedKey) => {
          if (err) { reject(err); return; }
          // Format: iterations$salt$hash
          resolve(`${this.PBKDF2_ITERATIONS}$${salt.toString('base64')}$${derivedKey.toString('base64')}`);
        }
      );
    });
  }

  // verifyPassword — verifikuje lozinku
  static async verifyPassword(pwd: string, hash: string): Promise<boolean> {
    const { pbkdf2 } = await import('crypto');
    const parts = hash.split('$');
    if (parts.length !== 3) return false;

    const [iterStr, saltBase64, hashBase64] = parts;
    const iterations = parseInt(iterStr, 10);
    const salt = Buffer.from(saltBase64, 'base64');
    const expectedHash = Buffer.from(hashBase64, 'base64');

    return new Promise<boolean>((resolve, reject) => {
      pbkdf2(
        pwd,
        salt,
        iterations,
        this.PBKDF2_KEYLEN,
        this.PBKDF2_DIGEST,
        (err, derivedKey) => {
          if (err) { reject(err); return; }
          try {
            resolve(timingSafeEqual(derivedKey, expectedHash));
          } catch {
            resolve(false);
          }
        }
      );
    });
  }

  // encryptPayload — enkriptuje podatke (AES-256-GCM)
  static encryptPayload(data: unknown, key: ΩKey): ΩEncryptedPayload {
    const keyBuffer = Buffer.from(key.value, 'hex');
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, keyBuffer, iv);

    const serialized = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(serialized, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      algorithm: 'AES-256-GCM',
    };
  }

  // decryptPayload — dekriptuje podatke (AES-256-GCM)
  static decryptPayload(payload: ΩEncryptedPayload, key: ΩKey): unknown {
    const keyBuffer = Buffer.from(key.value, 'hex');
    const iv = Buffer.from(payload.iv, 'base64');
    const authTag = Buffer.from(payload.authTag, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');

    const decipher = createDecipheriv(this.ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8')) as unknown;
  }

  // signData — Ed25519 potpis podataka
  static async signData(data: string, privateKeyHex: string): Promise<string> {
    const { createSign } = await import('crypto');
    const privateKeyDer = Buffer.from(privateKeyHex, 'hex');

    const sign = createSign('ed25519');
    sign.update(data);

    const privateKeyObj = {
      key: privateKeyDer,
      format: 'der' as const,
      type: 'pkcs8' as const,
    };

    const signature = sign.sign(privateKeyObj);
    return signature.toString('base64');
  }

  // verifySignature — verifikuje Ed25519 potpis
  static async verifySignature(
    data: string,
    signature: string,
    publicKeyHex: string
  ): Promise<boolean> {
    try {
      const { createVerify } = await import('crypto');
      const publicKeyDer = Buffer.from(publicKeyHex, 'hex');

      const verify = createVerify('ed25519');
      verify.update(data);

      const publicKeyObj = {
        key: publicKeyDer,
        format: 'der' as const,
        type: 'spki' as const,
      };

      return verify.verify(publicKeyObj, Buffer.from(signature, 'base64'));
    } catch {
      return false;
    }
  }

  // hashSHA256 — SHA-256 hash
  static hashSHA256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  // hmacSHA256 — HMAC-SHA256
  static hmacSHA256(data: string, secret: string): string {
    return createHmac('sha256', secret).update(data).digest('hex');
  }

  // generateSecureToken — generiše kriptografski siguran nasumičan token
  static generateSecureToken(bytes = 32): string {
    return randomBytes(bytes).toString('base64url');
  }

  // generateId — generiše jedinstveni ID
  static generateId(): string {
    return randomBytes(16).toString('hex');
  }

  // timingSafeCompare — bezbedna komparacija stringova (sprečava timing napade)
  static timingSafeCompare(a: string, b: string): boolean {
    try {
      const bufA = Buffer.from(a, 'utf8');
      const bufB = Buffer.from(b, 'utf8');
      if (bufA.length !== bufB.length) {
        // Uvek izvrši komparaciju čak i kad su dužine različite
        // da bi se sprečio timing napad koji otkriva dužinu
        timingSafeEqual(bufA, bufA);
        return false;
      }
      return timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  // generateTOTPSecret — generiše TOTP tajni ključ (RFC 6238)
  static generateTOTPSecret(): string {
    return randomBytes(20).toString('base64');
  }

  // verifyTOTP — verifikuje TOTP kod (RFC 6238 kompatibilno)
  static verifyTOTP(secret: string, code: string, windowSize = 1): boolean {
    const secretBuffer = Buffer.from(secret, 'base64');
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 30;

    for (let i = -windowSize; i <= windowSize; i++) {
      const counter = Math.floor(now / timeStep) + i;
      const expected = this.generateHOTP(secretBuffer, counter);
      if (this.timingSafeCompare(code.padStart(6, '0'), expected.padStart(6, '0'))) {
        return true;
      }
    }
    return false;
  }

  // generateHOTP — RFC 4226 HOTP implementacija
  private static generateHOTP(secret: Buffer, counter: number): string {
    const counterBuffer = Buffer.allocUnsafe(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const hmac = createHmac('sha1', secret).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;

    const otp =
      (((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)) %
      1000000;

    return String(otp).padStart(6, '0');
  }

  // encodeBase32 — base32 enkodovanje za TOTP URI-je
  static encodeBase32(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of buffer) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        bits -= 5;
        result += alphabet[(value >> bits) & 31];
      }
    }
    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }
    return result;
  }
}
