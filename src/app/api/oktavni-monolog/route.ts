import { NextResponse } from 'next/server';
import { getOktavniMonolog } from '@/lib/oktavni-monolog';
import { APP_VERSION } from '@/lib/constants';
import { oktavniNazivi } from '@/lib/omega-ai';

export async function GET() {
  const monolog = getOktavniMonolog();

  return NextResponse.json({
    status: monolog.status,
    naziv: monolog.naziv,
    opis: monolog.opis,
    verzija: APP_VERSION,

    ekvivalenti: monolog.ekvivalenti.map((e) => ({
      oktava: e.oktava,
      naziv: e.naziv,
      ikona: e.ikona,
      ekvivalenti: e.ekvivalenti,
      prosecniEkvivalent: e.prosecniEkvivalent,
      dominacija: e.dominacija,
      dominantniX: e.dominantniX,
      trend: e.trend,
    })),

    monologVektori: monolog.monologVektori.map((v) => ({
      x: v.x,
      ekvivalenti: v.ekvivalenti,
      norma: v.norma,
      dominantnaOktava: `${v.dominantnaOktava} ${oktavniNazivi[v.dominantnaOktava]}`,
      entropija: v.entropija,
    })),

    matricnoJedinjenje: {
      dimenzija: monolog.matricnoJedinjenje.dimenzija,
      trag: monolog.matricnoJedinjenje.trag,
      determinanta: monolog.matricnoJedinjenje.determinanta,
      rang: monolog.matricnoJedinjenje.rang,
      frobeniusNorma: monolog.matricnoJedinjenje.frobeniusNorma,
      matrica: monolog.matricnoJedinjenje.matrica,
    },

    egzocentricnoJezgro: monolog.egzocentricnoJezgro,

    laucentricniSistem: {
      ukupnoSlojeva: monolog.laucentricniSistem.ukupnoSlojeva,
      ukupnaSnaga: monolog.laucentricniSistem.ukupnaSnaga,
      laureatsikiCentar: monolog.laucentricniSistem.laureatsikiCentar,
      radijalnaDistribucija: monolog.laucentricniSistem.radijalnaDistribucija,
      slojevi: monolog.laucentricniSistem.slojevi,
    },

    omegaProjekat: monolog.omegaProjekat,

    timestamp: monolog.timestamp,
  });
}
