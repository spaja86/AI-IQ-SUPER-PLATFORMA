import { NextResponse } from 'next/server';
import { platforme } from '@/lib/platforme';
import { proksiSignali, proksiCvorovi } from '@/lib/proksi';
import { mobilniServisi } from '@/lib/mobilna-mreza';
import { dimenzije } from '@/lib/dimenzije';
import { sajtovi } from '@/lib/sajtovi';
import { APP_VERSION, PROKSI_KAPACITET, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,

    mreza: {
      proksi: {
        kapacitet: PROKSI_KAPACITET,
        signali: proksiSignali.length,
        cvorovi: proksiCvorovi.length,
        topologija: 'hibridna',
      },
      mobilnaMreza: {
        centrale: MOBILNE_CENTRALE,
        servisi: mobilniServisi.length,
        pozivniBrojevi: MOBILNI_POZIVNI,
        protokol: 'SPAJA-NET 6G',
      },
      wifiAntena: {
        status: 'aktivan',
        pokrivenost: 'globalna',
        standard: 'WiFi 7 + Proksi',
      },
    },

    platforme: {
      ukupno: platforme.length,
      aktivnih: platforme.filter((p) => p.status === 'aktivna' || p.status === 'spremna').length,
      uRazvoju: platforme.filter((p) => p.status === 'razvoj').length,
      vercelDeploy: platforme.filter((p) => p.deploy?.status === 'aktivan').length,
    },

    dimenzije: {
      ukupno: dimenzije.length,
      opseg: '360D — 5760D',
    },

    sajtovi: {
      ukupno: sajtovi.length,
    },

    deploy: {
      provider: 'Vercel',
      framework: 'Next.js 16',
      runtime: 'Edge + Node.js',
      regioni: ['iad1', 'fra1', 'sfo1'],
    },

    timestamp: new Date().toISOString(),
  });
}
