import { NextResponse } from 'next/server';
import { proksiSuportSmene, getUkupnoSuportAgenata } from '@/lib/vlasnicki-vip-plan';
import { PROKSI_KAPACITET } from '@/lib/constants';

/**
 * 🛡️ Vlasnički VIP Plan — Proksi Suport Smene API
 *
 * Proksi sa zvaničnom ulogom suporta raspoređen u više smena
 * za 24/7 pokrivanje radi privlačenja što više korisnika.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'Proksi Suport — Raspodela u Smene',
    opis: proksiSuportSmene.opis,
    proksiKapacitet: PROKSI_KAPACITET,
    pokrivanje: proksiSuportSmene.pokrivanje,
    cilj: proksiSuportSmene.cilj,
    ukupnoAgenata: getUkupnoSuportAgenata(),
    smene: proksiSuportSmene.smene.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      vreme: s.vreme,
      ikona: s.ikona,
      pocetak: s.pocetak,
      kraj: s.kraj,
      agenata: s.agenata,
      proksiCvorovi: s.proksiCvorovi,
      opis: s.opis,
    })),
    uloge: proksiSuportSmene.ulogePoSmeni.map((u) => ({
      id: u.id,
      naziv: u.naziv,
      ikona: u.ikona,
      nivo: u.nivo,
      opis: u.opis,
      odgovornosti: u.odgovornosti,
    })),
    timestamp: new Date().toISOString(),
  });
}
