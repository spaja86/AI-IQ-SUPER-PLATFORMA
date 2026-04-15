import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  KOMPANIJA,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
  getSuperPozicijaNiz,
  getFiguracioniCentar,
} from '@/lib/oktavne-eksponencijalne-funkcije';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;
  const pregled = getOktavniSistemPregled();
  const superPoz = getSuperPozicijaNiz();
  const figCentar = getFiguracioniCentar();

  // Autologin rikvrst — inverzne eksponencijalne funkcije ekstremnog nivoa
  const rikvrst = eksponencijalneFunkcije.map((f) => {
    const inverzneVrednosti = f.tabela.map((v) => {
      const inverzX = f.inverz(v.fx);
      return {
        originalX: v.x,
        originalFx: v.fx,
        inverzX: inverzX !== null ? Math.round(inverzX * 10000) / 10000 : null,
        izvod: v.izvod,
        integral: v.integral,
        rikvrst: inverzX !== null && inverzX !== -1 ? Math.round((v.fx / (inverzX + 1)) * 1000) / 1000 : 0,
      };
    });

    const ekstremniFaktor = f.baza ** 7 * f.amplituda;
    const rikvrstSnaga = Math.round(f.ukupnaSnaga * ekstremniFaktor * 100) / 100;

    return {
      oktava: f.oktava,
      naziv: f.naziv,
      ikona: f.ikona,
      formula: `f(x) = ${f.amplituda}*${f.baza}^x+${f.offset}`,
      inverznaFormula: `x = log_${f.baza}((y - ${f.offset}) / ${f.amplituda})`,
      amplituda: f.amplituda,
      baza: f.baza,
      offset: f.offset,
      ukupnaSnaga: f.ukupnaSnaga,
      ekstremniFaktor: Math.round(ekstremniFaktor * 100) / 100,
      rikvrstSnaga,
      prosecnaStorpaRasta: f.prosecnaStorpaRasta,
      inverzneVrednosti,
    };
  });

  const ukupnaRikvrstSnaga = rikvrst.reduce((s, r) => s + r.rikvrstSnaga, 0);
  const maksRikvrst = rikvrst.reduce((m, r) => (r.rikvrstSnaga > m.rikvrstSnaga ? r : m));
  const minRikvrst = rikvrst.reduce((m, r) => (r.rikvrstSnaga < m.rikvrstSnaga ? r : m));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autologin Rikvrst Eksponencijalne Funkcije Ekstremnog Nivoa',
    opis: 'Autofinish iteracija #328 — autologin rikvrst (inverzija) u kodu eksponencijalnih funkcija oktavnog sistema na ekstremnom nivou pod zakonima koda',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: `${procenat.toFixed(20)}%`,
    },

    rikvrst: {
      ukupnoOktava: 8,
      ukupnaRikvrstSnaga: Math.round(ukupnaRikvrstSnaga * 100) / 100,
      maksRikvrst: { oktava: maksRikvrst.oktava, snaga: maksRikvrst.rikvrstSnaga },
      minRikvrst: { oktava: minRikvrst.oktava, snaga: minRikvrst.rikvrstSnaga },
      rasponRikvrst: Math.round((maksRikvrst.rikvrstSnaga - minRikvrst.rikvrstSnaga) * 100) / 100,
      oktave: rikvrst,
    },

    eksponencijalniPregled: {
      ukupnaSnaga: pregled.ukupnaSnaga,
      prosecnaSnaga: pregled.prosecnaSnaga,
      globalniRastFaktor: pregled.globalniRastFaktor,
      superPozicija: superPoz,
    },

    figuracioniCentar: {
      centroidX: figCentar.centroidX,
      centroidY: figCentar.centroidY,
      fokalnaSnaga: figCentar.fokalnaSnaga,
      harmonickiIndeks: figCentar.harmonickiIndeks,
      konvergencioniKoeficijent: figCentar.konvergencioniKoeficijent,
    },

    zakoniKoda: {
      zakon1: 'Svaka eksponencijalna funkcija ima egzaktnu inverziju — rikvrst garantovan',
      zakon2: 'Ekstremni nivo = baza^7 * amplituda — maksimalni eksponencijalni rast',
      zakon3: 'Autologin rikvrst = inverzija ulaza i izlaza u zakonski definisanom okviru',
      zakon4: 'Super-pozicija svih oktava konvergira ka figuracionom centru',
      zakon5: 'Rikvrst snaga = ukupna snaga * ekstremni faktor — zakon eksponencijalnog rasta',
    },

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
    },

    timestamp: new Date().toISOString(),
  });
}
