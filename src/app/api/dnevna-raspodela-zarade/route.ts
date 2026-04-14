import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  dnevnaRaspodelaSistem,
  digitalnaIndustrijaRacun,
  primerSimulacije,
  PROCENAT_RASPODELE,
  PROCENAT_PO_RACUNU,
  OPERATIVNA_REZERVA,
} from '@/lib/dnevna-raspodela-zarade';

export async function GET() {
  return NextResponse.json({
    naziv: dnevnaRaspodelaSistem.naziv,
    opis: dnevnaRaspodelaSistem.opis,
    verzija: APP_VERSION,
    status: dnevnaRaspodelaSistem.status,
    kompanija: dnevnaRaspodelaSistem.kompanija,
    ersteBanka: dnevnaRaspodelaSistem.ersteBanka,
    aiIqWorldBank: {
      naziv: dnevnaRaspodelaSistem.aiIqWorldBank.naziv,
      vlasnikRacuna: dnevnaRaspodelaSistem.aiIqWorldBank.vlasnikRacuna,
      racun: {
        tip: digitalnaIndustrijaRacun.tip,
        valuta: digitalnaIndustrijaRacun.valuta,
        brojRacuna: digitalnaIndustrijaRacun.brojRacuna,
        procenat: `${OPERATIVNA_REZERVA}%`,
        naziv: digitalnaIndustrijaRacun.naziv,
        opis: digitalnaIndustrijaRacun.opis,
      },
      status: dnevnaRaspodelaSistem.aiIqWorldBank.status,
    },
    pravilo: {
      ukupanProcenatRaspodele: PROCENAT_RASPODELE,
      procenatPoRacunu: PROCENAT_PO_RACUNU,
      brojRacuna: 3,
      rezervaProcenat: OPERATIVNA_REZERVA,
      rezervaDestinacija: 'Digitalna Industrija racun u AI IQ World Bank',
      objasnjenje: `Od celokupne zarade na dnevnom nivou: ${PROCENAT_RASPODELE}% ide na 3 ERSTE racuna (po ${PROCENAT_PO_RACUNU}%), a preostalih ${OPERATIVNA_REZERVA}% ide na racun Digitalne Industrije u AI IQ World Bank`,
    },
    ersteRacuni: dnevnaRaspodelaSistem.pravilo.racuni.map((r) => ({
      tip: r.tip,
      valuta: r.valuta,
      brojRacuna: r.brojRacuna,
      procenat: `${r.procenatOdDnevnogDobita}%`,
      naziv: r.naziv,
      opis: r.opis,
      banka: r.banka,
    })),
    primeriSimulacija: primerSimulacije.map((s) => ({
      dnevniDobit: `${s.dnevniDobit.toLocaleString()} RSD`,
      ersteRaspodela: s.raspodelaNaRacune.map((r) => ({
        racun: r.racun,
        valuta: r.valuta,
        procenat: `${r.procenat}%`,
        iznos: `${r.iznos.toLocaleString()} RSD`,
        banka: r.banka,
      })),
      digitalnaIndustrija: {
        racun: s.rezervaDigitalnaIndustrija.racun,
        procenat: `${s.rezervaDigitalnaIndustrija.procenat}%`,
        iznos: `${s.rezervaDigitalnaIndustrija.iznos.toLocaleString()} RSD`,
        banka: s.rezervaDigitalnaIndustrija.banka,
      },
      ukupnoRaspodeljeno: `${s.ukupnoRaspodeljeno.toLocaleString()} RSD (${s.procenatRaspodeljen}%)`,
    })),
    mogucnosti: dnevnaRaspodelaSistem.mogucnosti,
    timestamp: new Date().toISOString(),
  });
}
