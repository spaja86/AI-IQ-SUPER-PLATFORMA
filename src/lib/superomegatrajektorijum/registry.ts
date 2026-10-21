import { omegaItems } from '../omegatrojektorijum';
import { githubProjectUrl, omegaProjects } from '../omegatrojektorijum-projects';
import { platforme } from '../platforme';
import { deployRegistry, deploymentProviders } from '../deploy/deploy-registry';
import { kpiSnapshot } from '../deploy/deploy-portfolio-data';
import { OMEGA_SKELETON } from '../suoc-pilot/omega';
import deployEvidence from '../../../public/deploy_status.json';
import { validateRegistry, type RegistryEntry } from './model';

export const REGISTRY_PATH = '/superomegatrajektorijum';
export const SOURCE_REVISION = 'f6c2be5b25d5849193c9067b1f3f5aa67480d4ef';
const repo = 'https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA';
const code = (path: string) => `${repo}/blob/${SOURCE_REVISION}/${path}`;
const omegaDocs = code('docs/VRH-OMEGA-SKELETON.md');

// Explicitly reviewed local surfaces; presence of a configured platform does not add it here.
const localApps = [
  ['catalog', 'OMEGATROJEKTORIJUM', '/omegatrojektorijum', 'Katalog ideja sa pretragom, JSON izvozom i pregledom projekata.'],
  ['studio', 'Lokalni filmski studio', '/omegatrojektorijum/studio', 'Snimanje u pregledaču uz dozvolu; bez udaljenog render servisa.'],
  ['bank-prototype', 'Bankarski prototip', '/bank-prototype', 'Lokalni prototip; stvarna plaćanja i izdavanje kartica nisu deo ove potvrde.'],
  ['suoc-repl', 'SUOC razvojni panel', '/spaja-ultra-repl', 'Interfejs za postojeći SUOC parser i runtime; bez potvrde produkcionog rada.'],
  ['transformers', 'TRANSFORMERS 1350', '/transformers', 'Lokalni prototip: robot/vozilo, tri kamere i duel protiv skriptovanog bota.'],
  ['deploy-hub', 'SPAJA Deploy panel', '/deploy-platforma', 'Postojeći panel; ovde se prikazuje samo referenca. Akcije u panelu imaju zasebne provere.'],
] as const;

export function buildSuperOmegaRegistry(): RegistryEntry[] {
  const entries: RegistryEntry[] = localApps.map(([id, name, address, description]) => ({
    id: `app:${id}`, name, address, description, kind: 'application', status: 'local', addressScope: 'application',
    source: { label: 'Lokalne aplikacije', url: code(`src/app${address}/page.tsx`), recordId: address },
    evidence: { url: code(`src/app${address}/page.tsx`), scope: 'Implementacija rute u kodu. Produkciona dostupnost i sve zavisnosti nisu proverene.' }, availability: null,
  }));
  entries.push(...platforme.map((platform): RegistryEntry => ({
    id: `platform:${platform.id}`, name: platform.naziv, kind: 'platform', status: 'documented',
    description: `Platforma iz postojećeg kataloga; kategorija: ${platform.kategorija}. Opis i konfiguracija ne potvrđuju operativne mogućnosti.`,
    address: platform.url || `${repo}/blob/${SOURCE_REVISION}/src/lib/platforme.ts`, addressScope: 'external',
    source: { label: 'Katalog platformi', url: code('src/lib/platforme.ts'), recordId: platform.id },
    evidence: { url: code('src/lib/platforme.ts'), scope: 'Evidentiran unos u izvornom registru; procenat izgrađenosti i status nisu merenje rada.' },
    availability: null, metadata: { 'Konfiguracioni status': platform.status, 'Repozitorijum': platform.repo, 'Tehnologije (deklarisane)': platform.tehnologije.join(', ') },
  })));
  entries.push(...omegaProjects.map((project): RegistryEntry => ({
    id: `repo:${project.repository.toLowerCase()}`, name: project.name, description: project.purpose,
    kind: 'repository', status: project.status === 'planned' ? 'planned' : project.status === 'local' ? 'local' : 'documented',
    address: githubProjectUrl(project.repository), addressScope: 'external',
    source: { label: 'Povezani GitHub projekti', url: code('src/lib/omegatrojektorijum-projects.ts'), recordId: project.repository },
    evidence: { url: project.evidence, scope: project.boundary }, availability: null,
    metadata: { 'Pristup': project.access === 'private' ? 'Privatan — potreban ovlašćen pristup' : 'Javan prema registru', 'Veza': project.relationship, 'Sledeći korak': project.nextStep },
  })));
  entries.push(...deployRegistry.map((deployment): RegistryEntry => ({
    id: `deploy:${deployment.id}`, name: deployment.naziv, kind: 'deployment', status: 'documented',
    description: 'Deployment konfiguracija iz istog izvora koji koristi /api/deploy-portfolio. Dostupnost ciljne adrese nije potvrđena.',
    address: deployment.produktionUrl, addressScope: 'external',
    source: { label: 'SPAJA Deploy registar', url: code('src/lib/deploy/deploy-registry.ts'), recordId: deployment.id },
    evidence: { url: code('public/deploy_status.json'), scope: 'Istorijski nepotvrđen zapis; oznaka success ne potvrđuje trenutno izvršavanje ili dostupnost.' },
    availability: null,
    // Allowlist only: no provider IDs, environment-variable names or deploy hook values.
    metadata: { 'Konfiguracioni status': deployment.status, 'Runtime (deklarisan)': deployment.framework,
      'Health adresa (nije proverena)': deployment.healthUrl ?? 'Nije navedena',
      'Ručno pokretanje (konfiguracija)': deployment.manualTriggerEnabled ? 'Omogućeno u konfiguraciji' : 'Isključeno u konfiguraciji',
      'Istorijski zapis': deployEvidence.historical_record.timestamp },
  })));
  entries.push({
    id: 'app:spaja-local-adapter', name: 'SPAJA lokalni Deploy adapter', kind: 'application', status: 'local',
    address: code('src/lib/deploy/local-deployment-adapter.ts'), addressScope: 'documentation',
    description: 'Provera integriteta, aktivacija i rollback ograničenog statičkog testnog artefakta.',
    source: { label: 'SPAJA Deploy adapter', url: code('src/lib/deploy/local-deployment-adapter.ts'), recordId: 'spaja-local' },
    evidence: { url: code('src/lib/deploy/deployment-provider.ts'), scope: 'Nema build workera niti pokretanja proizvoljnih Next.js aplikacija. Izvršavanje je podrazumevano isključeno.' },
    availability: null, metadata: { 'Obuhvat': deploymentProviders['spaja-local'].scope, 'Podrazumevano izvršavanje': deploymentProviders['spaja-local'].executionDefault },
  }, {
    id: 'app:spaja-sites', name: 'SPAJA Sites / SPAJA Deploy', kind: 'application', status: 'documented',
    address: 'https://spaja-deploy.able-mesa-4439.chatgpt.site/', addressScope: 'external',
    description: 'Adresa aplikacije koju je korisnik naveo za objedinjavanje.',
    source: { label: 'SPAJA Sites — navedena adresa', url: 'https://spaja-deploy.able-mesa-4439.chatgpt.site/', recordId: 'spaja-deploy-sites' },
    evidence: { url: 'https://spaja-deploy.able-mesa-4439.chatgpt.site/', scope: 'Samo referenca na aplikaciju. Funkcionalna integracija sa GitHub registrom i trenutna dostupnost nisu nezavisno potvrđene.' }, availability: null,
  }, {
    id: 'integration:sites-registry', name: 'SPAJA Sites ↔ GitHub registar', kind: 'integration', status: 'planned',
    address: 'https://spaja-deploy.able-mesa-4439.chatgpt.site/', addressScope: 'external',
    description: 'Planirana razmena javnih metapodataka između SPAJA Sites aplikacije i ovog registra.',
    source: { label: 'Predlog objedinjavanja', url: code('docs/MULTI-REPO-LINKS.md'), recordId: 'sites-registry' },
    evidence: { url: code('docs/MULTI-REPO-LINKS.md'), scope: 'Postojeća dokumentacija je osnov za budući ugovor, ne dokaz Sites integracije. Potrebni su ugovor, autorizacija i test razmene.' }, availability: null,
  }, {
    id: 'app:omega-pilot', name: OMEGA_SKELETON.title, kind: 'application', status: 'local',
    address: omegaDocs, addressScope: 'local-pilot', description: OMEGA_SKELETON.scope,
    source: { label: 'SPAJA MASTER OMEGA', url: code('src/lib/suoc-pilot/omega.ts'), recordId: OMEGA_SKELETON.version },
    evidence: { url: omegaDocs, scope: 'Zaseban lokalni SUOC pilot. /omega nije ruta glavne Next.js aplikacije. Link vodi na uputstvo.' }, availability: null,
    metadata: { 'Lokalna adresa': 'http://127.0.0.1:4318/omega (posle pokretanja pilota)',
      'Moduli u ovoj reviziji': String(OMEGA_SKELETON.modules.length), 'Opisane veze u ovoj reviziji': String(OMEGA_SKELETON.links.length),
      'Razvojni cilj, ne aktivne integracije': String(OMEGA_SKELETON.referenceConnectionTarget),
      'Zaseban predlog razvoja': `${repo}/pull/1365` },
  });
  entries.push(...OMEGA_SKELETON.modules.map((module): RegistryEntry => ({
    id: `omega:${module.id}`, name: module.title, kind: 'module', status: module.state,
    address: omegaDocs, addressScope: 'local-pilot', description: module.items.join(' · '),
    source: { label: 'SPAJA MASTER OMEGA moduli', url: code('src/lib/suoc-pilot/omega.ts'), recordId: module.id },
    evidence: { url: omegaDocs, scope: `Stanje u lokalnom katalogu: ${module.state}. Obuhvat je modul pilota; ne potvrđuje sve navedene servise ili operativnu integraciju.` }, availability: null,
    metadata: { 'Grupa': module.group },
  })));
  entries.push(...omegaItems.map((idea): RegistryEntry => ({
    id: `concept:${idea.id}`, name: `${idea.domain} — ${idea.title}`, kind: 'concept', status: 'concept',
    address: '/omegatrojektorijum', addressScope: 'application', description: idea.goal, conceptId: idea.id,
    source: { label: 'OMEGATROJEKTORIJUM ideje', url: code('src/lib/omegatrojektorijum/catalog.json'), recordId: idea.id },
    evidence: { url: code('src/lib/omegatrojektorijum/catalog.json'), scope: 'Konceptualna stavka. Prisustvo u katalogu nije implementacija; izvodljivost nije pojedinačno potvrđena.' }, availability: null,
  })));
  validateRegistry(entries);
  return entries;
}

export const portfolioContext = {
  kpiTargets: kpiSnapshot,
  historicalAt: deployEvidence.historical_record.timestamp,
  evidenceUrl: code('public/deploy_status.json'),
};
