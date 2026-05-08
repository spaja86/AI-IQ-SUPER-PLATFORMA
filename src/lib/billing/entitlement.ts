// SpajaUltraOmegaCore -∞Ω+∞ — Central Entitlement Model
// Kompanija SPAJA — Digitalna Industrija
// Centralni entitlement model — šta koji plan aktivira po endžinima/platformama

import type { PlanTip } from '@/lib/supabase/types';

export type EngineId =
  | 'spaja-pro'
  | 'omega-ai'
  | 'digitalni-kompjuter'
  | 'banka'
  | 'menjacnica'
  | 'gaming-platforma'
  | 'digitalni-televizor'
  | 'monitoring-live'
  | 'render-medija'
  | 'proksi-mreza'
  | 'blockchain'
  | 'ai-platforma';

export interface EngineEntitlement {
  engineId: EngineId;
  naziv: string;
  dostupno: boolean;
  features: string[];
  limit?: number; // -1 = unlimited
}

export interface PlanEntitlement {
  plan: PlanTip;
  naziv: string;
  chatLimit: number; // -1 = unlimited
  apiPristup: boolean;
  prioritetnaPodrska: boolean;
  teamMembers: number; // -1 = unlimited
  slaGarancija: boolean;
  whiteLabelOpcija: boolean;
  auditLog: boolean;
  endzini: EngineEntitlement[];
}

const BASE_ENGINES: EngineEntitlement[] = [
  { engineId: 'spaja-pro', naziv: 'SpajaPro AI', dostupno: true, features: ['basic-chat'] },
  { engineId: 'omega-ai', naziv: 'OMEGA AI', dostupno: true, features: ['21-persona'] },
  { engineId: 'digitalni-kompjuter', naziv: 'Digitalni Kompjuter', dostupno: true, features: ['basic-access'] },
  { engineId: 'gaming-platforma', naziv: 'Gaming Platforma', dostupno: true, features: ['96-igrica'] },
  { engineId: 'digitalni-televizor', naziv: 'Digitalni TV', dostupno: false, features: [] },
  { engineId: 'monitoring-live', naziv: 'Monitoring Live', dostupno: false, features: [] },
  { engineId: 'banka', naziv: 'SPAJA Banka', dostupno: false, features: [] },
  { engineId: 'menjacnica', naziv: 'Menjačnica', dostupno: false, features: [] },
  { engineId: 'render-medija', naziv: 'Render Medija', dostupno: false, features: [] },
  { engineId: 'proksi-mreza', naziv: 'Proksi Mreža', dostupno: false, features: [] },
  { engineId: 'blockchain', naziv: 'Blockchain', dostupno: false, features: [] },
  { engineId: 'ai-platforma', naziv: 'AI Platforma', dostupno: false, features: [] },
];

export const ENTITLEMENT_MAP: Record<PlanTip, PlanEntitlement> = {
  starter: {
    plan: 'starter',
    naziv: 'Starter',
    chatLimit: 10,
    apiPristup: false,
    prioritetnaPodrska: false,
    teamMembers: 1,
    slaGarancija: false,
    whiteLabelOpcija: false,
    auditLog: false,
    endzini: BASE_ENGINES.map((e) =>
      e.engineId === 'spaja-pro' || e.engineId === 'omega-ai' || e.engineId === 'digitalni-kompjuter' || e.engineId === 'gaming-platforma'
        ? { ...e, dostupno: true }
        : e,
    ),
  },
  basic: {
    plan: 'basic',
    naziv: 'Basic',
    chatLimit: 100,
    apiPristup: true,
    prioritetnaPodrska: false,
    teamMembers: 5,
    slaGarancija: false,
    whiteLabelOpcija: false,
    auditLog: false,
    endzini: BASE_ENGINES.map((e) =>
      ['spaja-pro', 'omega-ai', 'digitalni-kompjuter', 'gaming-platforma', 'digitalni-televizor', 'monitoring-live'].includes(e.engineId)
        ? { ...e, dostupno: true, features: [...e.features, 'api-access'] }
        : e,
    ),
  },
  pro: {
    plan: 'pro',
    naziv: 'Pro',
    chatLimit: 1000,
    apiPristup: true,
    prioritetnaPodrska: true,
    teamMembers: 25,
    slaGarancija: false,
    whiteLabelOpcija: false,
    auditLog: false,
    endzini: BASE_ENGINES.map((e) =>
      ['spaja-pro', 'omega-ai', 'digitalni-kompjuter', 'gaming-platforma', 'digitalni-televizor', 'monitoring-live', 'banka', 'menjacnica', 'render-medija'].includes(e.engineId)
        ? { ...e, dostupno: true, features: [...e.features, 'api-access', 'priority'] }
        : e,
    ),
  },
  enterprise: {
    plan: 'enterprise',
    naziv: 'Enterprise',
    chatLimit: 10000,
    apiPristup: true,
    prioritetnaPodrska: true,
    teamMembers: 100,
    slaGarancija: true,
    whiteLabelOpcija: false,
    auditLog: true,
    endzini: BASE_ENGINES.map((e) => ({ ...e, dostupno: true, features: [...e.features, 'api-access', 'priority', 'sla'] })),
  },
  unlimited: {
    plan: 'unlimited',
    naziv: 'Unlimited',
    chatLimit: -1,
    apiPristup: true,
    prioritetnaPodrska: true,
    teamMembers: -1,
    slaGarancija: true,
    whiteLabelOpcija: true,
    auditLog: true,
    endzini: BASE_ENGINES.map((e) => ({ ...e, dostupno: true, features: [...e.features, 'api-access', 'priority', 'sla', 'white-label', 'unlimited'] })),
  },
};

export function getEntitlement(plan: PlanTip): PlanEntitlement {
  return ENTITLEMENT_MAP[plan] ?? ENTITLEMENT_MAP.starter;
}

export function hasEngineAccess(plan: PlanTip, engineId: EngineId): boolean {
  const ent = getEntitlement(plan);
  return ent.endzini.find((e) => e.engineId === engineId)?.dostupno ?? false;
}

export function getEngineFeatures(plan: PlanTip, engineId: EngineId): string[] {
  const ent = getEntitlement(plan);
  return ent.endzini.find((e) => e.engineId === engineId)?.features ?? [];
}

export function getEntitlementSummary(plan: PlanTip) {
  const ent = getEntitlement(plan);
  return {
    plan: ent.plan,
    naziv: ent.naziv,
    chatLimit: ent.chatLimit,
    apiPristup: ent.apiPristup,
    prioritetnaPodrska: ent.prioritetnaPodrska,
    teamMembers: ent.teamMembers,
    slaGarancija: ent.slaGarancija,
    whiteLabelOpcija: ent.whiteLabelOpcija,
    auditLog: ent.auditLog,
    dostupnihEndzina: ent.endzini.filter((e) => e.dostupno).length,
    ukupnoEndzina: ent.endzini.length,
  };
}
