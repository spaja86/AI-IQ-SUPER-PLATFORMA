export type SekvencaTip =
  | 'hero'
  | 'statistika'
  | 'progres'
  | 'kartice'
  | 'tabela'
  | 'cta'
  | 'baner'
  | 'lista'
  | 'hijerarhija'
  | 'tekst';

export interface Sekvenca {
  id: string;
  tip: SekvencaTip;
  naslov?: string;
  podnaslov?: string;
  ikona?: string;
  podaci: Record<string, unknown>;
  stil?: 'podrazumevani' | 'gradijent' | 'tamni' | 'svetli' | 'akcent';
  redosled: number;
}

export interface StranicaKonfiguracija {
  putanja: string;
  naslov: string;
  opis: string;
  sekvence: Sekvenca[];
}

export type StatusPlatforme = 'aktivna' | 'razvoj' | 'planiranje' | 'spremna';
export type KategorijaPlatforme = 'jezgro' | 'finansije' | 'globalno' | 'ai' | 'socijalno' | 'alati';

export interface DeployInfo {
  status: 'aktivan' | 'neaktivan' | 'u_pripremi';
  domen?: string;
  vercelProjekt?: string;
  framework: string;
  buildKomanda: string;
}

export interface Platforma {
  id: string;
  naziv: string;
  opis: string;
  kategorija: KategorijaPlatforme;
  repo: string;
  url: string;
  ikona: string;
  status: StatusPlatforme;
  progres: number;
  tehnologije: string[];
  funkcije: string[];
  deploy: DeployInfo;
}

export type KategorijaProizvoda =
  | 'ubrzanje' | 'monitoring' | 'bezbednost' | 'ai'
  | 'deploy' | 'integracija' | 'podaci' | 'komunikacija'
  | 'gaming';

export interface ITProizvod {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: KategorijaProizvoda;
  funkcije: string[];
  ciljnePlatforme: string[];
  uticaj: 'visok' | 'srednji' | 'nizak';
}

export type KategorijaSajta = 'ekosistem' | 'tehnoloski-partner' | 'drustvena-mreza';

export interface Sajt {
  id: string;
  naziv: string;
  url: string;
  ikona: string;
  kategorija: KategorijaSajta;
  opis: string;
}

export type OmegaAIUloga =
  | 'Arhitekta' | 'Cuvar' | 'Lekar' | 'Graditelj' | 'Dizajner'
  | 'Optimizator' | 'Strateg' | 'Naucnik' | 'Mentor' | 'Integrator'
  | 'Analiticar' | 'Komunikator' | 'Evolver' | 'Tester' | 'Dokumentar'
  | 'Finansijer' | 'Kreator' | 'Skalator' | 'Monitor' | 'Ekolog' | 'Vizionar';

export interface OmegaAI {
  uloga: OmegaAIUloga;
  odgovornosti: string[];
  prompt?: string;
}

export type SpajaProStatus = 'aktivna' | 'beta' | 'razvoj' | 'planirana';
export type PromptPrioritet = 'kritican' | 'visok' | 'srednji' | 'nizak';

// ── English-language types ───────────────────────────────────────────────────

export type EntityStatus = 'active' | 'development' | 'planned' | 'archived';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  type: 'parent' | 'subsidiary' | 'joint-venture' | 'startup' | 'spin-off';
  status: EntityStatus;
  icon: string;
  industry: string;
  products: string[];
  platformIds: string[];
  organizationIds: string[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  type: 'division' | 'department' | 'team' | 'lab' | 'unit' | 'foundation';
  status: EntityStatus;
  icon: string;
  parentId?: string;
  platformIds: string[];
  mission: string;
  capabilities: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: EntityStatus;
  icon: string;
  version: string;
  platformId?: string;
  features: string[];
  techStack: string[];
}

export interface PlatformDeploy {
  status: string;
  domain?: string;
  vercelProject?: string;
  framework: string;
  buildCommand: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  category: string;
  status: EntityStatus;
  icon: string;
  techStack: string[];
  features: string[];
  deploy?: PlatformDeploy;
}

export interface IndustrijaStats {
  totalPlatforms: number;
  totalOrganizations: number;
  totalCompanies: number;
  totalProducts: number;
  activePlatforms: number;
  activeOrganizations: number;
  activeCompanies: number;
  activeProducts: number;
}

export interface DigitalnaIndustrija {
  name: string;
  description: string;
  version: string;
  founded: string;
  mission: string;
  vision: string;
  stats: IndustrijaStats;
}
