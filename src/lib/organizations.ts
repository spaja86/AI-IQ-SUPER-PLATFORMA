import type { Organization } from './types';

export const organizations: Organization[] = [
  {
    id: 'spaja-hq',
    name: 'SPAJA HQ',
    description: 'Centrala Kompanija SPAJA — strateško upravljanje celim ekosistemom digitalne industrije.',
    type: 'division',
    status: 'active',
    icon: '🏢',
    platformIds: ['ai-iq-super', 'admin-panel'],
    mission: 'Upravljanje i koordinacija svih organizacija, kompanija i platformi u ekosistemu.',
    capabilities: ['Strategija', 'Upravljanje', 'Koordinacija', 'Finansije'],
  },
  {
    id: 'tech-division',
    name: 'Tech Division',
    description: 'Tehnološka divizija zadužena za razvoj svih platformi i IT proizvoda.',
    type: 'division',
    status: 'active',
    icon: '💻',
    parentId: 'spaja-hq',
    platformIds: ['ai-iq-super', 'io-openui-ao', 'devops-tools'],
    mission: 'Razvoj i održavanje svih tehnoloških rešenja u ekosistemu.',
    capabilities: ['Full-stack development', 'DevOps', 'Cloud', 'Architecture'],
  },
  {
    id: 'ai-lab',
    name: 'AI Lab',
    description: 'Istraživačka laboratorija za veštačku inteligenciju i mašinsko učenje.',
    type: 'lab',
    status: 'active',
    icon: '🔬',
    parentId: 'tech-division',
    platformIds: ['ai-engine', 'ai-analytics'],
    mission: 'Istraživanje i primena AI/ML tehnologija za unapređenje ekosistema.',
    capabilities: ['Machine Learning', 'NLP', 'Computer Vision', 'Data Science'],
  },
  {
    id: 'finance-dept',
    name: 'Finansijski Sektor',
    description: 'Departman za upravljanje finansijskim platformama i uslugama.',
    type: 'department',
    status: 'active',
    icon: '💰',
    parentId: 'spaja-hq',
    platformIds: ['banka-platforma', 'menjacnica-platforma'],
    mission: 'Razvoj i upravljanje finansijskim uslugama u okviru ekosistema.',
    capabilities: ['Banking', 'Payments', 'Exchange', 'Compliance'],
  },
  {
    id: 'product-team',
    name: 'Product Team',
    description: 'Tim za dizajn i razvoj korisničkih proizvoda.',
    type: 'team',
    status: 'active',
    icon: '🎨',
    parentId: 'tech-division',
    platformIds: ['marketplace', 'social-network'],
    mission: 'Kreiranje i iteracija korisničkih proizvoda sa fokusom na UX.',
    capabilities: ['Product Design', 'UX Research', 'Prototyping', 'A/B Testing'],
  },
  {
    id: 'global-ops',
    name: 'Global Operations',
    description: 'Operativni tim za internacionalnu ekspanziju i globalna tržišta.',
    type: 'unit',
    status: 'active',
    icon: '🌍',
    parentId: 'spaja-hq',
    platformIds: ['global-connect'],
    mission: 'Ekspanzija ekosistema na međunarodna tržišta.',
    capabilities: ['Localization', 'Compliance', 'Partnerships', 'Market Research'],
  },
  {
    id: 'spaja-foundation',
    name: 'SPAJA Fondacija',
    description: 'Fondacija za podršku edukaciji, open-source projektima i zajednici.',
    type: 'foundation',
    status: 'active',
    icon: '🤝',
    parentId: 'spaja-hq',
    platformIds: [],
    mission: 'Podrška zajednici, edukaciji i open-source inicijativama.',
    capabilities: ['Edukacija', 'Mentorstvo', 'Open Source', 'Community'],
  },
];

export function getOrganizationById(id: string): Organization | undefined {
  return organizations.find((o) => o.id === id);
}

export function getChildOrganizations(parentId: string): Organization[] {
  return organizations.filter((o) => o.parentId === parentId);
}

export function getActiveOrganizations(): Organization[] {
  return organizations.filter((o) => o.status === 'active');
}

export function getOrganizationsByType(type: string): Organization[] {
  return organizations.filter((o) => o.type === type);
}
