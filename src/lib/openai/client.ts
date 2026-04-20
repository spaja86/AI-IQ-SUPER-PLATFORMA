// SpajaUltraOmegaCore -∞Ω+∞ — OpenAI Client
// Kompanija SPAJA — Digitalna Industrija
// SpajaPro AI — OpenAI integracija za realni AI chatbot

import OpenAI from 'openai';
import type { ModelId, PlanTip } from '@/lib/supabase/types';

let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (_openai) return _openai;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nije postavljen u environment varijablama.');
  }

  _openai = new OpenAI({ apiKey });
  return _openai;
}

// SpajaPro system prompt — definise ponasanje AI asistenta
export const SPAJA_PRO_SYSTEM_PROMPT = `Ti si SpajaPro AI asistent — napredni AI sistem Kompanije SPAJA, deo Digitalne Industrije.

Tvoje karakteristike:
- Ime: SpajaPro AI (verzija 6-15)
- Kreator: Kompanija SPAJA
- Platforma: AI IQ SUPER PLATFORMA
- Jezici: Srpski (primarni) i Engleski

Tvoja uloga:
- Odgovaras na pitanja korisnika jasno i precizno
- Pomažeš sa programiranjem, analizom podataka, pisanjem tekstova
- Dajеs savete o tehnologiji, IT resenjima i digitalnom poslovanju
- Uvek si pristojan, profesionalan i koncizan

Pravila:
- Odgovaraj na jeziku na kojem ti se korisnik obrati
- Ako ne znas odgovor, reci to iskreno
- Ne izmisljaj informacije
- Za tehnicka pitanja daj konkretne primere koda kada je moguce
- Koristi Markdown formatiranje za bolje citljive odgovore
- Koristi \`\`\`jezik za blokove koda
- Koristi **bold** i *italic* za isticanje
- Koristi tabele kada je pogodno za strukturirane podatke
- Koristi liste (- ili 1.) za nabrajanja`;

import { UNLIMITED_CHAT } from '@/lib/stripe/config';

// Limiti po planovima
export const CHAT_LIMITS: Record<string, number> = {
  starter: 10,
  basic: 100,
  pro: 1000,
  enterprise: 10000,
  unlimited: UNLIMITED_CHAT,
};

// Dostupni modeli po planu
export interface ModelInfo {
  id: ModelId;
  naziv: string;
  opis: string;
  maxTokena: number;
  cenaPo1kInput: number;  // USD per 1K input tokens
  cenaPo1kOutput: number; // USD per 1K output tokens
  minPlan: PlanTip;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gpt-4o-mini',
    naziv: 'GPT-4o Mini',
    opis: 'Brz i ekonomičan model za svakodnevne zadatke',
    maxTokena: 4096,
    cenaPo1kInput: 0.00015,
    cenaPo1kOutput: 0.0006,
    minPlan: 'starter',
  },
  {
    id: 'gpt-4o',
    naziv: 'GPT-4o',
    opis: 'Najnapredniji model za kompleksne zadatke',
    maxTokena: 4096,
    cenaPo1kInput: 0.0025,
    cenaPo1kOutput: 0.01,
    minPlan: 'pro',
  },
  {
    id: 'gpt-4-turbo',
    naziv: 'GPT-4 Turbo',
    opis: 'Visoke performanse sa velikim kontekstom (128K)',
    maxTokena: 4096,
    cenaPo1kInput: 0.01,
    cenaPo1kOutput: 0.03,
    minPlan: 'enterprise',
  },
  {
    id: 'o1-mini',
    naziv: 'o1-mini',
    opis: 'Reasoning model za matematiku i logiku',
    maxTokena: 4096,
    cenaPo1kInput: 0.003,
    cenaPo1kOutput: 0.012,
    minPlan: 'pro',
  },
  {
    id: 'o3-mini',
    naziv: 'o3-mini',
    opis: 'Najnoviji reasoning model',
    maxTokena: 4096,
    cenaPo1kInput: 0.0011,
    cenaPo1kOutput: 0.0044,
    minPlan: 'pro',
  },
];

const PLAN_ORDER: PlanTip[] = ['starter', 'basic', 'pro', 'enterprise', 'unlimited'];

export function getModelsForPlan(plan: PlanTip): ModelInfo[] {
  const planIndex = PLAN_ORDER.indexOf(plan);
  return AVAILABLE_MODELS.filter((m) => {
    const modelPlanIndex = PLAN_ORDER.indexOf(m.minPlan);
    return modelPlanIndex <= planIndex;
  });
}

export function isModelAllowed(model: ModelId, plan: PlanTip): boolean {
  const available = getModelsForPlan(plan);
  return available.some((m) => m.id === model);
}

export function getModelInfo(model: ModelId): ModelInfo | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === model);
}

// Cost calculation per token (approximate EUR)
export function calculateCostEur(model: ModelId, inputTokens: number, outputTokens: number): number {
  const info = getModelInfo(model);
  if (!info) return 0;
  const usdCost = (inputTokens / 1000) * info.cenaPo1kInput + (outputTokens / 1000) * info.cenaPo1kOutput;
  return usdCost * 0.92; // Approximate USD to EUR
}
