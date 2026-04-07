import { NextResponse } from 'next/server';
import {
  finansijskiModel,
  spajaProPlanovi,
  valute,
  getFinansijskiPregled,
} from '@/lib/spaja-pro-planovi';
import { OMEGA_AI_INSTANCI } from '@/lib/constants';

/**
 * SpajaPro Planovi — Finansijski Model
 *
 * Detaljan finansijski pregled:
 * - Vlasnička plata (Kompanija SPAJA)
 * - OMEGA AI plata (po dogovoru)
 * - Operativni troškovi Digitalne Industrije (mesečno)
 * - Prihodi od planova
 * - Bilans (prihod - troškovi)
 */
export async function GET() {
  const pregled = getFinansijskiPregled();

  return NextResponse.json({
    sistem: 'SpajaPro Planovi — Finansijski Model',
    opis: 'Kompletni finansijski model: vlasnik, OMEGA AI, Digitalna Industrija. Srećan rad!',
    vlasnickaPlata: {
      mesecnaOsnovica: `$${pregled.vlasnickaPlata.mesecnaOsnovica.toLocaleString()}/mes`,
      procenatOdPrihoda: `${pregled.vlasnickaPlata.procenatOdPrihoda}%`,
      bonusZaRast: `${pregled.vlasnickaPlata.bonusZaRast}%`,
      ukupnoMesecno: `$${(pregled.vlasnickaPlata.mesecnaOsnovica + Math.round(pregled.prihodi.ukupnoMesecniPrihod * pregled.vlasnickaPlata.procenatOdPrihoda / 100)).toLocaleString()}/mes`,
      opis: pregled.vlasnickaPlata.opis,
    },
    omegaAiPlata: {
      mesecnaOsnovica: `$${pregled.omegaAiPlata.mesecnaOsnovica.toLocaleString()}/mes`,
      poInstanci: `$${pregled.omegaAiPlata.poInstanci}/instanca`,
      ukupnoInstanci: `${OMEGA_AI_INSTANCI.toLocaleString()} instanci`,
      ukupnoMesecno: `$${pregled.omegaAiPlata.ukupnoMesecno.toLocaleString()}/mes`,
      opis: pregled.omegaAiPlata.opis,
    },
    operativniTroskoviDigitalneIndustrije: {
      infrastruktura: `$${pregled.operativniTroskovi.infrastruktura.toLocaleString()}/mes`,
      odrzavanje: `$${pregled.operativniTroskovi.odrzavanje.toLocaleString()}/mes`,
      razvoj: `$${pregled.operativniTroskovi.razvoj.toLocaleString()}/mes`,
      marketing: `$${pregled.operativniTroskovi.marketing.toLocaleString()}/mes`,
      administracija: `$${pregled.operativniTroskovi.administracija.toLocaleString()}/mes`,
      rezerve: `$${pregled.operativniTroskovi.rezerve.toLocaleString()}/mes`,
      ukupnoMesecno: `$${pregled.operativniTroskovi.ukupnoMesecno.toLocaleString()}/mes`,
      opis: pregled.operativniTroskovi.opis,
    },
    prihodi: {
      procenjeniBrojKorisnika: pregled.prihodi.procenjeniBrojKorisnika,
      mesecniPrihodPoPlanu: Object.fromEntries(
        Object.entries(pregled.prihodi.mesecniPrihodPoPlanu).map(([k, v]) => [k, `$${v.toLocaleString()}/mes`])
      ),
      ukupnoMesecniPrihod: `$${pregled.prihodi.ukupnoMesecniPrihod.toLocaleString()}/mes`,
      godisnjiPrihod: `$${pregled.prihodi.godisnjiPrihod.toLocaleString()}/god`,
    },
    bilans: {
      ukupniPrihod: `$${pregled.bilans.ukupniPrihod.toLocaleString()}/mes`,
      ukupniTroskovi: `$${pregled.bilans.ukupniTroskovi.toLocaleString()}/mes`,
      vlasnickaPlata: `$${pregled.bilans.vlasnickaPlata.toLocaleString()}/mes`,
      omegaAiPlata: `$${pregled.bilans.omegaAiPlata.toLocaleString()}/mes`,
      operativniTroskovi: `$${pregled.bilans.operativniTroskovi.toLocaleString()}/mes`,
      neto: `$${pregled.bilans.neto.toLocaleString()}/mes`,
      status: pregled.bilans.status,
    },
    meta: {
      ukupnoPlanova: pregled.ukupnoPlanova,
      ukupnoValuta: pregled.ukupnoValuta,
    },
    timestamp: new Date().toISOString(),
  });
}
