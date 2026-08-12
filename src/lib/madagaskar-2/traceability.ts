// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: Traceability Registry
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory supply-chain traceability records with seed data and CRUD helpers.

import type { TraceabilityRecord, TraceStep } from './types';

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_TRACES: TraceabilityRecord[] = [
  {
    goodId: 'mdg-vanilla-001',
    harvestDate: '2026-03-15',
    harvestLocation: 'SAVA Region, Madagascar',
    certifications: ['Organic EU', 'Rainforest Alliance', 'Fair Trade'],
    chainOfCustody: [
      { date: '2026-03-15', actor: 'Farmer Cooperative SAVA', action: 'Harvest', location: 'SAVA Region, Madagascar' },
      { date: '2026-03-20', actor: 'Toamasina Processing Plant', action: 'Curing & Grading', location: 'Toamasina, Madagascar' },
      { date: '2026-04-01', actor: 'Port of Toamasina', action: 'Export', location: 'Toamasina, Madagascar' },
      { date: '2026-04-18', actor: 'SPAJA Exotic Warehouse', action: 'Import & QA', location: 'Rotterdam, Netherlands' },
    ],
  },
  {
    goodId: 'mdg-baobab-oil-001',
    harvestDate: '2026-01-10',
    harvestLocation: 'Menabe Region, Madagascar',
    certifications: ['Organic EU', 'COSMOS Natural', 'Non-GMO'],
    chainOfCustody: [
      { date: '2026-01-10', actor: 'Village Co-op Menabe', action: 'Cold-Press Harvest', location: 'Menabe, Madagascar' },
      { date: '2026-01-14', actor: 'Antananarivo Lab', action: 'Quality Testing', location: 'Antananarivo, Madagascar' },
      { date: '2026-01-20', actor: 'SPAJA Logistics', action: 'Airfreight Export', location: 'Ivato Airport, Madagascar' },
      { date: '2026-02-01', actor: 'SPAJA Exotic Warehouse', action: 'Receive & Cold Storage', location: 'Frankfurt, Germany' },
    ],
  },
  {
    goodId: 'idn-batik-001',
    harvestDate: '2026-02-01',
    harvestLocation: 'Solo, Central Java, Indonesia',
    certifications: ['UNESCO Intangible Heritage', 'Batik Indonesia Mark'],
    chainOfCustody: [
      { date: '2026-02-01', actor: 'Solo Batik Workshop', action: 'Hand-Drawing', location: 'Solo, Central Java, Indonesia' },
      { date: '2026-02-20', actor: 'Solo Export Association', action: 'Packaging & Certification', location: 'Solo, Indonesia' },
      { date: '2026-03-05', actor: 'Soekarno-Hatta Airport', action: 'Export', location: 'Jakarta, Indonesia' },
      { date: '2026-03-12', actor: 'SPAJA Exotic Warehouse', action: 'Import & QA', location: 'Amsterdam, Netherlands' },
    ],
  },
  {
    goodId: 'sib-mammoth-ivory-001',
    harvestDate: '2025-08-15',
    harvestLocation: 'Yakutia, Siberia, Russia',
    certifications: ['CITES Appendix II Compliance', 'Fossil Authenticity Certificate', 'Export License RUS-2025'],
    chainOfCustody: [
      { date: '2025-08-15', actor: 'Yakutia Fossil Expeditions', action: 'Excavation', location: 'Verkhoyansk District, Yakutia' },
      { date: '2025-09-01', actor: 'Yakutsk Museum Lab', action: 'Carbon Dating & Authentication', location: 'Yakutsk, Russia' },
      { date: '2025-11-10', actor: 'Russian Customs Service', action: 'CITES Permit & Export', location: 'Moscow, Russia' },
      { date: '2025-12-05', actor: 'SPAJA Rare Artifacts', action: 'Secure Import & Appraisal', location: 'Zurich, Switzerland' },
    ],
  },
  {
    goodId: 'amz-cacao-001',
    harvestDate: '2026-05-20',
    harvestLocation: 'Pará State, Brazil',
    certifications: ['Organic Brazil', 'Rainforest Alliance', 'Direct Trade'],
    chainOfCustody: [
      { date: '2026-05-20', actor: 'Wild Harvest Collective Pará', action: 'Wild Harvest', location: 'Tapajós National Forest, Pará, Brazil' },
      { date: '2026-05-28', actor: 'Santarém Processing Co-op', action: 'Paste Extraction', location: 'Santarém, Pará, Brazil' },
      { date: '2026-06-10', actor: 'Port of Belém', action: 'Export', location: 'Belém, Brazil' },
      { date: '2026-06-28', actor: 'SPAJA Exotic Warehouse', action: 'Import & QA', location: 'Antwerp, Belgium' },
    ],
  },
];

// ─── Registry ─────────────────────────────────────────────────────────────────

let _traces: Map<string, TraceabilityRecord> = new Map(SEED_TRACES.map((t) => [t.goodId, t]));

/** @internal — reset to seed state (for tests). */
export function _resetTraces(): void {
  _traces = new Map(SEED_TRACES.map((t) => [t.goodId, { ...t, chainOfCustody: [...t.chainOfCustody] }]));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getTrace(goodId: string): TraceabilityRecord | undefined {
  return _traces.get(goodId);
}

export function listTraces(): TraceabilityRecord[] {
  return Array.from(_traces.values());
}

export function upsertTrace(record: TraceabilityRecord): void {
  _traces.set(record.goodId, record);
}

/**
 * Validates a traceability record.
 * Returns a list of error messages; empty array = valid.
 */
export function validateTrace(record: TraceabilityRecord): string[] {
  const errors: string[] = [];

  if (!record.goodId || record.goodId.trim() === '') {
    errors.push('goodId must be a non-empty string.');
  }

  if (!record.harvestDate || isNaN(new Date(record.harvestDate).getTime())) {
    errors.push('harvestDate must be a valid date string.');
  }

  if (!record.harvestLocation || record.harvestLocation.trim() === '') {
    errors.push('harvestLocation must be a non-empty string.');
  }

  if (!Array.isArray(record.certifications) || record.certifications.length === 0) {
    errors.push('certifications must be a non-empty array.');
  }

  if (!Array.isArray(record.chainOfCustody) || record.chainOfCustody.length === 0) {
    errors.push('chainOfCustody must be a non-empty array.');
  } else {
    record.chainOfCustody.forEach((step: TraceStep, i: number) => {
      if (!step.date || isNaN(new Date(step.date).getTime())) {
        errors.push(`chainOfCustody[${i}].date must be a valid date string.`);
      }
      if (!step.actor || step.actor.trim() === '') {
        errors.push(`chainOfCustody[${i}].actor must be a non-empty string.`);
      }
      if (!step.action || step.action.trim() === '') {
        errors.push(`chainOfCustody[${i}].action must be a non-empty string.`);
      }
      if (!step.location || step.location.trim() === '') {
        errors.push(`chainOfCustody[${i}].location must be a non-empty string.`);
      }
    });
  }

  return errors;
}

export function getTraceabilityCount(): number {
  return _traces.size;
}
