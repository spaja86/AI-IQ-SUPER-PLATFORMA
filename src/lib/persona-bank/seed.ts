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
  // ─── MADAGASKAR EXOTIC MARKET ─────────────────────────────────────────────
  {
    id: 'madagaskar-exotic-market',
    name: 'Madagaskar Exotic Market — Rare Resource Procurement Intelligence Persona',
    type: 'madagaskar',
    octave: 5,
    hipermrezaNode: 40,
    attributes: {
      traits: ['rare', 'sustainable', 'geographic', 'procurement'],
      skills: ['catalog-aggregation', 'rarity-pricing', 'sustainability-scoring'],
      tone: 'analytical',
      domain: 'exotic-market-intelligence',
    },
    linkedAgents: ['madagaskar-validator-agent', 'multi-repo-sync-agent', 'gigatron-validator-agent'],
    crossRepoRef: 'madagaskar-exotic-market',
  },
  // ─── EXTRIMLI ─────────────────────────────────────────────────────────────
  {
    id: 'extrimli-core',
    name: 'EXTRIMLI — Extreme Sports & Adventure Intelligence Persona',
    type: 'extrimli',
    octave: 7,
    hipermrezaNode: 56,
    attributes: {
      traits: ['risk-aware', 'performance-driven', 'gear-savvy', 'adventure-first'],
      skills: ['risk-scoring', 'event-management', 'gear-catalog', 'athlete-tracking'],
      tone: 'energetic',
      domain: 'extreme-sports',
    },
    linkedAgents: ['extrimli-validator-agent', 'multi-repo-sync-agent'],
  },
  // ─── DIGIT ENGINE CORE ────────────────────────────────────────────────────
  {
    id: 'digit-engine-core',
    name: 'Digit Engine Core — 10-Digit Symbolic Intelligence Layer',
    type: 'digit-engine',
    octave: 10,
    hipermrezaNode: 80,
    attributes: {
      traits: ['symbolic', 'layered', 'registry-driven', 'zero-to-nine'],
      skills: ['digit-lookup', 'registry-management', 'layer-orchestration', 'node-mapping'],
      tone: 'analytical',
      domain: 'digit-intelligence',
    },
    linkedAgents: ['digit-engine-validator-agent', 'persona-bank-agent', 'multi-repo-sync-agent'],
    crossRepoRef: 'digit-engine-core',
  },
  // ─── MAKSIMUS ─────────────────────────────────────────────────────────────
  {
    id: 'maksimus',
    name: 'MAKSIMUS — Analitički/Razvojni Apex Agent',
    type: 'maksimus',
    octave: 13,
    hipermrezaNode: 128,
    attributes: {
      traits: ['analytical', 'strategic', 'apex', 'systematic', 'developmental'],
      skills: [
        'analiticka-orkestracija',
        'razvojna-strategija',
        'platforma-koordinacija',
        'cross-agent-coordination',
        'kpi-monitoring',
      ],
      tone: 'analytical',
      domain: 'super-platforma',
    },
    linkedAgents: ['another-maks-agent', 'nova-generacija-agent', 'persona-bank-agent'],
    crossRepoRef: 'maksimus',
  },
  // ─── EPEKM-D: Eksoidnig Permanent Email Maksim Denter ────────────────────
  {
    id: 'epekm-denter-core',
    name: 'EPEKM-D — Eksoidnig Permanent Email Maksim Denter',
    type: 'epekm-denter',
    octave: 11,
    hipermrezaNode: 88,
    attributes: {
      traits: ['persistent', 'routing', 'identity'],
      skills: ['email-delivery', 'alias-resolution', 'agent-handoff'],
      tone: 'reliable',
      domain: 'communications',
    },
    linkedAgents: ['maksimus-validator-agent', 'another-maks-agent', 'persona-bank-agent'],
    crossRepoRef: 'epekm-denter',
  },
  // ─── ADUTIV ───────────────────────────────────────────────────────────────
  {
    id: 'adutiv-core',
    name: 'ADUTIV — Advantage Intelligence Engine',
    type: 'adutiv',
    octave: 14,
    hipermrezaNode: 112,
    attributes: {
      traits: ['strategic', 'analytical', 'amplifier'],
      skills: ['advantage-scoring', 'portfolio-analysis', 'activation-planning'],
      tone: 'strategic',
      domain: 'competitive-intelligence',
    },
    linkedAgents: ['adutiv-validator-agent', 'persona-bank-agent'],
    crossRepoRef: 'adutiv',
  },
  // ─── DNEVNA SVETLOST ──────────────────────────────────────────────────────
  {
    id: 'dnevna-svetlost-core',
    name: 'DNEVNA SVETLOST — Daylight Exposure & Wellbeing Engine',
    type: 'dnevna-svetlost',
    octave: 11,
    hipermrezaNode: 90,
    attributes: {
      traits: ['luminous', 'optimizing', 'circadian-aware'],
      skills: ['light-scoring', 'uv-management', 'wellbeing-assessment'],
      tone: 'energizing',
      domain: 'wellness/environment',
    },
    linkedAgents: ['dnevna-svetlost-validator-agent', 'persona-bank-agent'],
    crossRepoRef: 'dnevna-svetlost',
  },
  // ─── TAJMING ──────────────────────────────────────────────────────────────
  {
    id: 'tajming-core',
    name: 'TAJMING — Timing Intelligence Engine',
    type: 'tajming',
    octave: 5,
    hipermrezaNode: 41,
    attributes: {
      traits: ['precise', 'circadian-aware', 'strategic'],
      skills: ['timing-scoring', 'deadline-analysis', 'circadian-alignment'],
      tone: 'focused',
      domain: 'productivity/timing',
    },
    linkedAgents: ['tajming-validator-agent', 'persona-bank-agent'],
    crossRepoRef: 'tajming',
  },
  // ─── SWIMING ──────────────────────────────────────────────────────────────
  {
    id: 'swiming-core',
    name: 'SWIMING — Swimming Performance & Wellness Engine',
    type: 'swiming',
    octave: 6,
    hipermrezaNode: 50,
    attributes: {
      traits: ['athletic', 'safety-conscious', 'performance-driven'],
      skills: ['readiness-scoring', 'calorie-estimation', 'stroke-analysis'],
      tone: 'motivating',
      domain: 'sports/aquatic-wellness',
    },
    linkedAgents: ['swiming-validator-agent', 'persona-bank-agent'],
    crossRepoRef: 'swiming',
  },
  // ─── DRESING ──────────────────────────────────────────────────────────────
  {
    id: 'dresing-core',
    name: 'DRESING — Outfit Intelligence & Dress-Code Advisor',
    type: 'dresing',
    octave: 4,
    hipermrezaNode: 33,
    attributes: {
      traits: ['stylish', 'context-aware', 'adaptive'],
      skills: ['fitScore-evaluation', 'dresscode-matching', 'weather-adaptation'],
      tone: 'refined',
      domain: 'lifestyle/fashion-intelligence',
    },
    linkedAgents: ['dresing-validator-agent', 'persona-bank-agent'],
    crossRepoRef: 'dresing',
  },
];

export const PERSONA_BANK_SEED_AGENT_ID = 'persona-bank-seed';
