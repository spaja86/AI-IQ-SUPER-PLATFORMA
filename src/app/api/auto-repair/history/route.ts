import { NextResponse } from 'next/server';
import type { RepairHistory } from '@/lib/auto-repair';

export async function GET() {
  const history: RepairHistory[] = [
    {
      akcija: {
        id: 'repair-cache-1',
        naziv: 'Ciscenje kesha',
        opis: 'Automatsko ciscenje build kesha',
        tip: 'automatski',
        status: 'uspesno',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      rezultat: 'Kes uspesno ociscen. Build ponovo pokrenut.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      akcija: {
        id: 'repair-types-1',
        naziv: 'Regeneracija tipova',
        opis: 'Regeneracija TypeScript deklaracija',
        tip: 'automatski',
        status: 'uspesno',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      rezultat: 'TypeScript tipovi regenerisani. 0 gresaka.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  return NextResponse.json({
    ukupno: history.length,
    istorija: history,
    timestamp: new Date().toISOString(),
  });
}
