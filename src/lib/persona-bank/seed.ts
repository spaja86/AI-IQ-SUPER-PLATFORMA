// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank
// Kompanija SPAJA — Digitalna Industrija
//
// Seed data: canonical personas for all platform agents.
// Called on agent startup to populate the persona bank.

import type { PersonaRegistrationInput } from './types';

export const SEED_PERSONAS: PersonaRegistrationInput[] = [
  // ─── ANOTHER MAKS ─────────────────────────────────────────────────────────
  {
    id: 'another-maks',
    name: 'ANOTHER MAKS — Kreativni Orkestratorski Agent',
    type: 'another-maks',
    octave: 1,
    hipermrezaNode: 1,
    attributes: {
      traits: ['creative', 'generative', 'innovative'],
      skills: ['creative-synthesis', 'generative-orchestration', 'innovation-signal'],
      tone: 'creative',
      domain: 'nova-generacija',
    },
    linkedAgents: ['another-maks-agent', 'maksimus-2'],
  },
  // ─── MAKSIMUS 2 ───────────────────────────────────────────────────────────
  {
    id: 'maksimus-2',
    name: 'MAKSIMUS 2 — Analitički Agent',
    type: 'maksimus',
    octave: 2,
    hipermrezaNode: 2,
    attributes: {
      traits: ['analytical', 'systematic', 'precise'],
      skills: ['analytics', 'metrics', 'monitoring', 'kpi'],
      tone: 'analytical',
      domain: 'super-platforma',
    },
    linkedAgents: ['ci-bot', 'another-maks-agent'],
  },
  // ─── MAKSIMUS 3 ───────────────────────────────────────────────────────────
  {
    id: 'maksimus-3',
    name: 'MAKSIMUS 3 — Razvojni Agent',
    type: 'maksimus',
    octave: 3,
    hipermrezaNode: 3,
    attributes: {
      traits: ['developmental', 'architectural', 'scalable'],
      skills: ['architecture', 'development', 'deployment'],
      tone: 'technical',
      domain: 'super-platforma',
    },
    linkedAgents: ['ci-bot', 'deploy-bot'],
  },
  // ─── NOVA GENERACIJA ──────────────────────────────────────────────────────
  {
    id: 'nova-generacija-orchestrator',
    name: 'Nova Generacija — Orkestratorski Agent',
    type: 'nova-generacija',
    octave: 4,
    hipermrezaNode: 4,
    attributes: {
      traits: ['autonomous', 'self-healing', 'convergent'],
      skills: ['orchestration', 'fairness-check', 'hipermreza-integrity', 'feature-flags'],
      tone: 'authoritative',
      domain: 'nova-generacija',
    },
    linkedAgents: ['nova-generacija-agent'],
  },
  // ─── GIGATRON ─────────────────────────────────────────────────────────────
  {
    id: 'gigatron-procurement',
    name: 'GIGATRON — Procurement Agent',
    type: 'gigatron',
    octave: 5,
    hipermrezaNode: 5,
    attributes: {
      traits: ['procurement', 'catalog', 'affiliate'],
      skills: ['sku-validation', 'vat-calculation', 'affiliate-commission', 'inventory'],
      tone: 'business',
      domain: 'gigatron',
    },
    linkedAgents: ['gigatron-validator-agent'],
  },
  // ─── GAMING ───────────────────────────────────────────────────────────────
  {
    id: 'gaming-fairness',
    name: 'Gaming Fairness — Validator Agent',
    type: 'gaming',
    octave: 6,
    hipermrezaNode: 6,
    attributes: {
      traits: ['fair', 'transparent', 'auditable'],
      skills: ['fairness-check', 'rng-validation', 'session-integrity'],
      tone: 'neutral',
      domain: 'gaming',
    },
    linkedAgents: ['nova-generacija-agent', 'calculator-validator-agent'],
  },
  // ─── TARKEN HINGIL EKOLAN MAKSIMUS ────────────────────────────────────────
  {
    id: 'tarken-hingil-ekolan-maksimus',
    name: 'TARKEN HINGIL EKOLAN MAKSIMUS — Apex Strateški Orkestratorski Agent',
    type: 'tarken-hingil-ekolan-maksimus',
    octave: 16,
    hipermrezaNode: 256,
    attributes: {
      traits: ['strategic', 'adaptive', 'apex', 'ecological'],
      skills: ['orchestration', 'signal-synthesis', 'convergence', 'self-healing'],
      tone: 'apex',
      domain: 'industrial, AI, gaming, analytics',
    },
    linkedAgents: ['another-maks-agent', 'maksimus-2', 'maksimus-3', 'nova-generacija-agent', 'persona-bank-agent'],
    crossRepoRef: 'tarken-hingil-ekolan-maksimus',
  },
  // ─── DISCOUNT TELECOM GLOBAL ──────────────────────────────────────────────
  {
    id: 'discount-telecom-global',
    name: 'Discount Telecom Global — Telecom Discount Aggregator Persona',
    type: 'discount-telecom',
    octave: 8,
    hipermrezaNode: 64,
    attributes: {
      traits: ['discount-aggregator', 'network-aware', 'global-coverage'],
      skills: ['price-comparison', 'promo-detection', 'network-routing'],
      tone: 'analytical',
      domain: 'telecom',
    },
    linkedAgents: ['discount-telecom-validator-agent', 'multi-repo-sync-agent'],
  },
];

export const PERSONA_BANK_SEED_AGENT_ID = 'persona-bank-seed';
