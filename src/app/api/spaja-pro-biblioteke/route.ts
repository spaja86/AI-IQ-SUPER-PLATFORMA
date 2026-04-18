import { NextResponse } from 'next/server';
import { spajaProVerzije, getSveBiblioteke, getUkupnoBiblioteka } from '@/lib/spaja-pro';
import { APP_VERSION, SPAJA_PRO_RANGE } from '@/lib/constants';

export async function GET() {
  const sveBiblioteke = getSveBiblioteke();
  const ukupnoUnikatnih = getUkupnoBiblioteka();

  const poVerziji = spajaProVerzije.map((v) => ({
    verzija: v.verzija,
    naziv: v.naziv,
    kodnoIme: v.kodnoIme,
    ukupnoBiblioteka: v.biblioteke.length,
    biblioteke: v.biblioteke,
  }));

  const kategorije: Record<string, string[]> = {};
  for (const bib of sveBiblioteke) {
    const kat = kategorizujBiblioteku(bib);
    if (!kategorije[kat]) kategorije[kat] = [];
    kategorije[kat].push(bib);
  }

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Biblioteke — Pregled po verzijama',
    opis: `Sve biblioteke integrisane u SpajaPro ${SPAJA_PRO_RANGE} engine`,
    verzija: APP_VERSION,

    statistika: {
      ukupnoUnikatnihBiblioteka: ukupnoUnikatnih,
      raspon: SPAJA_PRO_RANGE,
      ukupnoVerzija: spajaProVerzije.length,
      minBiblioteka: Math.min(...poVerziji.map((v) => v.ukupnoBiblioteka)),
      maxBiblioteka: Math.max(...poVerziji.map((v) => v.ukupnoBiblioteka)),
      prosecnoBiblioteka: Math.round(
        poVerziji.reduce((s, v) => s + v.ukupnoBiblioteka, 0) / poVerziji.length,
      ),
      kategorija: Object.keys(kategorije).length,
    },

    poVerziji,

    kategorije: Object.entries(kategorije).map(([naziv, biblioteke]) => ({
      naziv,
      ukupno: biblioteke.length,
      biblioteke,
    })),

    sveBiblioteke,

    timestamp: new Date().toISOString(),
  });
}

function kategorizujBiblioteku(naziv: string): string {
  const lower = naziv.toLowerCase();
  if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('svelte') || lower.includes('next') || lower.includes('tailwind') || lower.includes('css'))
    return 'Frontend';
  if (lower.includes('express') || lower.includes('fastify') || lower.includes('nest') || lower.includes('node') || lower.includes('deno') || lower.includes('bun'))
    return 'Backend';
  if (lower.includes('tensor') || lower.includes('torch') || lower.includes('ml') || lower.includes('brain') || lower.includes('onnx') || lower.includes('hugging') || lower.includes('langchain') || lower.includes('llama') || lower.includes('openai') || lower.includes('neural'))
    return 'AI/ML';
  if (lower.includes('postgres') || lower.includes('mongo') || lower.includes('redis') || lower.includes('prisma') || lower.includes('drizzle') || lower.includes('supabase') || lower.includes('firebase') || lower.includes('sql') || lower.includes('graphql'))
    return 'Baze podataka';
  if (lower.includes('test') || lower.includes('jest') || lower.includes('vitest') || lower.includes('cypress') || lower.includes('playwright') || lower.includes('storybook'))
    return 'Testiranje';
  if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('terraform') || lower.includes('aws') || lower.includes('vercel') || lower.includes('ci') || lower.includes('github'))
    return 'DevOps';
  if (lower.includes('crypto') || lower.includes('jwt') || lower.includes('oauth') || lower.includes('helmet') || lower.includes('bcrypt') || lower.includes('zod') || lower.includes('auth'))
    return 'Bezbednost';
  if (lower.includes('socket') || lower.includes('grpc') || lower.includes('mqtt') || lower.includes('websocket') || lower.includes('sse'))
    return 'Komunikacija';
  if (lower.includes('three') || lower.includes('d3') || lower.includes('chart') || lower.includes('pixi') || lower.includes('canvas') || lower.includes('webgl'))
    return 'Vizuelizacija';
  if (lower.includes('lodash') || lower.includes('ramda') || lower.includes('rxjs') || lower.includes('date') || lower.includes('moment') || lower.includes('uuid'))
    return 'Utility';
  return 'Ostalo';
}
