// SpajaUltraOmegaCore -∞Ω+∞ — Omega Identity
// Kompanija SPAJA — Digitalna Industrija

import type { ΩIdentity, ΩKey, ΩEncryptedPayload } from './types';
import { ΩClearanceLevel } from './types';
import { ΩCryptoEngine } from './omega-crypto';

export type { ΩIdentity };

// ΩIdentityVault — enkriptovano čuvanje identiteta (AES-256-GCM)
export class ΩIdentityVault {
  private readonly store = new Map<string, ΩEncryptedPayload>();
  private readonly vaultKey: ΩKey;

  constructor(vaultKeyHex?: string) {
    this.vaultKey = vaultKeyHex
      ? { value: vaultKeyHex, algorithm: 'AES-256-GCM', createdAt: Date.now() }
      : ΩCryptoEngine.generateSymmetricKey();
  }

  // store — čuva identitet enkriptovano
  storeIdentity(identity: ΩIdentity): void {
    const encrypted = ΩCryptoEngine.encryptPayload(identity, this.vaultKey);
    this.store.set(identity.id, encrypted);
  }

  // retrieve — dohvata i dekriptuje identitet
  retrieveIdentity(id: string): ΩIdentity | null {
    const encrypted = this.store.get(id);
    if (!encrypted) return null;
    try {
      return ΩCryptoEngine.decryptPayload(encrypted, this.vaultKey) as ΩIdentity;
    } catch {
      return null;
    }
  }

  // delete — briše identitet iz vaulta
  deleteIdentity(id: string): void {
    this.store.delete(id);
  }

  // list — lista svih ID-jeva
  listIds(): string[] {
    return Array.from(this.store.keys());
  }

  // count — ukupan broj identiteta
  count(): number {
    return this.store.size;
  }
}

// createIdentity — kreira novi ΩIdentity
export async function createIdentity(params: {
  email: string;
  password?: string;
  roles?: string[];
  clearanceLevel?: ΩClearanceLevel;
}): Promise<ΩIdentity> {
  const id = ΩCryptoEngine.generateId();
  const keyPair = await ΩCryptoEngine.generateKeyPair();
  const did = generateDID(id, keyPair.publicKey);

  // Hash lozinke ako je prosleđena
  let passwordHash: string | undefined;
  if (params.password) {
    passwordHash = await ΩCryptoEngine.hashPassword(params.password);
  }

  return {
    id,
    did,
    publicKey: keyPair.publicKey,
    roles: params.roles ?? ['user'],
    clearanceLevel: params.clearanceLevel ?? ΩClearanceLevel.USER,
    digitalIndustryAccess: true,
    email: params.email,
    passwordHash,
    mfaEnabled: false,
    createdAt: Date.now(),
  };
}

// generateDID — generiše DID (Decentralized Identifier) po did:omega metodi
function generateDID(id: string, publicKey: string): string {
  const fingerprint = ΩCryptoEngine.hashSHA256(`${id}:${publicKey}`).slice(0, 32);
  return `did:omega:${fingerprint}`;
}

// Singleton instanca vaulta za globalnu upotrebu
let _globalVault: ΩIdentityVault | null = null;

export function getGlobalVault(): ΩIdentityVault {
  if (!_globalVault) {
    const key = process.env.OMEGA_VAULT_KEY;
    _globalVault = new ΩIdentityVault(key);
  }
  return _globalVault;
}
