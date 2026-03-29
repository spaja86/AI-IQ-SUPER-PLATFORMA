import type { Company } from './types';

export const companies: Company[] = [
  {
    id: 'kompanija-spaja',
    name: 'Kompanija SPAJA',
    description: 'Matična kompanija — Digitalna Industrija koja pravi platforme, organizacije i proizvode.',
    type: 'parent',
    status: 'active',
    icon: '🏛️',
    industry: 'Digitalna Industrija',
    products: ['AI-IQ SUPER PLATFORMA', 'IO-OPENUI-AO', 'DevOps Alati'],
    platformIds: ['ai-iq-super', 'io-openui-ao', 'devops-tools', 'admin-panel'],
    organizationIds: ['spaja-hq', 'tech-division', 'ai-lab', 'finance-dept', 'product-team', 'global-ops'],
  },
  {
    id: 'spaja-fintech',
    name: 'SPAJA FinTech',
    description: 'Subsidiary kompanija za finansijske tehnologije — banka, menjačnica, plaćanja.',
    type: 'subsidiary',
    status: 'development',
    icon: '💳',
    industry: 'FinTech',
    products: ['SPAJA Banka', 'SPAJA Menjačnica'],
    platformIds: ['banka-platforma', 'menjacnica-platforma'],
    organizationIds: ['finance-dept'],
  },
  {
    id: 'spaja-ai',
    name: 'SPAJA AI',
    description: 'Kompanija fokusirana na veštačku inteligenciju, ML modele i automatizaciju.',
    type: 'subsidiary',
    status: 'development',
    icon: '🤖',
    industry: 'Artificial Intelligence',
    products: ['AI Engine', 'AI Analitika'],
    platformIds: ['ai-engine', 'ai-analytics'],
    organizationIds: ['ai-lab'],
  },
  {
    id: 'spaja-commerce',
    name: 'SPAJA Commerce',
    description: 'Kompanija za e-commerce i digitalnu tržnicu unutar ekosistema.',
    type: 'startup',
    status: 'planned',
    icon: '🛒',
    industry: 'E-Commerce',
    products: ['SPAJA Marketplace'],
    platformIds: ['marketplace'],
    organizationIds: ['product-team'],
  },
  {
    id: 'spaja-social',
    name: 'SPAJA Social',
    description: 'Kompanija za društvene platforme i komunikacione alate.',
    type: 'startup',
    status: 'planned',
    icon: '💬',
    industry: 'Social Media',
    products: ['SPAJA Social Network'],
    platformIds: ['social-network'],
    organizationIds: ['product-team'],
  },
  {
    id: 'spaja-global',
    name: 'SPAJA Global',
    description: 'Kompanija za međunarodnu ekspanziju i globalne operacije.',
    type: 'joint-venture',
    status: 'planned',
    icon: '🌐',
    industry: 'Global Operations',
    products: ['Global Connect'],
    platformIds: ['global-connect'],
    organizationIds: ['global-ops'],
  },
];

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function getActiveCompanies(): Company[] {
  return companies.filter((c) => c.status === 'active');
}

export function getCompaniesByType(type: string): Company[] {
  return companies.filter((c) => c.type === type);
}

export function getSubsidiaries(): Company[] {
  return companies.filter((c) => c.type !== 'parent');
}
