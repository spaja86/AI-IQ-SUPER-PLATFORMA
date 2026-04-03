// SpajaUltraOmegaCore -∞Ω+∞ — Omega Permission Matrix
// Kompanija SPAJA — Digitalna Industrija

import type { ΩIdentity, ΩResource, ΩScope } from './types';
import { ΩClearanceLevel } from './types';

// Re-export za lakši uvoz
export { ΩClearanceLevel };

// ΩPermissionRule — pravilo dozvole
interface ΩPermissionRule {
  resourcePattern: RegExp;
  requiredClearance: ΩClearanceLevel;
  requiredScopes?: ΩScope[];
  allowedRoles?: string[];
}

// PERMISSION_MATRIX — matrica dozvola za sve resurse "Digitalne Industrije"
const PERMISSION_MATRIX: ΩPermissionRule[] = [
  // Javni resursi
  {
    resourcePattern: /^\/api\/(status|health)$/,
    requiredClearance: ΩClearanceLevel.VISITOR,
  },
  // Autentifikovani korisnici
  {
    resourcePattern: /^\/api\/auth\//,
    requiredClearance: ΩClearanceLevel.VISITOR,
  },
  {
    resourcePattern: /^\/(dashboard|omega-ai|ai-platforma|deploy|ekosistem)$/,
    requiredClearance: ΩClearanceLevel.USER,
  },
  // Operateri
  {
    resourcePattern: /^\/api\/auto-repair/,
    requiredClearance: ΩClearanceLevel.OPERATOR,
    requiredScopes: ['digital_industry:write'],
  },
  // Administratori
  {
    resourcePattern: /^\/api\/users/,
    requiredClearance: ΩClearanceLevel.ADMIN,
    requiredScopes: ['users:manage'],
  },
  {
    resourcePattern: /^\/api\/audit/,
    requiredClearance: ΩClearanceLevel.ADMIN,
    requiredScopes: ['audit:read'],
  },
  // Super administratori
  {
    resourcePattern: /^\/api\/digital-industry\/admin/,
    requiredClearance: ΩClearanceLevel.SUPER_ADMIN,
    requiredScopes: ['digital_industry:admin'],
  },
  // OMEGA CORE — najviši nivo
  {
    resourcePattern: /^\/security/,
    requiredClearance: ΩClearanceLevel.OMEGA_CORE,
    requiredScopes: ['omega_core:access'],
  },
  {
    resourcePattern: /^\/api\/omega-core/,
    requiredClearance: ΩClearanceLevel.OMEGA_CORE,
    requiredScopes: ['omega_core:access'],
  },
];

// ΩPermissionMatrix — upravljanje dozvolama
export class ΩPermissionMatrix {
  // checkAccess — sinhrona provjera pristupa (double-check princip)
  static checkAccess(identity: ΩIdentity, resource: ΩResource): boolean {
    return this.checkAccessByPath(identity, resource.path);
  }

  // checkAccessByPath — provjera pristupa na osnovu putanje
  static checkAccessByPath(identity: ΩIdentity, path: string): boolean {
    // Zero Trust: svaki zahtev se proverava posebno
    const rule = this.findMatchingRule(path);

    // Nije pronađeno pravilo — odbij pristup (Zero Trust default-deny)
    if (!rule) {
      // Dozvoli opšte stranice za autentifikovane korisnike
      if (identity.clearanceLevel >= ΩClearanceLevel.USER) return true;
      return false;
    }

    // Provjeri clearance nivo
    if (identity.clearanceLevel < rule.requiredClearance) {
      return false;
    }

    // Provjeri digitalni industrijski pristup (za nivo >= OPERATOR)
    if (
      rule.requiredClearance >= ΩClearanceLevel.OPERATOR &&
      !identity.digitalIndustryAccess
    ) {
      return false;
    }

    // Provjeri role (ako su definisane)
    if (rule.allowedRoles && rule.allowedRoles.length > 0) {
      const hasRole = rule.allowedRoles.some((role) => identity.roles.includes(role));
      if (!hasRole) return false;
    }

    return true;
  }

  // checkAccessAsync — asinhrona double-check verzija
  static async checkAccessAsync(
    identity: ΩIdentity,
    resource: ΩResource
  ): Promise<boolean> {
    // Prvo sinhrono, pa još jednom asinhrono (double-check)
    const firstCheck = this.checkAccess(identity, resource);
    if (!firstCheck) return false;

    // Simulacija asinhrone provere (npr. poziv eksternog IAM sistema)
    await Promise.resolve();
    return this.checkAccess(identity, resource);
  }

  // getClearanceLevelName — dobija ime nivoa klirensa
  static getClearanceLevelName(level: ΩClearanceLevel): string {
    const names: Record<ΩClearanceLevel, string> = {
      [ΩClearanceLevel.VISITOR]: 'VISITOR',
      [ΩClearanceLevel.USER]: 'USER',
      [ΩClearanceLevel.OPERATOR]: 'OPERATOR',
      [ΩClearanceLevel.ADMIN]: 'ADMIN',
      [ΩClearanceLevel.SUPER_ADMIN]: 'SUPER_ADMIN',
      [ΩClearanceLevel.OMEGA_CORE]: 'OMEGA_CORE -∞Ω+∞',
    };
    return names[level] ?? 'UNKNOWN';
  }

  // getRequiredClearance — dohvata potrebni nivo za putanju
  static getRequiredClearance(path: string): ΩClearanceLevel {
    const rule = this.findMatchingRule(path);
    return rule?.requiredClearance ?? ΩClearanceLevel.USER;
  }

  private static findMatchingRule(path: string): ΩPermissionRule | null {
    for (const rule of PERMISSION_MATRIX) {
      if (rule.resourcePattern.test(path)) {
        return rule;
      }
    }
    return null;
  }
}

// DEFAULT_CLEARANCE_ROLES — podrazumevane role za svaki nivo
export const DEFAULT_CLEARANCE_ROLES: Record<ΩClearanceLevel, string[]> = {
  [ΩClearanceLevel.VISITOR]: ['visitor'],
  [ΩClearanceLevel.USER]: ['user'],
  [ΩClearanceLevel.OPERATOR]: ['user', 'operator'],
  [ΩClearanceLevel.ADMIN]: ['user', 'operator', 'admin'],
  [ΩClearanceLevel.SUPER_ADMIN]: ['user', 'operator', 'admin', 'super_admin'],
  [ΩClearanceLevel.OMEGA_CORE]: ['user', 'operator', 'admin', 'super_admin', 'omega_core'],
};
