import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  dnevnaRaspodelaSistem,
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
    banka: dnevnaRaspodelaSistem.banka,
    pravilo: {
      ukupanProcenatRaspodele: PROCENAT_RASPODELE,
      procenatPoRacunu: PROCENAT_PO_RACUNU,
      brojRacuna: 3,
      operativnaRezerva: OPERATIVNA_REZERVA,
      objasnjenje: `Od celokupne zarade na dnevnom nivou, ${PROCENAT_RASPODELE}% od ukupnog dnevnog dobita se stavlja na 3 racuna — po ${PROCENAT_PO_RACUNU}% na svaki racun`,
    },
    racuni: dnevnaRaspodelaSistem.pravilo.racuni.map((r) => ({
      tip: r.tip,
      valuta: r.valuta,
      brojRacuna: r.brojRacuna,
      procenat: `${r.procenatOdDnevnogDobita}%`,
      naziv: r.naziv,
      opis: r.opis,
    })),
    primeriSimulacija: primerSimulacije.map((s) => ({
      dnevniDobit: `${s.dnevniDobit.toLocaleString()} RSD`,
      raspodela: s.raspodelaNaRacune.map((r) => ({
        racun: r.racun,
        valuta: r.valuta,
        procenat: `${r.procenat}%`,
        iznos: `${r.iznos.toLocaleString()} RSD`,
      })),
      ukupnoRaspodeljeno: `${s.ukupnoRaspodeljeno.toLocaleString()} RSD (${s.procenatRaspodeljen}%)`,
      operativnaRezerva: `${s.operativnaRezerva.toLocaleString()} RSD (${s.procenatRezerve}%)`,
    })),
    mogucnosti: dnevnaRaspodelaSistem.mogucnosti,
    timestamp: new Date().toISOString(),
  });
}
