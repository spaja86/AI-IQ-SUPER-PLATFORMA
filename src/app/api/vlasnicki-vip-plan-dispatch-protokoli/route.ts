import { NextResponse } from 'next/server';
import { omegaDispatchProtokoli, getUkupnoMesecniProtokoli } from '@/lib/vlasnicki-vip-plan';
import { OMEGA_AI_PERSONA_COUNT, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

/**
 * 🤖 Vlasnički VIP Plan — OMEGA AI Dispatch Protokoli API
 *
 * OMEGA AI dispatch preuzima telefonske brojeve od industrije
 * i sprovodi protokole za internet i mobilne brojeve.
 * Mesečna naplata kroz AI IQ World Bank.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Dispatch Protokoli — Kompanija SPAJA',
    opis: omegaDispatchProtokoli.opis,
    omegaAi: {
      persona: OMEGA_AI_PERSONA_COUNT,
      instanci: OMEGA_AI_PERSONA_UKUPNO.toLocaleString(),
    },
    protokoli: omegaDispatchProtokoli.protokoli.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      tip: p.tip,
      ikona: p.ikona,
      opis: p.opis,
      mesecnaCena: `$${p.mesecnaCena}/mes`,
      mogucnosti: p.mogucnosti,
    })),
    telefonskiBrojevi: {
      naziv: omegaDispatchProtokoli.telefonskiBrojevi.naziv,
      opis: omegaDispatchProtokoli.telefonskiBrojevi.opis,
      centraleBroj: omegaDispatchProtokoli.telefonskiBrojevi.centraleBroj,
      pozivniBrojevi: omegaDispatchProtokoli.telefonskiBrojevi.pozivniBrojevi,
      mesecnaPretplata: `$${omegaDispatchProtokoli.telefonskiBrojevi.mesecnaPretplata}/mes`,
    },
    internetProtokoli: omegaDispatchProtokoli.internetProtokoli.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      brzina: p.brzina,
      mesecnaCena: `$${p.mesecnaCena}/mes`,
    })),
    mesecnaNaplata: {
      internetPaketi: omegaDispatchProtokoli.mesecnaNaplata.internetPaketiBroj,
      mobilniPaketi: omegaDispatchProtokoli.mesecnaNaplata.mobilniPaketiBroj,
      ukupnoMesecniPrihod: `$${omegaDispatchProtokoli.mesecnaNaplata.ukupnoMesecniPrihod.toLocaleString()}/mes`,
      opis: omegaDispatchProtokoli.mesecnaNaplata.opis,
    },
    ukupnoCenaProtokola: `$${getUkupnoMesecniProtokoli().toFixed(2)}/mes po korisniku`,
    status: omegaDispatchProtokoli.status,
    timestamp: new Date().toISOString(),
  });
}
