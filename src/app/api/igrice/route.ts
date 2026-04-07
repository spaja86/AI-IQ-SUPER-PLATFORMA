import { NextResponse } from 'next/server';
import { igrice, getSveKategorijeIgrica } from '@/lib/igrice';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();

  return NextResponse.json({
    ukupno: igrice.length,
    kategorija: kategorije.length,
    kategorijeNazivi: kategorije,
    igrice: igrice.map((ig) => ({
      id: ig.id,
      naziv: ig.naziv,
      kategorija: ig.kategorija,
      opis: ig.opis,
      ikona: ig.ikona,
      status: ig.status,
      podrazumevanaDimenzija: ig.podrazumevanaDimenzija,
    })),
    timestamp: new Date().toISOString(),
  });
}
