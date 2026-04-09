import { NextResponse } from 'next/server';
import { getPlasiranjeIzvestaj } from '@/lib/omega-projekat-plasiranje';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const izvestaj = getPlasiranjeIzvestaj();

  return NextResponse.json({
    status: 'operativno',
    verzija: APP_VERSION,
    projekat: izvestaj.naziv,
    kompanija: izvestaj.kompanija,
    datumPlasiranja: izvestaj.datumPlasiranja,
    saglasnostOsnivaca: izvestaj.saglasnostOsnivaca,

    progres: {
      faze: `${izvestaj.zavrsenihFaza}/${izvestaj.ukupnoFaza}`,
      sistemi: `${izvestaj.aktivnihSistema}/${izvestaj.ukupnoSistema}`,
      procenat: 100,
    },

    metrike: izvestaj.metrike,

    faze: izvestaj.faze.map((f) => ({
      redosled: f.redosled,
      naziv: f.naziv,
      faza: f.faza,
      status: f.status,
      zavrsen: f.zavrsen,
    })),

    sistemi: izvestaj.sistemi.map((s) => ({
      naziv: s.naziv,
      status: s.status,
      progres: s.progres,
    })),

    timestamp: new Date().toISOString(),
  });
}
