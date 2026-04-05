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
