import { NextResponse } from 'next/server';
import { platformCategories } from '@/lib/platforms';
import { productCategories } from '@/lib/products';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const platformKategorije = Object.entries(platformCategories);
  const proizvodKategorije = Object.entries(productCategories);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Kategorije Pregled — Sve Kategorije Ekosistema',
    verzija: APP_VERSION,

    pregled: {
      platformKategorija: platformKategorije.length,
      proizvodKategorija: proizvodKategorije.length,
      ukupno: platformKategorije.length + proizvodKategorije.length,
    },

    platforme: platformKategorije.map(([kljuc, val]) => ({
      id: kljuc,
      naziv: val.label,
      ikona: val.icon,
    })),

    proizvodi: proizvodKategorije.map(([kljuc, val]) => ({
      id: kljuc,
      naziv: val.label,
      ikona: val.icon,
    })),

    timestamp: new Date().toISOString(),
  });
}
