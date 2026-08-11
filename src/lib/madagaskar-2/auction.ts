// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: Auction Engine
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory auction lot registry and bidding mechanics.

import type { AuctionLot, BidRequest, BidResult, AuctionStatus } from './types';

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_LOTS: AuctionLot[] = [
  {
    id: 'lot-mdg-sapphire-001',
    goodId: 'mdg-sapphire-001',
    reservePriceCents: 85000,
    currentBidCents: 0,
    bidCount: 0,
    currency: 'EUR',
    closesAt: '2026-09-01T18:00:00Z',
    status: 'open',
  },
  {
    id: 'lot-mdg-lemur-resin-001',
    goodId: 'mdg-lemur-resin-001',
    reservePriceCents: 120000,
    currentBidCents: 125000,
    bidCount: 2,
    currency: 'EUR',
    closesAt: '2026-09-15T18:00:00Z',
    status: 'open',
  },
  {
    id: 'lot-sib-mammoth-ivory-001',
    goodId: 'sib-mammoth-ivory-001',
    reservePriceCents: 500000,
    currentBidCents: 510000,
    bidCount: 1,
    currency: 'EUR',
    closesAt: '2026-09-30T18:00:00Z',
    status: 'open',
  },
  {
    id: 'lot-pat-lithium-brine-001',
    goodId: 'pat-lithium-brine-001',
    reservePriceCents: 90000,
    currentBidCents: 95000,
    bidCount: 3,
    currency: 'USD',
    closesAt: '2026-08-31T18:00:00Z',
    status: 'open',
  },
  {
    id: 'lot-ocn-black-pearl-001',
    goodId: 'ocn-black-pearl-001',
    reservePriceCents: 75000,
    currentBidCents: 78000,
    bidCount: 4,
    currency: 'USD',
    closesAt: '2026-08-20T18:00:00Z',
    status: 'closed',
  },
];

// ─── Registry ─────────────────────────────────────────────────────────────────

let _lots: Map<string, AuctionLot> = new Map(SEED_LOTS.map((l) => [l.id, l]));

/** @internal — reset to seed state (for tests). */
export function _resetLots(): void {
  _lots = new Map(SEED_LOTS.map((l) => [l.id, { ...l }]));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getLot(lotId: string): AuctionLot | undefined {
  return _lots.get(lotId);
}

export function listLots(status?: AuctionStatus): AuctionLot[] {
  const all = Array.from(_lots.values());
  if (status) return all.filter((l) => l.status === status);
  return all;
}

export function closeLot(lotId: string): void {
  const lot = _lots.get(lotId);
  if (lot) {
    _lots.set(lotId, { ...lot, status: 'closed' });
  }
}

/**
 * Places a bid on an auction lot.
 *
 * Rules:
 * - Lot must exist and be 'open'.
 * - Currency must match the lot's currency.
 * - Bid must be greater than currentBidCents.
 * - If currentBidCents === 0, bid must be >= reservePriceCents.
 */
export function placeBid(req: BidRequest): BidResult {
  const warnings: string[] = [];

  // Lot existence
  const lot = _lots.get(req.lotId);
  if (!lot) {
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: 0, outbid: false, warnings: [`Unknown lot id: ${req.lotId}`] };
  }

  // Status check
  if (lot.status !== 'open') {
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: lot.currentBidCents, outbid: false, warnings: [`Lot ${req.lotId} is not open (status: ${lot.status}).`] };
  }

  // Currency check
  if (req.currency !== lot.currency) {
    warnings.push(`Bid currency '${req.currency}' does not match lot currency '${lot.currency}'. Bid rejected.`);
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: lot.currentBidCents, outbid: false, warnings };
  }

  // Valid bid amount
  if (!Number.isFinite(req.bidAmountCents) || req.bidAmountCents <= 0) {
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: lot.currentBidCents, outbid: false, warnings: ['bidAmountCents must be a positive finite number.'] };
  }

  // Reserve check (first bid)
  if (lot.currentBidCents === 0 && req.bidAmountCents < lot.reservePriceCents) {
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: lot.currentBidCents, outbid: false, warnings: [`Bid ${req.bidAmountCents} is below reserve price ${lot.reservePriceCents}.`] };
  }

  // Must beat current bid
  if (req.bidAmountCents <= lot.currentBidCents) {
    return { lotId: req.lotId, accepted: false, newCurrentBidCents: lot.currentBidCents, outbid: true, warnings: [`Bid ${req.bidAmountCents} must exceed current bid of ${lot.currentBidCents}.`] };
  }

  // Accept
  const updated: AuctionLot = {
    ...lot,
    currentBidCents: req.bidAmountCents,
    bidCount: lot.bidCount + 1,
  };
  _lots.set(req.lotId, updated);

  return {
    lotId: req.lotId,
    accepted: true,
    newCurrentBidCents: req.bidAmountCents,
    outbid: false,
    warnings,
  };
}

/** Returns auction stats summary. */
export function getAuctionStats() {
  const all = Array.from(_lots.values());
  return {
    total: all.length,
    open: all.filter((l) => l.status === 'open').length,
    closed: all.filter((l) => l.status === 'closed').length,
    cancelled: all.filter((l) => l.status === 'cancelled').length,
  };
}
