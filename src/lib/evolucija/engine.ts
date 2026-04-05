/**
 * Omega Evolucioni Motor
 *
 * Motor koji pokreće autonomnu evoluciju platforme.
 * Integriše dijagnostiku, OMEGA AI persone, i matrično jezgro
 * da generiše preporuke za kontinuirano poboljšanje.
 *
 * Ciklus evolucije:
 * 1. Dijagnostika — pokreni sve provere
 * 2. Analiza — OMEGA AI persone analiziraju rezultate
 * 3. Preporuke — generisanje preporuka za poboljšanje
 * 4. Akcije — kreiranje GitHub Issues za svaku preporuku
 * 5. Praćenje — monitoring rezultata
 */

import { runDiagnostics } from '../auto-repair';
import { omegaPersone, getPersonePoOktavi } from '../omega-ai';
import type { OktavniNivo } from '../omega-ai';
import { createMatricnoJezgro, createSinhronizacija } from '../omega-ai-dispatch';
import type {
  EvolucijaCiklus,
  EvolucijaDijagnostika,
  EvolucijskaPreporuka,
  EvolucijskaIstorija,
  EvolucijskaKonfiguracija,
} from './types';

/** Podrazumevana konfiguracija evolucije */
export const podrazumevanaKonfiguracija: EvolucijskaKonfiguracija = {
  cronInterval: '0 */6 * * *',   // svakih 6 sati
  maxIssuePoDanu: 5,              // max 5 issue-a dnevno
  autoMerge: true,
  graneZaSinhronizaciju: ['main'],
  aktivnePersone: omegaPersone.filter((p) => p.aktivna).map((p) => p.id),
};

/**
 * Pokreće dijagnostički ciklus i generiše preporuke.
 */
export function pokeniEvolucijskuDijagnostiku(): EvolucijaDijagnostika {
  const izvestaj = runDiagnostics();

  // Generiši preporuke na osnovu dijagnostike
  const preporuke = generisiPreporuke(izvestaj.zdravlje);

  return {
    zdravlje: izvestaj.zdravlje,
    ukupnoProvera: izvestaj.ukupnoProvera,
    uspesnih: izvestaj.uspesnih,
    upozorenja: izvestaj.upozorenja,
    gresaka: izvestaj.gresaka,
    kriticnih: izvestaj.kriticnih,
    preporuke,
  };
}

/**
 * Generiši preporuke na osnovu zdravlja sistema.
 *
 * Svaka OMEGA AI persona generiše preporuke iz svog domena:
 * - Arhitekta → strukturalna poboljšanja
 * - Čuvar → bezbednosne zakrpe
 * - Lekar → popravke bagova
 * - Optimizator → performanse
 * - Evolver → nove funkcionalnosti
 * itd.
 */
function generisiPreporuke(zdravlje: number): EvolucijskaPreporuka[] {
  const preporuke: EvolucijskaPreporuka[] = [];
  const matrica = createMatricnoJezgro();
  const sync = createSinhronizacija();

  // Oktava 1 — Temelj: Arhitekta i Graditelj
  if (zdravlje < 100) {
    preporuke.push({
      id: 'prep-arhitektura-01',
      naslov: 'Optimizacija projektne arhitekture',
      opis: 'Analiza i poboljšanje strukture projekta za bolju modularnost i skalabilnost',
      tip: 'optimizacija',
      prioritet: zdravlje < 50 ? 'kritican' : 'srednji',
      persona: 'arhitekta',
      procenjeniNapor: 'umeren',
      githubIssueNaslov: '🏗️ [Omega Evolucija] Optimizacija projektne arhitekture',
      githubIssueTelo: `## Automatski generisano od OMEGA AI — Persona: Arhitekta 🏗️\n\n**Zdravlje sistema:** ${zdravlje}%\n\n### Opis\nOptimizovati projektnu arhitekturu za bolju modularnost.\n\n### Zadaci\n- [ ] Analiza trenutne strukture\n- [ ] Identifikacija poboljšanja\n- [ ] Implementacija promena\n- [ ] Verifikacija build-a\n\n### Matrično jezgro\n- Aktivnih veza: ${matrica.aktivnihVeza}/${matrica.ukupnoVeza}\n- Prosečna jačina: ${matrica.prosecnaJacina}\n\n---\n*Generisano automatski od Omega Evolucionog Motora*`,
    });
  }

  // Oktava 2 — Zaštita: Čuvar
  preporuke.push({
    id: 'prep-bezbednost-01',
    naslov: 'Bezbednosni audit i zakrpe',
    opis: 'Automatska provera zavisnosti za poznate ranjivosti i primena zakrpa',
    tip: 'bezbednost',
    prioritet: 'visok',
    persona: 'cuvar',
    procenjeniNapor: 'minimalan',
    githubIssueNaslov: '🛡️ [Omega Evolucija] Bezbednosni audit zavisnosti',
    githubIssueTelo: `## Automatski generisano od OMEGA AI — Persona: Čuvar 🛡️\n\n**Zdravlje sistema:** ${zdravlje}%\n\n### Opis\nPokrenuti npm audit i ažurirati zavisnosti sa poznatim ranjivostima.\n\n### Zadaci\n- [ ] Pokrenuti \`npm audit\`\n- [ ] Primeniti automatske zakrpe (\`npm audit fix\`)\n- [ ] Proveriti CSP i HSTS konfiguraciju\n- [ ] Verifikovati build posle zakrpa\n\n---\n*Generisano automatski od Omega Evolucionog Motora*`,
  });

  // Oktava 3 — Kvalitet: Tester
  preporuke.push({
    id: 'prep-testovi-01',
    naslov: 'Proširenje test pokrivenosti',
    opis: 'Dodavanje automatskih testova za ključne komponente i API rute',
    tip: 'nadogradnja',
    prioritet: 'visok',
    persona: 'tester',
    procenjeniNapor: 'znacajan',
    githubIssueNaslov: '🧪 [Omega Evolucija] Proširenje test pokrivenosti',
    githubIssueTelo: `## Automatski generisano od OMEGA AI — Persona: Tester 🧪\n\n**Zdravlje sistema:** ${zdravlje}%\n\n### Opis\nDodati automatske testove za API rute i komponente.\n\n### Zadaci\n- [ ] Konfigurisati test framework (Vitest)\n- [ ] Testovi za /api/health\n- [ ] Testovi za /api/status\n- [ ] Testovi za /api/auto-repair\n- [ ] Testovi za /api/omega-ai\n- [ ] Testovi za SekvencaRenderer\n- [ ] Testovi za auto-repair engine\n\n---\n*Generisano automatski od Omega Evolucionog Motora*`,
  });

  // Oktava 5 — Optimizacija: Optimizator
  preporuke.push({
    id: 'prep-performanse-01',
    naslov: 'Optimizacija performansi',
    opis: 'Poboljšanje Core Web Vitals, bundle size, i loading vremena',
    tip: 'optimizacija',
    prioritet: 'srednji',
    persona: 'optimizator',
    procenjeniNapor: 'umeren',
    githubIssueNaslov: '⚡ [Omega Evolucija] Optimizacija performansi',
    githubIssueTelo: `## Automatski generisano od OMEGA AI — Persona: Optimizator ⚡\n\n**Zdravlje sistema:** ${zdravlje}%\n\n### Opis\nOptimizovati performanse platforme.\n\n### Zadaci\n- [ ] Analiza bundle size\n- [ ] Lazy loading za teške komponente\n- [ ] Image optimization\n- [ ] Lighthouse audit\n\n### Sinhronizacija\n- Mod: ${sync.mod}\n- Status: ${sync.status}\n- Progres: ${sync.ukupniProgres}%\n\n---\n*Generisano automatski od Omega Evolucionog Motora*`,
  });

  // Oktava 8 — Evolucija: Evolver
  preporuke.push({
    id: 'prep-evolucija-01',
    naslov: 'Evolucija platforme — nova verzija',
    opis: 'Planiranje i implementacija sledećeg evolucijskog koraka platforme',
    tip: 'nova-funkcija',
    prioritet: 'srednji',
    persona: 'evolver',
    procenjeniNapor: 'znacajan',
    githubIssueNaslov: '🧬 [Omega Evolucija] Sledeći evolucijski korak',
    githubIssueTelo: `## Automatski generisano od OMEGA AI — Persona: Evolver 🧬\n\n**Zdravlje sistema:** ${zdravlje}%\n**Ukupno persona:** ${omegaPersone.length}\n\n### Opis\nPlanirati i implementirati sledeći evolucijski korak platforme.\n\n### Moguća poboljšanja\n- [ ] Novo stanje matričnog jezgra\n- [ ] Proširenje neurološke mreže\n- [ ] Nova OMEGA AI persona\n- [ ] Integracija sa eksternim servisima\n- [ ] Napredna analitika\n\n### Oktavni sistem\n${([1, 2, 3, 4, 5, 6, 7, 8] as const).map((n) => `- Oktava ${n}: ${getPersonePoOktavi(n as OktavniNivo).length} persona`).join('\n')}\n\n---\n*Generisano automatski od Omega Evolucionog Motora*`,
  });

  return preporuke;
}

/**
 * Kreira kompletan evolucioni ciklus.
 */
export function kreirajEvolucijskiCiklus(): EvolucijaCiklus {
  const dijagnostika = pokeniEvolucijskuDijagnostiku();
  const timestamp = new Date().toISOString();

  return {
    id: `ciklus-${Date.now()}`,
    pocetak: timestamp,
    zavrsetak: timestamp,
    status: 'zavrsen',
    dijagnostika,
    akcije: dijagnostika.preporuke.map((p) => ({
      id: `akcija-${p.id}`,
      preporukaId: p.id,
      tip: p.tip,
      status: 'kreirana' as const,
      timestamp,
    })),
    verzija: '6.6.0',
  };
}

/**
 * Vraća istoriju evolucije (stub — u produkciji koristi bazu).
 */
export function getEvolucijskaIstorija(): EvolucijskaIstorija {
  const ciklus = kreirajEvolucijskiCiklus();
  return {
    ciklusi: [ciklus],
    ukupnoCiklusa: 1,
    uspesnihCiklusa: 1,
    ukupnoAkcija: ciklus.akcije.length,
    uspesnihAkcija: ciklus.akcije.filter((a) => a.status === 'zavrsena').length,
    poslednjiCiklus: ciklus.pocetak,
    sledeciCiklus: izracunajSledeciCiklus(),
  };
}

/**
 * Izračunava vreme sledećeg zakazanog ciklusa.
 */
function izracunajSledeciCiklus(): string {
  const sada = new Date();
  // Sledeći ciklus za 6 sati
  sada.setHours(sada.getHours() + 6);
  sada.setMinutes(0, 0, 0);
  return sada.toISOString();
}

/**
 * Vraća konfiguracuju evolucije.
 */
export function getKonfiguracija(): EvolucijskaKonfiguracija {
  return { ...podrazumevanaKonfiguracija };
}
