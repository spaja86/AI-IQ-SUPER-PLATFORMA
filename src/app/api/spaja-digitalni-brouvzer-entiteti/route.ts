import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  brouvzerEntiteti,
  getAktivniEntiteti,
  getEntitetiPoTipu,
} from '@/lib/spaja-digitalni-brouvzer';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Digitalni Brouvzer — Entiteti',
    verzija: APP_VERSION,
    ukupnoEntiteta: brouvzerEntiteti.length,
    aktivnihEntiteta: getAktivniEntiteti().length,
    entitetiPoTipu: {
      platforma: getEntitetiPoTipu('platforma').length,
      organizacija: getEntitetiPoTipu('organizacija').length,
      korporacija: getEntitetiPoTipu('korporacija').length,
      kompanija: getEntitetiPoTipu('kompanija').length,
      prodavnica: getEntitetiPoTipu('prodavnica').length,
      servis: getEntitetiPoTipu('servis').length,
      aplikacija: getEntitetiPoTipu('aplikacija').length,
    },
    entiteti: brouvzerEntiteti.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      opis: e.opis,
      ikona: e.ikona,
      tip: e.tip,
      url: e.url,
      status: e.status,
      kategorija: e.kategorija,
      funkcije: e.funkcije,
    })),
    timestamp: new Date().toISOString(),
  });
}
