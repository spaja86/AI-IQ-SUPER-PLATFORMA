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
  POSLOVNI_NOVCANIK: 'https://ai-iq-super-platforma.vercel.app/poslovni-novcanik',
  PALASTERIZACIJA: 'https://ai-iq-super-platforma.vercel.app/palasterizacija',
  EKSOSISTZDACIJA: 'https://ai-iq-super-platforma.vercel.app/eksosistzdacija',
  POLIMERZACIJA: 'https://ai-iq-super-platforma.vercel.app/polimerzacija',
  DEPLOY_PLATFORMA: 'https://ai-iq-super-platforma.vercel.app/deploy-platforma',
  MEKARTOR: 'https://ai-iq-super-platforma.vercel.app/mekartor',
} as const;

export const EKOSISTEM_DEPLOY_PROVIDER = {
  IO_OPENUI_AO: 'vercel',
  AI_IQ_WORLD_BANK: 'vercel',
  AI_IQ_MENJACNICA: 'vercel',
  KOMPANIJA_SPAJA: 'custom',
  AI_IQ_SUPER_PLATFORMA: 'vercel',
  POSLOVNI_NOVCANIK: 'vercel',
  PALASTERIZACIJA: 'vercel',
  EKSOSISTZDACIJA: 'vercel',
  POLIMERZACIJA: 'vercel',
  DEPLOY_PLATFORMA: 'vercel',
  MEKARTOR: 'vercel',
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
    naziv: 'Poslovni Novcanik',
    url: EKOSISTEM_URLS.POSLOVNI_NOVCANIK,
    ikona: '💼',
    opis: 'Poslovni wallet modul povezan sa AI IQ World Bank',
  },
  {
    naziv: 'Palasterizacija',
    url: EKOSISTEM_URLS.PALASTERIZACIJA,
    ikona: '🧱',
    opis: 'Modul za standardizaciju i stabilizaciju procesa Digitalne Industrije',
  },
  {
    naziv: 'Eksosistzdacija',
    url: EKOSISTEM_URLS.EKSOSISTZDACIJA,
    ikona: '🧩',
    opis: 'Modul za mapiranje i konsolidaciju ekosistemskih tokova Digitalne Industrije',
  },
  {
    naziv: 'Mekartor',
    url: EKOSISTEM_URLS.MEKARTOR,
    ikona: '🧭',
    opis: 'Repo-local staged rollout surface sa health proverom i deploy governance audit trail-om',
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
