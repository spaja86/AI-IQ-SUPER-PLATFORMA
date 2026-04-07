import { NextResponse } from 'next/server';
import { marketingFondacija, getUkupnoMarketingBudzet } from '@/lib/vlasnicki-vip-plan';

/**
 * 📢 Vlasnički VIP Plan — Marketing Fondacija API
 *
 * Fondacija za reklamiranje i marketing — obavezni strateški potezi
 * za privlačenje korisnika globalno.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'Marketing Fondacija — Kompanija SPAJA',
    opis: marketingFondacija.opis,
    mesecniBudzet: `$${marketingFondacija.mesecniBudzet.toLocaleString()}/mes`,
    godisnjiTarget: `$${marketingFondacija.godisnjiTarget.toLocaleString()}/god`,
    kanali: marketingFondacija.kanali.map((k) => ({
      id: k.id,
      naziv: k.naziv,
      tip: k.tip,
      ikona: k.ikona,
      opis: k.opis,
      budzet: `$${k.budzet.toLocaleString()}/mes`,
      procenat: `${k.procenat}%`,
      kpi: k.kpi,
    })),
    strategija: {
      obavezniPotezi: marketingFondacija.strategija.obavezni,
      opcioniPotezi: marketingFondacija.strategija.opcioni,
      ciljevi: marketingFondacija.strategija.ciljevi,
    },
    fondoviRaspodela: {
      reklamiranje: `$${marketingFondacija.fondoviRaspodela.reklamiranje.toLocaleString()}/mes`,
      marketing: `$${marketingFondacija.fondoviRaspodela.marketing.toLocaleString()}/mes`,
      prKomunikacija: `$${marketingFondacija.fondoviRaspodela.prKomunikacija.toLocaleString()}/mes`,
      eventovi: `$${marketingFondacija.fondoviRaspodela.eventovi.toLocaleString()}/mes`,
      rezerve: `$${marketingFondacija.fondoviRaspodela.rezerve.toLocaleString()}/mes`,
      ukupno: `$${marketingFondacija.fondoviRaspodela.ukupno.toLocaleString()}/mes`,
    },
    ukupnoKanalBudzet: `$${getUkupnoMarketingBudzet().toLocaleString()}/mes`,
    timestamp: new Date().toISOString(),
  });
}
