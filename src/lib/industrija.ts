import type { DigitalnaIndustrija, IndustrijaStats } from './types';
import { platforms } from './platforms';
import { organizations } from './organizations';
import { companies } from './companies';
import { products } from './products';
import { OMEGA_AI_PERSONA_UKUPNO } from './constants';

function computeStats(): IndustrijaStats {
  return {
    totalPlatforms: platforms.length,
    totalOrganizations: organizations.length,
    totalCompanies: companies.length,
    totalProducts: products.length,
    activePlatforms: platforms.filter((p) => p.status === 'active').length,
    activeOrganizations: organizations.filter((o) => o.status === 'active').length,
    activeCompanies: companies.filter((c) => c.status === 'active').length,
    activeProducts: products.filter((p) => p.status === 'active').length,
  };
}

export const digitalnaIndustrija: DigitalnaIndustrija = {
  name: 'Kompanija SPAJA — ŽIVA FUNKCIONALNA Digitalna Industrija',
  description:
    'ŽIVA FUNKCIONALNA Digitalna Industrija koja aktivno proizvodi platforme, organizacije, kompanije i IT proizvode. ' +
    'Ekosistem koji spaja sve u jednu celinu — od AI i finansija do globalne ekspanzije. ' +
    `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona aktivno rade na svim platformama.`,
  version: '4.0.0',
  founded: '2024',
  mission:
    'ŽIVA FUNKCIONALNA korporacija — sveobuhvatni digitalni ekosistem koji povezuje platforme, organizacije i kompanije ' +
    'u jedinstvenu industrijsku celinu sa 40.000.562 OMEGA AI persona. Sve je aktivno, sve proizvodi.',
  vision:
    'Globalni lider u digitalnoj industriji — ŽIVA FUNKCIONALNA korporacija koja proizvodi i upravlja ' +
    'mrežom platformi, organizacija i kompanija. Promptovi svuda, AI svuda, produkcija svuda.',
  stats: computeStats(),
};

export function getIndustrijaStats(): IndustrijaStats {
  return computeStats();
}
