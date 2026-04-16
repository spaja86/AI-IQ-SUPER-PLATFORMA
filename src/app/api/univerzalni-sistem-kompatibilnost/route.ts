import { NextResponse } from 'next/server';
import {
  univerzalniSistemKompatibilnost,
  sistemi,
  kompatibilnostVeze,
  unificiranProtokol,
  getStatistika,
} from '@/lib/univerzalni-sistem-kompatibilnost';

/**
 * 🌐 Univerzalni Sistem Kompatibilnosti — Glavni API
 *
 * GET — Sistem za sve sisteme da sa svima bude kompatibilan.
 * Unificirani protokol, automatska adaptacija, bidirekciona komunikacija.
 *
 * Autofinish #336
 */
export async function GET() {
  const statistika = getStatistika();

  return NextResponse.json({
    sistem: univerzalniSistemKompatibilnost.naziv,
    opis: univerzalniSistemKompatibilnost.opis,
    ikona: univerzalniSistemKompatibilnost.ikona,
    verzija: univerzalniSistemKompatibilnost.verzija,
    izvor: univerzalniSistemKompatibilnost.izvor,

    principi: [
      'Univerzalna kompatibilnost — svaki sistem sa svakim',
      'Unificirani protokol — jedan standard za sve',
      'Automatska adaptacija — prilagodjavanja bez rucnog rada',
      'Bidirekciona komunikacija — dvosmeran protok podataka',
      'Nulta latencija integracije — momentalno povezivanje',
    ],

    sistemi: sistemi.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      ikona: s.ikona,
      kategorija: s.kategorija,
      opis: s.opis,
      verzija: s.verzija,
      tehnologije: s.tehnologije,
      protokoli: s.protokoli,
      kompatibilnostStatus: s.kompatibilnostStatus,
    })),

    protokol: {
      naziv: unificiranProtokol.naziv,
      ikona: unificiranProtokol.ikona,
      opis: unificiranProtokol.opis,
      verzija: unificiranProtokol.verzija,
      podrzkaniFormati: unificiranProtokol.podrzkaniFormati,
      enkripcija: unificiranProtokol.enkripcija,
      autentifikacija: unificiranProtokol.autentifikacija,
    },

    veze: {
      ukupno: kompatibilnostVeze.length,
      aktivnih: kompatibilnostVeze.filter((v) => v.status === 'potpuna').length,
      bidirekcionih: kompatibilnostVeze.filter((v) => v.smer === 'bidirekcioni').length,
      lista: kompatibilnostVeze.map((v) => ({
        izvor: v.izvorSistem,
        cilj: v.ciljSistem,
        protokol: v.protokol,
        smer: v.smer,
        latencija: v.latencija,
        status: v.status,
      })),
    },

    statistika,

    apiEndpointi: [
      '/api/univerzalni-sistem-kompatibilnost',
      '/api/univerzalni-sistem-kompatibilnost-pregled',
    ],

    timestamp: new Date().toISOString(),
  });
}
