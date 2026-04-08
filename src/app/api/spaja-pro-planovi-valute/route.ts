import { NextResponse } from 'next/server';
import {
  valute,
  kursnaLista,
  getSveCeneUValuti,
  spajaProPlanovi,
  type ValutaKod,
} from '@/lib/spaja-pro-planovi';

/**
 * SpajaPro Planovi — Multi-valutni Sistem
 *
 * Sve cene u svim valutama — AI IQ World Bank + AI IQ Menjačnica.
 * Isti planovi za Srbiju, Ameriku i ceo svet.
 */
export async function GET() {
  const sveValute = valute.map((v) => ({
    kod: v.kod,
    naziv: v.naziv,
    simbol: v.simbol,
    zemlja: v.zemlja,
    ikona: v.ikona,
    tipValute: v.tipValute,
    kursPremaUSD: kursnaLista[v.kod],
    planovi: spajaProPlanovi.map((p) => {
      const kurs = kursnaLista[v.kod];
      return {
        plan: p.naziv,
        mesecno: `${v.simbol} ${Math.round(p.cenaUSD.mesecno * kurs * 100) / 100}`,
        godisnje: `${v.simbol} ${Math.round(p.cenaUSD.godisnje * kurs * 100) / 100}`,
      };
    }),
  }));

  return NextResponse.json({
    sistem: 'SpajaPro Planovi — Multi-valutni Sistem',
    opis: 'Cene SpajaPro planova u svim podržanim valutama. AI IQ World Bank obrađuje transakcije, AI IQ Menjačnica konvertuje.',
    ukupnoValuta: valute.length,
    fiatValute: valute.filter((v) => v.tipValute === 'fiat').length,
    kriptoValute: valute.filter((v) => v.tipValute === 'kripto').length,
    valute: sveValute,
    integracije: {
      aiIqWorldBank: 'Globalna obrada transakcija u svim valutama',
      aiIqMenjacnica: 'Real-time konverzija po važećem kursu',
    },
    timestamp: new Date().toISOString(),
  });
}
