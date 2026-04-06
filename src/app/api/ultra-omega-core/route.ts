import { NextResponse } from 'next/server';
import {
  paradigme,
  tipoviPodataka,
  operatori,
  naredbe,
  kompajlerFaze,
  omegaRuntime,
  spajaUltraOmegaCore,
} from '@/lib/spaja-ultra-omega-core';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ultra OMEGA Core — Kompletna Specifikacija',
    verzija: APP_VERSION,

    pregled: {
      paradigmi: paradigme.length,
      tipovaPodataka: tipoviPodataka.length,
      operatora: operatori.length,
      naredbi: naredbe.length,
      kompajlerFaza: kompajlerFaze.length,
    },

    core: {
      naziv: spajaUltraOmegaCore.naziv,
      verzija: spajaUltraOmegaCore.verzija,
    },

    runtime: {
      naziv: omegaRuntime.naziv,
      verzija: omegaRuntime.verzija,
    },

    paradigme: paradigme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      paradigma: p.paradigma,
    })),

    kompajlerFaze: kompajlerFaze.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      ikona: f.ikona,
    })),

    timestamp: new Date().toISOString(),
  });
}
