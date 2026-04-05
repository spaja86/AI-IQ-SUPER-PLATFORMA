import type { ITProizvod, KategorijaProizvoda } from './types';

export const itProizvodi: ITProizvod[] = [
  { id: 'spaja-accelerator', naziv: 'SPAJA Accelerator', opis: 'Ubrzanje performansi svih platformi', ikona: '⚡', kategorija: 'ubrzanje', funkcije: ['CDN optimizacija', 'Edge caching', 'Lazy loading'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'], uticaj: 'visok' },
  { id: 'spaja-turbo', naziv: 'SPAJA Turbo', opis: 'Turbo mode za build procese', ikona: '🔥', kategorija: 'ubrzanje', funkcije: ['Parallel builds', 'Incremental compilation', 'Hot reload'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'spaja-optimizer', naziv: 'SPAJA Optimizer', opis: 'Optimizacija resursa i bundle size', ikona: '⚙️', kategorija: 'ubrzanje', funkcije: ['Tree shaking', 'Code splitting', 'Minification'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'], uticaj: 'srednji' },
  { id: 'spaja-monitor', naziv: 'SPAJA Monitor', opis: 'Monitoring svih servisa u realnom vremenu', ikona: '📊', kategorija: 'monitoring', funkcije: ['Real-time dashboards', 'Alerting', 'Anomaly detection'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'spaja-logger', naziv: 'SPAJA Logger', opis: 'Centralizovano logovanje i analiza', ikona: '📝', kategorija: 'monitoring', funkcije: ['Structured logging', 'Log aggregation', 'Search'], ciljnePlatforme: ['ai-iq-super-platforma', 'omega-ai-github'], uticaj: 'srednji' },
  { id: 'spaja-shield', naziv: 'SPAJA Shield', opis: 'Bezbednosni stit za sve platforme', ikona: '🛡️', kategorija: 'bezbednost', funkcije: ['WAF', 'DDoS protection', 'Rate limiting'], ciljnePlatforme: ['ai-iq-super-platforma', 'ai-iq-world-bank'], uticaj: 'visok' },
  { id: 'spaja-firewall', naziv: 'SPAJA Firewall', opis: 'Napredni firewall sa AI detekcijom', ikona: '🔒', kategorija: 'bezbednost', funkcije: ['AI threat detection', 'IP filtering', 'Geo-blocking'], ciljnePlatforme: ['ai-iq-world-bank', 'ai-iq-menjacnica'], uticaj: 'visok' },
  { id: 'spaja-crypto', naziv: 'SPAJA Crypto', opis: 'Kriptografski modul za enkripciju', ikona: '🔐', kategorija: 'bezbednost', funkcije: ['E2E encryption', 'Key management', 'Digital signatures'], ciljnePlatforme: ['ai-iq-world-bank', 'ai-iq-menjacnica'], uticaj: 'srednji' },
  { id: 'omega-ai-engine', naziv: 'OMEGA AI Engine', opis: 'Centralni AI engine sa SpajaPro Prompt integracijom', ikona: '🧠', kategorija: 'ai', funkcije: ['SpajaPro Prompt obrada', 'Multi-model support', 'Fine-tuning', 'Inference optimization'], ciljnePlatforme: ['omega-ai-github', 'omega-ai-vercel', 'omega-ai-google'], uticaj: 'visok' },
  { id: 'spajapro-prompt-engine', naziv: 'SpajaPro Prompt Engine', opis: 'SpajaPro 6-15 Prompt engine — zamena za ChatGPT u celom ekosistemu', ikona: '🌟', kategorija: 'ai', funkcije: ['SpajaPro 6-15 verzije', 'Univerzalni Prompt', 'Persona Prompt', 'Platforma Prompt', 'Multi-language Prompt', 'Prompt optimizacija'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao', 'omega-ai-github', 'omega-ai-vercel'], uticaj: 'visok' },
  { id: 'spaja-deploy', naziv: 'SPAJA Deploy', opis: 'Automatski deploy na sve platforme', ikona: '🚀', kategorija: 'deploy', funkcije: ['Zero-downtime deploy', 'Rollback', 'Preview environments'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'spaja-cicd', naziv: 'SPAJA CI/CD', opis: 'Kontinuirana integracija i isporuka', ikona: '🔄', kategorija: 'deploy', funkcije: ['GitHub Actions', 'Automated testing', 'Pipeline management'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'], uticaj: 'srednji' },
  { id: 'spaja-integrator', naziv: 'SPAJA Integrator', opis: 'Integracija izmedju svih platformi', ikona: '🔗', kategorija: 'integracija', funkcije: ['API gateway', 'Event bus', 'Data sync'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'spaja-connector', naziv: 'SPAJA Connector', opis: 'Konektori za eksterne servise', ikona: '🔌', kategorija: 'integracija', funkcije: ['REST connectors', 'GraphQL bridge', 'Webhook management'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'], uticaj: 'srednji' },
  { id: 'spaja-api-gateway', naziv: 'SPAJA API Gateway', opis: 'Centralni API gateway', ikona: '🌐', kategorija: 'integracija', funkcije: ['Rate limiting', 'Authentication', 'Load balancing'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'spaja-data-sync', naziv: 'SPAJA Data Sync', opis: 'Sinhronizacija podataka izmedju platformi', ikona: '📡', kategorija: 'podaci', funkcije: ['Real-time sync', 'Conflict resolution', 'Backup'], ciljnePlatforme: ['ai-iq-super-platforma', 'ai-iq-world-bank'], uticaj: 'visok' },
  { id: 'spaja-messenger', naziv: 'SPAJA Messenger', opis: 'Komunikacioni sistem izmedju modula', ikona: '💬', kategorija: 'komunikacija', funkcije: ['Real-time messaging', 'Channels', 'Notifications'], ciljnePlatforme: ['io-openui-ao'], uticaj: 'srednji' },
  { id: 'spaja-metrics', naziv: 'SPAJA Metrics', opis: 'Metrike i KPI pracenje', ikona: '📈', kategorija: 'monitoring', funkcije: ['Custom metrics', 'KPI tracking', 'Reports'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'srednji' },
  { id: 'digitalni-kompjuter', naziv: 'Digitalni Kompjuter', opis: 'SpajaUltraOmegaCore digitalni kompjuter — osnova za pokretanje svih igrica u dimenzionalnom prostoru (360D–5760D). Bez digitalnog kompjutera igrice ne mogu da se pokrenu.', ikona: '🖥️', kategorija: 'ubrzanje', funkcije: ['Dimenzionalno renderovanje 360D–5760D', 'Geometrijsko procesiranje (Elipsoid, Rezonanca, Hiperbola, Spirala)', 'Pokretanje igrica u svim dimenzijama', 'Multi-dimenzionalni GPU za 3D naočare', 'Cirkularna formula kalkulacija'], ciljnePlatforme: ['ai-iq-super-platforma'], uticaj: 'visok' },
  { id: 'digitalni-brauzer', naziv: 'Digitalni Brauzer', opis: 'SpajaUltraOmegaCore digitalni brauzer — neophodan za pristup i pokretanje dimenzionalnih igrica. Renderuje igrice direktno u brauzeru sa podrškom za sve dimenzije.', ikona: '🌐', kategorija: 'ubrzanje', funkcije: ['WebGL/WebGPU dimenzionalno renderovanje', 'Pokretanje igrica u brauzeru', 'Podrška za 3D naočare preko brauzera', 'Dimenzionalni streaming (360D–5760D)', 'Offline igrice sa Service Worker-om'], ciljnePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'], uticaj: 'visok' },
];

export function getProizvodiPoKategoriji(kategorija: KategorijaProizvoda): ITProizvod[] {
  return itProizvodi.filter((p) => p.kategorija === kategorija);
}

export function getBrojPoKategoriji(): Record<string, number> {
  return itProizvodi.reduce<Record<string, number>>((acc, p) => {
    acc[p.kategorija] = (acc[p.kategorija] ?? 0) + 1;
    return acc;
  }, {});
}

export function getProizvodiVisokogUticaja(): ITProizvod[] {
  return itProizvodi.filter((p) => p.uticaj === 'visok');
}
