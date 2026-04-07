import { NextResponse } from 'next/server';
import { navigation } from '@/lib/navigation';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_ROUTES } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,
    autofinish: AUTOFINISH_COUNT,
    ukupnoStranica: navigation.length,
    ukupnoRuta: TOTAL_ROUTES,
    navigacija: navigation.map((n) => ({
      label: n.label,
      href: n.href,
      icon: n.icon,
      description: n.description,
    })),
    timestamp: new Date().toISOString(),
  });
}
