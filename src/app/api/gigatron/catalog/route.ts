import { NextRequest, NextResponse } from 'next/server';
import { getGigatronKatalog, type GigatronKatalogFilteri, type GigatronKategorija, type GigatronBrand } from '@/lib/gigatron/gigatron-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filteri: GigatronKatalogFilteri = {};

  const kategorija = searchParams.get('kategorija');
  if (kategorija) filteri.kategorija = kategorija as GigatronKategorija;

  const brand = searchParams.get('brand');
  if (brand) filteri.brand = brand as GigatronBrand;

  const minCena = searchParams.get('minCenaEUR');
  if (minCena) filteri.minCenaEUR = Number(minCena);

  const maxCena = searchParams.get('maxCenaEUR');
  if (maxCena) filteri.maxCenaEUR = Number(maxCena);

  const dostupnost = searchParams.get('dostupnost');
  if (dostupnost) filteri.dostupnost = dostupnost as GigatronKatalogFilteri['dostupnost'];

  const pretraga = searchParams.get('q');
  if (pretraga) filteri.pretraga = pretraga;

  const stranica = Math.max(1, Number(searchParams.get('stranica') ?? '1'));
  const poStranici = Math.min(50, Math.max(1, Number(searchParams.get('poStranici') ?? '10')));

  const rezultat = getGigatronKatalog(filteri, stranica, poStranici);

  return NextResponse.json({
    ok: true,
    ...rezultat,
    timestamp: new Date().toISOString(),
  });
}
