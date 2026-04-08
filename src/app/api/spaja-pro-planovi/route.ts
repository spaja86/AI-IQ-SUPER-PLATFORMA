import { NextResponse } from 'next/server';
import {
  spajaProPlanovi,
  valute,
  finansijskiModel,
  getAktivniPlanovi,
} from '@/lib/spaja-pro-planovi';
import { SPAJA_PRO_VERZIJA_COUNT } from '@/lib/constants';

/**
 * SpajaPro v6-v15 Planovi i Naplata — API
 *
 * Pregled svih planova za SpajaPro endžine.
 * Cene su iste globalno — AI IQ World Bank + AI IQ Menjačnica za konverziju.
 */
export async function GET() {
  const aktivni = getAktivniPlanovi();

  return NextResponse.json({
    sistem: 'SpajaPro Planovi i Naplata — Kompanija SPAJA',
    verzija: '1.0.0',
    opis: `Planovi za korišćenje SpajaPro v6-v15 endžina. ${SPAJA_PRO_VERZIJA_COUNT} endžina, ${spajaProPlanovi.length} planova, ${valute.length} valuta. Srećan rad!`,
    planovi: spajaProPlanovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      tip: p.tip,
      ikona: p.ikona,
      opis: p.opis,
      endziniBroj: p.endziniUkljuceni.length,
      endzini: p.endziniUkljuceni.map((v) => `v${v}`),
      multifunkcionalniRad: p.multifunkcionalniRad,
      spajaBazaPristup: p.spajaBazaPristup,
      beskonacneSesije: p.beskonacneSesije,
      maxSesijaParalelno: p.maxSesijaParalelno,
      maxUpitaDnevno: p.maxUpitaDnevno,
      prioritetPodrske: p.prioritetPodrske,
      cena: {
        mesecnoUSD: `$${p.cenaUSD.mesecno}/mes`,
        godisnjeUSD: `$${p.cenaUSD.godisnje}/god`,
      },
      mogucnosti: p.mogucnosti,
      status: p.status,
    })),
    statistika: {
      ukupnoPlanova: spajaProPlanovi.length,
      aktivnihPlanova: aktivni.length,
      ukupnoValuta: valute.length,
      ukupnoEndžina: SPAJA_PRO_VERZIJA_COUNT,
      finansijskiStatus: finansijskiModel.bilans.status,
    },
    finansijskiIntegracije: {
      banka: 'AI IQ World Bank — globalna obrada transakcija',
      menjacnica: 'AI IQ Menjačnica — konverzija svih valuta',
    },
    timestamp: new Date().toISOString(),
  });
}
