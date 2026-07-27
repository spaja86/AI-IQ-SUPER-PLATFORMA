import { NextResponse } from 'next/server';
import {
  getFiguracioniCentar,
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { APP_VERSION } from '@/lib/constants';
import { oktavniNazivi } from '@/lib/omega-ai';
import { getEksponencionalneGeometrijskeRazmere } from '@/lib/eksponencionalne-geometrijske-razmere';

export async function GET() {
  const centar = getFiguracioniCentar();
  const pregled = getOktavniSistemPregled();
  const razmere = getEksponencionalneGeometrijskeRazmere();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Figuracioni Centar Eksponencijalnog Objekta',
    opis: 'Centralni konfiguracioni objekat oktavnog sistema — centroid, fokalna snaga, figuracione ose, harmonicki indeks',
    verzija: APP_VERSION,

    figuracioniCentar: {
      centroidX: centar.centroidX,
      centroidY: centar.centroidY,
      fokalnaSnaga: centar.fokalnaSnaga,
      harmonickiIndeks: centar.harmonickiIndeks,
      konvergencioniKoeficijent: centar.konvergencioniKoeficijent,
    },

    slojevi: centar.slojevi,

    figuracioneOse: centar.figuracioneOse.map((o) => ({
      izvor: `${o.oktavaIzvor} ${oktavniNazivi[o.oktavaIzvor]}`,
      cilj: `${o.oktavaCilj} ${oktavniNazivi[o.oktavaCilj]}`,
      presekX: o.presecnaVrednostX,
      presekY: o.presecnaVrednostY,
      ugaoNagiba: o.ugaoNagiba,
      harmonickiOdnos: o.harmonickiOdnos,
      tip: o.tip,
    })),

    eksponencijalniObjekat: centar.eksponencijalniObjekat,

    sistemPregled: {
      ukupnoOktava: pregled.ukupnoOktava,
      ukupnaSnaga: pregled.ukupnaSnaga,
      ukupnoPersona: pregled.ukupnoPersona,
      globalniRastFaktor: pregled.globalniRastFaktor,
      geometrijskiIndeks: pregled.geometrijskiIndeks,
      kombinovaniIndeksRazmera: razmere.agregati.kombinovaniIndeks,
    },

    funkcije: eksponencijalneFunkcije.map((f) => ({
      oktava: f.oktava,
      naziv: oktavniNazivi[f.oktava],
      formula: `${f.amplituda}*${f.baza}^x+${f.offset}`,
      snaga: f.ukupnaSnaga,
    })),

    timestamp: new Date().toISOString(),
  });
}
