import { NextResponse } from 'next/server';
import {
  wifiAntene,
  matricnaJednacenja,
  githubIntegracije,
  wifiAntenaMreza,
  getAktivneAntene,
  getAktivniDeploj,
} from '@/lib/proksi-wifi-antena';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivneAntene = getAktivneAntene();
  const aktivniDeploj = getAktivniDeploj();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'WiFi Antena Pregled — Kompletna Antena Mreža',
    verzija: APP_VERSION,

    pregled: {
      ukupnoAntena: wifiAntene.length,
      aktivnih: aktivneAntene.length,
      matricnihJednacenja: matricnaJednacenja.length,
      githubIntegracija: githubIntegracije.length,
      aktivnihDeploja: aktivniDeploj.length,
    },

    mreza: {
      naziv: wifiAntenaMreza.naziv,
      ukupniDomet: wifiAntenaMreza.ukupniDomet,
      ukupnaSnaga: wifiAntenaMreza.ukupnaSnaga,
    },

    antene: wifiAntene.map((a) => ({
      id: a.id,
      naziv: a.naziv,
      ikona: a.ikona,
      tip: a.tip,
      frekvencija: a.frekvencija,
    })),

    jednacenja: matricnaJednacenja.map((j) => ({
      id: j.id,
      naziv: j.naziv,
      rezim: j.rezim,
    })),

    timestamp: new Date().toISOString(),
  });
}
