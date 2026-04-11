import { NextResponse } from 'next/server';
import { pokreniAutofinishPetlju } from '@/lib/autofinish-petlja';

export async function GET() {
  const izvestaj = pokreniAutofinishPetlju();

  return NextResponse.json({
    ...izvestaj,
    napomena: izvestaj.status === 'zavrsena'
      ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Autofinish petlja zavrsena.'
      : 'Autofinish petlja ce nastaviti ponavljanje dok svi podsistemi ne budu na 100%.',
  });
}
