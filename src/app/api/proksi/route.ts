import { NextResponse } from 'next/server';
import { proksiSignali, proksiCvorovi } from '@/lib/proksi';
import { PROKSI_KAPACITET } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Proksi Digitalni Sistem',
    kapacitet: PROKSI_KAPACITET,
    topologija: 'hibridna',
    signali: {
      ukupno: proksiSignali.length,
      lista: proksiSignali.map((s) => ({
        id: s.id,
        naziv: s.naziv,
        tip: s.tip,
        frekvencija: s.frekvencija,
        ikona: s.ikona,
      })),
    },
    cvorovi: {
      ukupno: proksiCvorovi.length,
      lista: proksiCvorovi.map((c) => ({
        id: c.id,
        naziv: c.naziv,
        ikona: c.ikona,
      })),
    },
    integracije: ['mobilna-mreza', 'wifi-antena', 'github-deploy'],
    timestamp: new Date().toISOString(),
  });
}
