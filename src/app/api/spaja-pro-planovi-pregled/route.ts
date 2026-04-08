import { NextResponse } from 'next/server';
import {
  spajaProPlanovi,
  valute,
  finansijskiModel,
  vlasnickaPlata,
  omegaAiPlata,
  operativniTroskovi,
} from '@/lib/spaja-pro-planovi';
import { SPAJA_PRO_VERZIJA_COUNT, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

/**
 * SpajaPro Planovi — Detaljan Pregled
 *
 * Kompletan pregled sistema za planove, naplatu i finansijski model.
 * Uključuje sve planove, valute, finansijski tok i integracije.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'SpajaPro Planovi — Detaljan Pregled',
    opis: `Kompletan pregled ${spajaProPlanovi.length} planova za ${SPAJA_PRO_VERZIJA_COUNT} SpajaPro endžina sa podrškom za ${valute.length} valuta`,
    planovi: spajaProPlanovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      tip: p.tip,
      ikona: p.ikona,
      opis: p.opis,
      cena: `$${p.cenaUSD.mesecno}/mes | $${p.cenaUSD.godisnje}/god`,
      endzini: p.endziniUkljuceni.map((v) => `SpajaPro v${v}`),
      mogucnosti: p.mogucnosti,
      status: p.status,
    })),
    finansijskiTok: {
      korak1: '💳 Korisnik bira plan i plaća (mesečno ili godišnje)',
      korak2: '🏦 AI IQ World Bank obrađuje transakciju globalno',
      korak3: '💱 AI IQ Menjačnica konvertuje u lokalnu valutu',
      korak4: `👤 Vlasnik (Kompanija SPAJA) prima platu: $${vlasnickaPlata.mesecnaOsnovica.toLocaleString()}/mes + ${vlasnickaPlata.procenatOdPrihoda}% prihoda`,
      korak5: `🤖 OMEGA AI prima platu: $${omegaAiPlata.ukupnoMesecno.toLocaleString()}/mes (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} persona)`,
      korak6: `🏭 Digitalna Industrija operativni troškovi: $${operativniTroskovi.ukupnoMesecno.toLocaleString()}/mes`,
      korak7: `📊 Neto mesečni bilans: $${finansijskiModel.bilans.neto.toLocaleString()}/mes (${finansijskiModel.bilans.status})`,
    },
    podrskaSvetske: {
      srbija: '🇷🇸 RSD — Srpski dinar',
      amerika: '🇺🇸 USD — Američki dolar',
      evropa: '🇪🇺 EUR — Evro',
      britanija: '🇬🇧 GBP — Britanska funta',
      svajcarska: '🇨🇭 CHF — Švajcarski franak',
      japan: '🇯🇵 JPY — Japanski jen',
      kina: '🇨🇳 CNY — Kineski juan',
      rusija: '🇷🇺 RUB — Ruski rublj',
      indija: '🇮🇳 INR — Indijska rupija',
      brazil: '🇧🇷 BRL — Brazilski real',
      bitcoin: '🪙 BTC — Bitcoin',
      ethereum: '💎 ETH — Ethereum',
    },
    moto: 'Srećan rad! 🎉',
    timestamp: new Date().toISOString(),
  });
}
