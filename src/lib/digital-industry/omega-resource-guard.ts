// SpajaUltraOmegaCore -∞Ω+∞ — Omega Resource Guard
// Kompanija SPAJA — Digitalna Industrija

import type { ΩIdentity, ΩResource } from '../auth/types';
import { ΩClearanceLevel } from '../auth/types';
import { ΩPermissionMatrix } from '../auth/omega-permissions';
import { ΩCryptoEngine } from '../auth/omega-crypto';

export { ΩClearanceLevel };

// ΩResourceDefinition — definicija resursa sa zaštitom
export interface ΩResourceDefinition {
  resourceId: string;
  path: string;
  type: ΩResource['type'];
  classification: ΩResource['classification'];
  requiredClearance: ΩClearanceLevel;
  encryptedAtRest: boolean;
  auditAccess: boolean;
}

// Registar svih resursa "Digitalne Industrije"
const DIGITAL_INDUSTRY_RESOURCES: ΩResourceDefinition[] = [
  {
    resourceId: 'di:api:status',
    path: '/api/status',
    type: 'API',
    classification: 'PUBLIC',
    requiredClearance: ΩClearanceLevel.VISITOR,
    encryptedAtRest: false,
    auditAccess: false,
  },
  {
    resourceId: 'di:api:health',
    path: '/api/health',
    type: 'API',
    classification: 'PUBLIC',
    requiredClearance: ΩClearanceLevel.VISITOR,
    encryptedAtRest: false,
    auditAccess: false,
  },
  {
    resourceId: 'di:api:auth',
    path: '/api/auth',
    type: 'API',
    classification: 'INTERNAL',
    requiredClearance: ΩClearanceLevel.VISITOR,
    encryptedAtRest: true,
    auditAccess: true,
  },
  {
    resourceId: 'di:api:auto-repair',
    path: '/api/auto-repair',
    type: 'API',
    classification: 'CONFIDENTIAL',
    requiredClearance: ΩClearanceLevel.OPERATOR,
    encryptedAtRest: true,
    auditAccess: true,
  },
  {
    resourceId: 'di:ui:dashboard',
    path: '/dashboard',
    type: 'UI',
    classification: 'INTERNAL',
    requiredClearance: ΩClearanceLevel.USER,
    encryptedAtRest: false,
    auditAccess: false,
  },
  {
    resourceId: 'di:ui:omega-ai',
    path: '/omega-ai',
    type: 'OMEGA_MODULE',
    classification: 'CONFIDENTIAL',
    requiredClearance: ΩClearanceLevel.USER,
    encryptedAtRest: false,
    auditAccess: true,
  },
  {
    resourceId: 'di:ui:security',
    path: '/security',
    type: 'OMEGA_MODULE',
    classification: 'TOP_SECRET',
    requiredClearance: ΩClearanceLevel.OMEGA_CORE,
    encryptedAtRest: true,
    auditAccess: true,
  },
  {
    resourceId: 'di:data:users',
    path: '/api/users',
    type: 'DATA',
    classification: 'CONFIDENTIAL',
    requiredClearance: ΩClearanceLevel.ADMIN,
    encryptedAtRest: true,
    auditAccess: true,
  },
  {
    resourceId: 'di:data:audit',
    path: '/api/audit',
    type: 'DATA',
    classification: 'TOP_SECRET',
    requiredClearance: ΩClearanceLevel.ADMIN,
    encryptedAtRest: true,
    auditAccess: true,
  },
  {
    resourceId: 'di:omega:core',
    path: '/api/omega-core',
    type: 'OMEGA_MODULE',
    classification: 'OMEGA',
    requiredClearance: ΩClearanceLevel.OMEGA_CORE,
    encryptedAtRest: true,
    auditAccess: true,
  },
];

// ΩResourceGuard — štiti SVE resurse "Digitalne Industrije"
export class ΩResourceGuard {
  // guard — proverava pristup resursu
  static guard(identity: ΩIdentity, resourcePath: string): boolean {
    const resource = this.findResource(resourcePath);

    if (!resource) {
      // Nepoznati resurs — dozvoli za autentifikovane korisnike (USER+)
      return identity.clearanceLevel >= ΩClearanceLevel.USER;
    }

    const omegaResource: ΩResource = {
      id: resource.resourceId,
      type: resource.type,
      path: resource.path,
      classification: resource.classification,
    };

    // Provjeri u matrici dozvola
    return ΩPermissionMatrix.checkAccess(identity, omegaResource);
  }

  // guardAsync — asinhrona verzija provjere pristupa
  static async guardAsync(identity: ΩIdentity, resourcePath: string): Promise<boolean> {
    return this.guard(identity, resourcePath);
  }

  // getResourceInfo — dohvata informacije o resursu
  static getResourceInfo(path: string): ΩResourceDefinition | null {
    return this.findResource(path);
  }

  // getAllResources — lista svih resursa
  static getAllResources(): ΩResourceDefinition[] {
    return DIGITAL_INDUSTRY_RESOURCES;
  }

  // encryptData — enkriptuje podatke resursa koji zahtevaju enkriptovanje u mirovanju
  static encryptAtRest(data: unknown, resourceId: string): string {
    const key = ΩCryptoEngine.generateSymmetricKey();
    const encrypted = ΩCryptoEngine.encryptPayload(data, key);
    // U produkciji: key se čuva u KMS
    return JSON.stringify({ payload: encrypted, keyId: `${resourceId}:${Date.now()}` });
  }

  // getClassificationLabel — oznaka klasifikacije
  static getClassificationLabel(classification: ΩResource['classification']): string {
    const labels: Record<ΩResource['classification'], string> = {
      PUBLIC: '🟢 JAVNO',
      INTERNAL: '🔵 INTERNO',
      CONFIDENTIAL: '🟡 POVERLJIVO',
      TOP_SECRET: '🔴 STROGO POVERLJIVO',
      OMEGA: '⚫ OMEGA -∞Ω+∞',
    };
    return labels[classification];
  }

  private static findResource(path: string): ΩResourceDefinition | null {
    return (
      DIGITAL_INDUSTRY_RESOURCES.find(
        (r) => path.startsWith(r.path) || r.path === path
      ) ?? null
    );
  }
}
