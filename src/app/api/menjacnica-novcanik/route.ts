// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Profesionalni Novčanik — Info Root
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik
// Javno dostupan info endpoint — capabilities i status skeleton-a.

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { EXCHANGE_FLAGS } from '@/lib/menjacnica/feature-flags';

export async function GET() {
  const proFlags = EXCHANGE_FLAGS.filter((f) => f.id.startsWith('pro-novcanik'));

  return NextResponse.json({
    sistem: 'AI IQ MENJAČNICA — Profesionalni Novčanik',
    appVerzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Profesionalni kripto novčanik koji se nadovezuje na AI IQ Menjačnicu — portfolio ekspozicija, P&L, orderbook, trade feed i settlement status.',
    nadovezujeSe: 'AI IQ Menjačnica (/api/menjacnica)',
    capabilities: [
      'Portfolio ekspozicija sa USD vrednošću svih pozicija',
      'Realizovani i nerealizovani P&L po asetu',
      'Live orderbook snapshot (simulacioni mode)',
      'Recent trade feed po paru',
      'Settlement status agregat za sve aktivne parove',
      'Double-entry ledger integracija (novcanik module)',
    ],
    endpoints: [
      { metod: 'GET', putanja: '/api/menjacnica-novcanik/portfolio',         opis: 'Portfolio + P&L', auth: true },
      { metod: 'GET', putanja: '/api/menjacnica-novcanik/orderbook',          opis: 'Orderbook snapshot', auth: true },
      { metod: 'GET', putanja: '/api/menjacnica-novcanik/trades',             opis: 'Recent trades feed', auth: true },
      { metod: 'GET', putanja: '/api/menjacnica-novcanik/settlement-status',  opis: 'Settlement status', auth: true },
    ],
    featureFlags: proFlags.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      enabled: f.enabled,
      rolloutPct: f.rolloutPct,
    })),
    roditeljiSkeleti: [
      { naziv: 'AI IQ Menjačnica',   url: '/menjacnica',       api: '/api/menjacnica' },
      { naziv: 'Poslovni Novčanik',  url: '/poslovni-novcanik', api: '/api/novcanik' },
    ],
    timestamp: new Date().toISOString(),
  });
}
