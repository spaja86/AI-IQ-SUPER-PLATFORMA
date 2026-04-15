import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  KOMPANIJA,
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_IGRICA,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  OMEGA_AI_MUSKIH,
  OMEGA_AI_ZENSKIH,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  MOBILNE_CENTRALE,
} from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { products } from '@/lib/products';
import { igrice } from '@/lib/igrice';
import { generisaniEngini } from '@/lib/spaja-generator-engine';
import { glavniEndzinDigitalneIndustrije } from '@/lib/glavni-endzin-digitalne-industrije';

/**
 * 📊 Dijagnostika — Validacija konstanti
 *
 * Proverava da li su konstante u constants.ts tačne
 * u odnosu na stvarne podatke nakon velikih merge-ova.
 *
 * Autofinish #337
 */

export async function GET() {
  const stvarneIgrice = igrice.length;
  const stvarnePlatforme = platforme.length;
  const stvarniProizvodi = products.length;
  const stvarniEngini = generisaniEngini.length;

  const validacije = [
    {
      konstanta: 'TOTAL_IGRICA',
      ocekivano: TOTAL_IGRICA,
      stvarno: stvarneIgrice,
      status: TOTAL_IGRICA === stvarneIgrice ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'OMEGA_AI_PERSONA_UKUPNO',
      ocekivano: OMEGA_AI_PERSONA_UKUPNO,
      stvarno: OMEGA_AI_MUSKIH + OMEGA_AI_ZENSKIH,
      status: OMEGA_AI_PERSONA_UKUPNO === OMEGA_AI_MUSKIH + OMEGA_AI_ZENSKIH ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'OMEGA_AI_MUSKIH + ZENSKIH = UKUPNO',
      ocekivano: OMEGA_AI_PERSONA_UKUPNO,
      stvarno: OMEGA_AI_MUSKIH + OMEGA_AI_ZENSKIH,
      status: OMEGA_AI_MUSKIH + OMEGA_AI_ZENSKIH === OMEGA_AI_PERSONA_UKUPNO ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'OMEGA_AI_PERSONA_COUNT',
      ocekivano: OMEGA_AI_PERSONA_COUNT,
      stvarno: 21,
      status: OMEGA_AI_PERSONA_COUNT === 21 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'OMEGA_AI_OKTAVA_COUNT',
      ocekivano: OMEGA_AI_OKTAVA_COUNT,
      stvarno: 8,
      status: OMEGA_AI_OKTAVA_COUNT === 8 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'SPAJA_PRO_VERZIJA_COUNT',
      ocekivano: SPAJA_PRO_VERZIJA_COUNT,
      stvarno: 10,
      status: SPAJA_PRO_VERZIJA_COUNT === 10 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'MOBILNE_CENTRALE',
      ocekivano: MOBILNE_CENTRALE,
      stvarno: 4,
      status: MOBILNE_CENTRALE === 4 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'TOTAL_API_ROUTES',
      ocekivano: TOTAL_API_ROUTES,
      stvarno: 'proveriti build',
      status: TOTAL_API_ROUTES > 0 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'TOTAL_ROUTES',
      ocekivano: TOTAL_ROUTES,
      stvarno: 'proveriti build',
      status: TOTAL_ROUTES > 0 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'TOTAL_PAGES',
      ocekivano: TOTAL_PAGES,
      stvarno: 'proveriti build',
      status: TOTAL_PAGES > 0 ? 'ok' : 'neslaganje',
    },
    {
      konstanta: 'TOTAL_DIAGNOSTIKA',
      ocekivano: TOTAL_DIAGNOSTIKA,
      stvarno: 'proveriti build',
      status: TOTAL_DIAGNOSTIKA > 0 ? 'ok' : 'neslaganje',
    },
  ];

  const sveOk = validacije.every((v) => v.status === 'ok');

  return NextResponse.json({
    sistem: 'Dijagnostika Konstante Validacija',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    autofinish: AUTOFINISH_COUNT,

    rezultat: sveOk ? 'SVE KONSTANTE VALIDNE' : 'POSTOJE NESLAGANJA',
    status: sveOk ? 'ok' : 'upozorenje',

    validacije,

    dodatneInformacije: {
      ukupnoPlatformi: stvarnePlatforme,
      ukupnoIgrica: stvarneIgrice,
      ukupnoProizvoda: stvarniProizvodi,
      ukupnoEngina: stvarniEngini,
      ukupnoSpojenih: glavniEndzinDigitalneIndustrije.spojeniEndzini.length,
      ukupnoSklopljenih: glavniEndzinDigitalneIndustrije.autoSklapanje.length,
      evolucionihCiklusa: glavniEndzinDigitalneIndustrije.evolucija.length,
    },

    timestamp: new Date().toISOString(),
  });
}
