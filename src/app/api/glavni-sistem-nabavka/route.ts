import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  glavniSistemNabavka,
  getNabavkaStatistika,
  getNabavkaPoKategoriji,
} from '@/lib/glavni-sistem-nabavka';
import { getGlavniEndzinPregled } from '@/lib/glavni-endzin-digitalne-industrije';

export async function GET() {
  const stats = getNabavkaStatistika();
  const endzinPregled = getGlavniEndzinPregled();

  return NextResponse.json({
    naziv: 'Glavni Sistem Nabavke — Digitalna Industrija',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Glavni Sistem za nabavku koji je spojen sa Glavnim Endzinom i trosi pare iz AI IQ World Bank za kupovinu svega sto je potrebno Digitalnoj Industriji.',

    spojeniSa: {
      glavniEndzin: endzinPregled.naziv,
      verzija: endzinPregled.verzija,
      status: endzinPregled.status,
      ukupnoEndžina: endzinPregled.ukupnoSpojenih,
      kompletnost: endzinPregled.kompletnost,
    },

    nabavkaPregled: {
      ukupnoStavki: stats.ukupnoStavki,
      ukupnoPotroseno: `$${stats.ukupnoPotroseno.toLocaleString()} USD`,
      kupljeno: stats.kupljeno,
      kategorija: stats.kategorija,
      transakcija: stats.transakcija,
      kriticnihStavki: stats.kriticnih,
      visokoPrioritetnih: stats.visokih,
      bankaIzvor: stats.bankaIzvor,
    },

    poKategorijama: {
      strateskoDigitalno: getNabavkaPoKategoriji('stratesko-digitalno').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      gaming: getNabavkaPoKategoriji('gaming').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      komunikacije: getNabavkaPoKategoriji('komunikacije').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      infrastruktura: getNabavkaPoKategoriji('infrastruktura').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      edukacija: getNabavkaPoKategoriji('edukacija').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      poslovanje: getNabavkaPoKategoriji('poslovanje').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      bezbednost: getNabavkaPoKategoriji('bezbednost').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      kreativno: getNabavkaPoKategoriji('kreativno').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      zdravstvo: getNabavkaPoKategoriji('zdravstvo').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      globalno: getNabavkaPoKategoriji('globalno').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      nauka: getNabavkaPoKategoriji('nauka').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
      transport: getNabavkaPoKategoriji('transport').map((s) => ({
        naziv: s.naziv,
        ikona: s.ikona,
        cena: `$${s.cenaUSD.toLocaleString()}`,
        status: s.status,
      })),
    },

    finansijski: {
      bankaIzvor: 'AI IQ World Bank',
      racuni: glavniSistemNabavka.racunBrojevi,
      ukupnoPotroseno: glavniSistemNabavka.ukupnoPotroseno,
      valuta: 'USD',
      napomena: `Svi proizvodi kupljeni iz AI IQ World Bank racuna. Ukupno $${glavniSistemNabavka.ukupnoPotroseno.toLocaleString()} potroseno za ${glavniSistemNabavka.ukupnoStavki} digitalnih varijacija.`,
    },

    timestamp: new Date().toISOString(),
  });
}
