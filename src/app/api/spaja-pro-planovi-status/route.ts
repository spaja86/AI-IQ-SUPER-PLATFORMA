import { NextResponse } from 'next/server';
import {
  spajaProPlanovi,
  valute,
  finansijskiModel,
  getAktivniPlanovi,
} from '@/lib/spaja-pro-planovi';
import { SPAJA_PRO_VERZIJA_COUNT } from '@/lib/constants';

/**
 * SpajaPro Planovi — Status API
 *
 * Zdravlje i operativni status sistema za planove i naplatu.
 */
export async function GET() {
  const aktivni = getAktivniPlanovi();
  const zdravlje = Math.round((aktivni.length / spajaProPlanovi.length) * 100);

  return NextResponse.json({
    sistem: 'SpajaPro Planovi — Status',
    zdravlje: `${zdravlje}%`,
    status: 'aktivan',
    planoviStatus: {
      ukupno: spajaProPlanovi.length,
      aktivni: aktivni.length,
      sviAktivni: aktivni.length === spajaProPlanovi.length,
    },
    valuteStatus: {
      ukupno: valute.length,
      fiat: valute.filter((v) => v.tipValute === 'fiat').length,
      kripto: valute.filter((v) => v.tipValute === 'kripto').length,
    },
    finansijskiStatus: {
      bilansStatus: finansijskiModel.bilans.status,
      mesecniPrihod: `$${finansijskiModel.prihodi.ukupnoMesecniPrihod.toLocaleString()}`,
      mesecniNeto: `$${finansijskiModel.bilans.neto.toLocaleString()}`,
    },
    integracije: {
      aiIqWorldBank: 'aktivan',
      aiIqMenjacnica: 'aktivan',
      omegaAi: 'aktivan',
      digitalnaIndustrija: 'aktivan',
    },
    endžiniBroj: SPAJA_PRO_VERZIJA_COUNT,
    timestamp: new Date().toISOString(),
  });
}
