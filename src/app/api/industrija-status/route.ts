import { NextResponse } from 'next/server';
import { digitalnaIndustrija } from '@/lib/industrija';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Industrija Status',
    verzija: APP_VERSION,

    industrija: {
      naziv: digitalnaIndustrija.name,
      opis: digitalnaIndustrija.description,
      verzijaIndustrije: digitalnaIndustrija.version,
      osnovana: digitalnaIndustrija.founded,
    },

    statistike: {
      platforme: platforms.length,
      organizacije: organizations.length,
      kompanije: companies.length,
      proizvodi: products.length,
      aktivnePlatforme: platforms.filter((p) => p.status === 'active').length,
      aktivneOrganizacije: organizations.filter((o) => o.status === 'active').length,
      aktivneKompanije: companies.filter((c) => c.status === 'active').length,
      aktivniProizvodi: products.filter((p) => p.status === 'active').length,
    },

    timestamp: new Date().toISOString(),
  });
}
