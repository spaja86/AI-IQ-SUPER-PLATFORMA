import { NextResponse } from 'next/server';
import { omegaAiMaksimalniSuport } from '@/lib/omega-ai-maksimalni-suport';
import { APP_VERSION } from '@/lib/constants';

/**
 * 📞 OMEGA AI Maksimalni Suport — Glavni API
 *
 * Kompletan pregled sistema maksimalnog suporta sa telefonima, tiketima, SLA i dispeč centrima.
 */
export async function GET() {
  return NextResponse.json({
    sistem: omegaAiMaksimalniSuport.naziv,
    verzija: APP_VERSION,
    opis: omegaAiMaksimalniSuport.opis,
    ikona: omegaAiMaksimalniSuport.ikona,
    status: omegaAiMaksimalniSuport.status,
    ukupnoTelefona: omegaAiMaksimalniSuport.telefoni.length,
    javniBrojevi: omegaAiMaksimalniSuport.javniBrojevi,
    ukupnoTiketa: omegaAiMaksimalniSuport.statistika.ukupnoTiketa,
    telefoni: omegaAiMaksimalniSuport.telefoni.map((t) => ({
      persona: t.personaNaziv,
      ikona: t.personaIkona,
      telefon: t.telefonBroj,
      interni: t.interniPozivni,
      departman: t.departman,
      dostupnost: t.dostupnost,
      aktivan: t.aktivan,
    })),
    tiketi: omegaAiMaksimalniSuport.tiketi.length,
    slaPravila: omegaAiMaksimalniSuport.slaPravila.length,
    dispeCi: omegaAiMaksimalniSuport.dispeCi.length,
    routingPravila: omegaAiMaksimalniSuport.routingPravila,
    operativniOpseg: omegaAiMaksimalniSuport.operativniOpseg,
    statistika: omegaAiMaksimalniSuport.statistika,
    mogucnosti: omegaAiMaksimalniSuport.mogucnosti,
    timestamp: new Date().toISOString(),
  });
}
