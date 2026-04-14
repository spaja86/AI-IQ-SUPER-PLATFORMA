/**
 * Centralni Ekosistem URL-ovi — Kompanija SPAJA
 *
 * Jedan izvor istine za sve URL-ove u ekosistemu.
 * Ako se URL promeni, menja se SAMO ovde i automatski se primenjuje svuda.
 *
 * HTML platforme koriste `shared/ecosystem-urls.js` (kopija ovih podataka).
 * Next.js aplikacija koristi ovaj fajl.
 */

export const EKOSISTEM_URLS = {
  IO_OPENUI_AO: 'https://io-openui-ao.vercel.app/',
  AI_IQ_WORLD_BANK: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html',
  AI_IQ_MENJACNICA: 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app/index.html',
  KOMPANIJA_SPAJA: 'https://www.kompanija-spaja.com',
  AI_IQ_SUPER_PLATFORMA: 'https://ai-iq-super-platforma-fb43rn7r0-nikolas-projects-b8a8458f.vercel.app/platforme',
} as const;

export interface EkosistemPlatforma {
  naziv: string;
  url: string;
  ikona: string;
  opis: string;
}

export const ekosistemPlatforme: EkosistemPlatforma[] = [
  {
    naziv: 'IO-OPENUI-AO',
    url: EKOSISTEM_URLS.IO_OPENUI_AO,
    ikona: '🖥️',
    opis: 'SpajaPro Engine + Laboratorija + Gaming Platforma',
  },
  {
    naziv: 'Ai Iq World Bank',
    url: EKOSISTEM_URLS.AI_IQ_WORLD_BANK,
    ikona: '🏦',
    opis: 'Digitalna banka sa globalnim dometom i 40% kamatom',
  },
  {
    naziv: 'Ai Iq Menjacnica',
    url: EKOSISTEM_URLS.AI_IQ_MENJACNICA,
    ikona: '💱',
    opis: 'Svetska menjacnica sa BTC, SPAJA BTC i 150+ kripto valuta',
  },
  {
    naziv: 'Kompanija SPAJA',
    url: EKOSISTEM_URLS.KOMPANIJA_SPAJA,
    ikona: '🏢',
    opis: 'Korporativna platforma — spajamo sve timove i procese',
  },
  {
    naziv: 'AI-IQ Super Platforma',
    url: EKOSISTEM_URLS.AI_IQ_SUPER_PLATFORMA,
    ikona: '🧠',
    opis: 'Centralna platforma za upravljanje celim ekosistemom',
  },
];

export function getEkosistemBezTrenutne(trenutnaPlatforma: string): EkosistemPlatforma[] {
  return ekosistemPlatforme.filter((p) => p.naziv !== trenutnaPlatforma);
}
