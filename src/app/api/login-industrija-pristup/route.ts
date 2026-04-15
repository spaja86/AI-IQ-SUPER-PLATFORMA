import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import { platforme } from '@/lib/platforme';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';
import {
  ioOpenUIAOGamingPlatforma,
  gamingStatistika,
  gamingKonfiguracija,
  gejmingKonstrukcija,
  getAktivneIgriceSaEndzinom,
} from '@/lib/io-openui-ao-gaming-platforma';

/**
 * 🏭 Login Industrija Pristup — Kompletni Pristup Digitalnoj Industriji
 *
 * Logovanjem korisnik dobija pristup industriji i svim njenim
 * delatnostima, platformama, ekosistemu i svemu ostalom.
 *
 * Za digitalnu industriju i gejming platformu — sve sto je u
 * pitanju gejminga je ozivljeno kroz Otavnu Konstrukciju Gejminga.
 *
 * Autofinish #329
 */

export async function GET() {
  const stats = getIndustrijaStats();
  const aktivneIgrice = getAktivneIgriceSaEndzinom();

  return NextResponse.json({
    sistem: 'Login Industrija Pristup — Digitalna Industrija',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    opis:
      'Logovanjem se dobija pristup industriji i svim njenim delatnostima, ' +
      'platformama, ekosistemu i svemu ostalom cemu raspolaze. ' +
      'Za digitalnu industriju i gejming platformu — sve sto je u pitanju ' +
      'gejminga je ozivljeno kroz Otavnu Konstrukciju Gejminga.',

    industrija: {
      naziv: digitalnaIndustrija.name,
      opis: digitalnaIndustrija.description,
      verzija: digitalnaIndustrija.version,
      misija: digitalnaIndustrija.mission,
      vizija: digitalnaIndustrija.vision,
      statistika: stats,
    },

    pristupPoslePrijave: {
      platforme: platforme.map((p) => ({
        id: p.id,
        naziv: p.naziv,
        kategorija: p.kategorija,
        url: `https://${p.deploy.domen}`,
        status: p.deploy.status,
      })),
      ukupnoPlatformi: platforme.length,
      organizacije: {
        ukupno: stats.totalOrganizations,
        aktivno: stats.activeOrganizations,
      },
      kompanije: {
        ukupno: stats.totalCompanies,
        aktivno: stats.activeCompanies,
      },
      proizvodi: {
        ukupno: stats.totalProducts,
        aktivno: stats.activeProducts,
      },
    },

    ekosistem: {
      platforms: platforms.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
      })),
      organizations: organizations.map((o) => ({
        id: o.id,
        name: o.name,
        type: o.type,
        status: o.status,
      })),
      companies: companies.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        status: c.status,
      })),
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
      })),
    },

    gamingPlatforma: {
      naziv: ioOpenUIAOGamingPlatforma.naziv,
      verzija: ioOpenUIAOGamingPlatforma.verzija,
      url: gamingKonfiguracija.standardniUrl,
      domen: gamingKonfiguracija.domen,
      aktivan: gamingKonfiguracija.aktivan,
      statistika: gamingStatistika,
      aktivnihIgrica: aktivneIgrice.length,
    },

    gejmingKonstrukcija: {
      id: gejmingKonstrukcija.id,
      naziv: gejmingKonstrukcija.naziv,
      opis: gejmingKonstrukcija.opis,
      ektodanariKapacitet: gejmingKonstrukcija.ektodanariKapacitet,
      aktivna: gejmingKonstrukcija.aktivna,
      verzija: gejmingKonstrukcija.verzija,
      platformaUrl: gejmingKonstrukcija.platformaUrl,
      ukupnoEndzina: gejmingKonstrukcija.endzini.length,
    },

    delatnosti: [
      'Digitalna Industrija — upravljanje platformama i ekosistemom',
      'Gaming Platforma — IO/OPENUI/AO sa 95 igrica',
      'AI Platforma — OMEGA AI sa 40.000.562 persona',
      'Finansije — Banka, Menjacnica, Platni Sistem',
      'Proksi Mreza — Signal infrastruktura',
      'Mobilna Mreza — Telekomunikacije',
      'IT Proizvodi — Digitalni hardver i softver',
      'SpajaPro Engine — v6-v15 endzini',
      'SPAJA Generator za Endzine — kreiranje endzina',
      'OpenAI Platforma — Sopstvena AI platforma',
    ],

    timestamp: new Date().toISOString(),
  });
}
