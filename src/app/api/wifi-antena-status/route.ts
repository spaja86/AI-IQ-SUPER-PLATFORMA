import { NextResponse } from 'next/server';
import { wifiAntene, wifiAntenaMreza } from '@/lib/proksi-wifi-antena';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'WiFi Antena Status',
    verzija: APP_VERSION,

    mreza: {
      naziv: wifiAntenaMreza.naziv,
      ukupniDomet: wifiAntenaMreza.ukupniDomet,
      ukupnaSnaga: wifiAntenaMreza.ukupnaSnaga,
      oktavniOpseg: wifiAntenaMreza.oktavniOpseg,
      ukupnoAntena: wifiAntenaMreza.antene.length,
      ukupnoJednacenja: wifiAntenaMreza.matricnaJednačenja.length,
      ukupnoIntegracija: wifiAntenaMreza.githubIntegracije.length,
    },

    antene: wifiAntene.map((a) => ({
      id: a.id,
      naziv: a.naziv,
      tip: a.tip,
      status: a.status,
      frekvencija: a.frekvencija,
    })),

    statistike: {
      aktivnih: wifiAntene.filter((a) => a.status === 'aktivna').length,
      tipova: [...new Set(wifiAntene.map((a) => a.tip))].length,
    },

    timestamp: new Date().toISOString(),
  });
}
