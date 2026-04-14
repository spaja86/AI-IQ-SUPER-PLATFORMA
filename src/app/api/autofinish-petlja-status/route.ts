import { NextResponse } from 'next/server';
import { getAutofinishPetljaStatus } from '@/lib/autofinish-petlja';

export async function GET() {
  const status = getAutofinishPetljaStatus();

  return NextResponse.json({
    ...status,
    napomena: status.status === 'zavrsena'
      ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Petlja zavrsena uspesno.'
      : 'Autofinish petlja nastavlja ponavljanje dok svi podsistemi ne budu na 100%.',
    timestamp: new Date().toISOString(),
  });
}
