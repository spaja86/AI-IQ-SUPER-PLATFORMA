import { NextResponse } from 'next/server';
import { vlasnickiAutorizacije } from '@/lib/vlasnicki-vip-plan';

/**
 * 🔐 Vlasnički VIP Plan — Ekstremne Autorizacije API
 *
 * Detaljan pregled svih ekstremnih autorizacija vlasnika
 * na svim platformama ekosistema.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'Vlasnički VIP Plan — Ekstremne Autorizacije',
    nivo: vlasnickiAutorizacije.nivo,
    vlasnikEmail: 'spajicn@yahoo.com',
    platforme: vlasnickiAutorizacije.platforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      autorizacija: p.autorizacija,
      opis: p.opis,
    })),
    pristup: vlasnickiAutorizacije.pristup,
    ekstremneDozvole: vlasnickiAutorizacije.ekstremneDozvole,
    globalno: {
      sesijeBezIsteka: vlasnickiAutorizacije.sesijeBezIsteka,
      globalniPristup: vlasnickiAutorizacije.globalniPristup,
      sveValute: vlasnickiAutorizacije.sveValute,
      sviEndzini: vlasnickiAutorizacije.sviEndzini,
    },
    timestamp: new Date().toISOString(),
  });
}
