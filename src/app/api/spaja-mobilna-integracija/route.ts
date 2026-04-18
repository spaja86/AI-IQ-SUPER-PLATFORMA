import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  MOBILNE_CENTRALE,
  MOBILNI_POZIVNI,
  PROKSI_KAPACITET,
} from '@/lib/constants';
import { mreza1873G } from '@/lib/mobilna-mreza';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Mobilna–Proksi Integracija',
    verzija: APP_VERSION,

    mobilnaMreza: {
      centrale: MOBILNE_CENTRALE,
      pozivniBrojevi: MOBILNI_POZIVNI,
      servisi: ['Pozivi', 'SMS', 'Internet', 'VoIP', 'RCS'],
      pokrivenost: '100% SPAJA teritorija',
      mreza1873G: {
        generacija: '1873G',
        opseg: '1G — 1873G',
        bezAntena: mreza1873G.bezAntena,
        bezCentrale: mreza1873G.bezCentrale,
        razlogBezCentrale: mreza1873G.razlogBezCentrale,
        signala: mreza1873G.signali.length,
      },
    },

    proksiMreza: {
      kapacitet: PROKSI_KAPACITET,
      cvorovi: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
      protokoli: ['SPAJA-TLS', 'Proksi-HTTP/3', 'QR-Link', 'MatrixSync'],
    },

    integracija: {
      status: 'aktivna',
      tip: 'Mobilna ↔ Proksi bidirekciona veza',
      latencija: '< 1ms (matricna optimizacija)',
      transferProtokol: 'SPAJA Ultra Transfer Protocol v3',
      enkapsulacija: 'Proksi-Mobile-Tunnel (PMT)',
      kvalitetServisa: 'QoS Level 5 — Ultra prioritet',
    },

    endpointi: {
      mobilna: ['/api/mobilna-mreza', '/api/mobilna-mreza-pregled', '/api/mobilna-mreza-status', '/api/mobilna-statistika'],
      proksi: ['/api/proksi', '/api/proksi-pregled', '/api/proksi-status', '/api/proksi-kapacitet', '/api/proksi-github-deploy'],
    },

    timestamp: new Date().toISOString(),
  });
}
