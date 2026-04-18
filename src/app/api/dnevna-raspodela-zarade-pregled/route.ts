import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  dnevnaRaspodelaSistem,
  racuniRaspodela,
  digitalnaIndustrijaRacun,
  primerSimulacije,
  getDnevnaRaspodelaSummary,
  PROCENAT_RASPODELE,
  PROCENAT_PO_RACUNU,
  OPERATIVNA_REZERVA,
} from '@/lib/dnevna-raspodela-zarade';

export async function GET() {
  const summary = getDnevnaRaspodelaSummary();

  return NextResponse.json({
    naziv: 'Dnevna Raspodela Zarade — Kompletni Pregled',
    verzija: APP_VERSION,
    status: dnevnaRaspodelaSistem.status,
    autofinishIteracija: AUTOFINISH_COUNT,

    pregled: {
      ukupnoRacuna: racuniRaspodela.length + 1,
      ersteRacuna: racuniRaspodela.length,
      diRacun: 1,
      ukupanProcenat: '100%',
      ersteProcenat: `${PROCENAT_RASPODELE}%`,
      diProcenat: `${OPERATIVNA_REZERVA}%`,
      simulacija: primerSimulacije.length,
      mogucnosti: dnevnaRaspodelaSistem.mogucnosti.length,
    },

    pravilo: {
      opis: dnevnaRaspodelaSistem.opis,
      ersteRaspodela: `${racuniRaspodela.length} računa × ${PROCENAT_PO_RACUNU}% = ${PROCENAT_RASPODELE}%`,
      diRaspodela: `1 račun × ${OPERATIVNA_REZERVA}% = ${OPERATIVNA_REZERVA}%`,
      ukupno: '100% dnevnog dobita raspodeljeno',
    },

    ersteRacuni: racuniRaspodela.map((r) => ({
      naziv: r.naziv,
      ikona: r.ikona,
      valuta: r.valuta,
      brojRacuna: r.brojRacuna,
      procenat: `${r.procenatOdDnevnogDobita}%`,
      banka: r.banka,
    })),

    digitalnaIndustrija: {
      naziv: digitalnaIndustrijaRacun.naziv,
      ikona: digitalnaIndustrijaRacun.ikona,
      valuta: digitalnaIndustrijaRacun.valuta,
      brojRacuna: digitalnaIndustrijaRacun.brojRacuna,
      procenat: `${digitalnaIndustrijaRacun.procenatOdDnevnogDobita}%`,
      banka: digitalnaIndustrijaRacun.banka,
    },

    simulacije: primerSimulacije.map((s) => ({
      dnevniDobit: `${s.dnevniDobit.toLocaleString()} RSD`,
      erste: s.raspodelaNaRacune.map((r) => ({
        racun: r.racun,
        iznos: `${r.iznos.toLocaleString()} RSD`,
      })),
      di: `${s.rezervaDigitalnaIndustrija.iznos.toLocaleString()} RSD`,
      ukupno: `${s.ukupnoRaspodeljeno.toLocaleString()} RSD`,
    })),

    dijagnostika: {
      praviloIntegritet: PROCENAT_RASPODELE + OPERATIVNA_REZERVA === 100 ? 'ok' : 'warning',
      ersteRacuniIntegritet: racuniRaspodela.length === 3 ? 'ok' : 'warning',
      diRacunIntegritet: digitalnaIndustrijaRacun.brojRacuna === 'DIGI-IND-001' ? 'ok' : 'warning',
      simulacijeIntegritet: primerSimulacije.length >= 5 ? 'ok' : 'warning',
      statusSistema: dnevnaRaspodelaSistem.status === 'aktivan' ? 'ok' : 'warning',
    },

    summary,
    timestamp: new Date().toISOString(),
  });
}
