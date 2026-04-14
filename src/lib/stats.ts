import { EcosystemStats } from './types';
import { repositories } from './repositories';
import { organizations } from './organizations';
import { products } from './products';
import { omegaPersone } from './omega-ai';

export function getEcosystemStats(): EcosystemStats {
  const allTechnologies = new Set<string>();
  repositories.forEach(r => r.technologies.forEach(t => allTechnologies.add(t)));

  return {
    repositories: repositories.length,
    platforms: repositories.filter(r => r.status === 'active').length,
    organizations: organizations.length,
    products: products.length,
    omegaAIs: omegaPersone.length,
    technologies: Array.from(allTechnologies).sort(),
    yearLaunched: 2026,
  };
}
