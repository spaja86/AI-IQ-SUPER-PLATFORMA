import type { DigitalnaIndustrija, IndustrijaStats } from './types';
import { platforms } from './platforms';
import { organizations } from './organizations';
import { companies } from './companies';
import { products } from './products';

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
  name: 'Kompanija SPAJA — Digitalna Industrija',
  description:
    'Digitalna Industrija koja pravi platforme, organizacije, kompanije i IT proizvode. ' +
    'Ekosistem koji spaja sve u jednu celinu — od AI i finansija do globalne ekspanzije.',
  version: '3.0.0',
  founded: '2024',
  mission:
    'Kreiranje sveobuhvatnog digitalnog ekosistema koji povezuje platforme, organizacije i kompanije ' +
    'u jedinstvenu industrijsku celinu sa AI podrškom.',
  vision:
    'Postati globalni lider u digitalnoj industriji — korporacija koja proizvodi i upravlja ' +
    'mrežom platformi, organizacija i kompanija za budućnost.',
  stats: computeStats(),
};

export function getIndustrijaStats(): IndustrijaStats {
  return computeStats();
}
