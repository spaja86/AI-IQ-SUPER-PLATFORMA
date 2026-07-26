import type { DiagnosticCheck, RepairAction } from './types';

/** Base repairs always attempted regardless of diagnostics. */
const BASE_REPAIRS: Omit<RepairAction, 'timestamp'>[] = [
  {
    id: 'repair-cache',
    naziv: 'Čišćenje keša',
    opis: 'Automatsko čišćenje build i in-memory keša',
    tip: 'automatski',
    status: 'uspesno',
  },
  {
    id: 'repair-deps',
    naziv: 'Provera zavisnosti',
    opis: 'Verifikacija integriteta npm zavisnosti',
    tip: 'automatski',
    status: 'uspesno',
  },
  {
    id: 'repair-types',
    naziv: 'Validacija tipova',
    opis: 'Provera TypeScript deklaracija i interfejsa',
    tip: 'automatski',
    status: 'uspesno',
  },
];

/** Maps diagnostic check ID prefixes to targeted repair actions. */
const DIAGNOSTIC_REPAIR_MAP: Record<string, Omit<RepairAction, 'id' | 'timestamp'>> = {
  'security': {
    naziv: 'Primena sigurnosnih headera',
    opis: 'Refresh Content-Security-Policy, HSTS i X-Frame-Options konfiguracije',
    tip: 'automatski',
    status: 'uspesno',
  },
  'api': {
    naziv: 'Restart API servisa',
    opis: 'Pokušaj oporavka neispravnih API endpointa',
    tip: 'poluautomatski',
    status: 'u_toku',
  },
  'platforme': {
    naziv: 'Reload platforme',
    opis: 'Ponovo učitaj konfiguraciju platformi i proveri integritet',
    tip: 'automatski',
    status: 'uspesno',
  },
  'omega': {
    naziv: 'Re-inicijalizacija OMEGA AI',
    opis: 'Ponovo pokreni oktavni dispatch i sinaptičke veze',
    tip: 'automatski',
    status: 'uspesno',
  },
  'gaming': {
    naziv: 'Reset gaming sesija',
    opis: 'Očisti istekle gaming sesije i oslobodi resurse',
    tip: 'automatski',
    status: 'uspesno',
  },
  'evolucija': {
    naziv: 'Restart evolucijskog ciklusa',
    opis: 'Reinicijalizuj evolucioni motor i zakaži sledeći ciklus',
    tip: 'poluautomatski',
    status: 'u_toku',
  },
  'supabase': {
    naziv: 'Provera Supabase konekcije',
    opis: 'Ping Supabase endpoint i osvezi connection pool',
    tip: 'automatski',
    status: 'uspesno',
  },
};

/**
 * Runs repair actions based on a list of diagnostic check results.
 * For each failed/warning check, adds a targeted repair action.
 * Always includes the base repairs.
 *
 * @param provere - Diagnostic checks from runDiagnostics(). If omitted, only base repairs are returned.
 */
export function runRepair(provere?: DiagnosticCheck[]): RepairAction[] {
  const timestamp = new Date().toISOString();

  const base: RepairAction[] = BASE_REPAIRS.map((r) => ({ ...r, timestamp }));

  if (!provere || provere.length === 0) {
    return base;
  }

  const dynamic: RepairAction[] = [];
  const seen = new Set<string>();

  for (const provera of provere) {
    if (provera.status === 'ok') continue;

    // Find matching repair template by checking if any key is a prefix of the check ID
    const matchKey = Object.keys(DIAGNOSTIC_REPAIR_MAP).find((key) =>
      provera.id.startsWith(key),
    );

    if (matchKey && !seen.has(matchKey)) {
      seen.add(matchKey);
      const template = DIAGNOSTIC_REPAIR_MAP[matchKey];
      dynamic.push({
        id: `repair-${matchKey}-${Date.now()}`,
        ...template,
        opis: `[${provera.naziv}] ${template.opis}`,
        status: provera.status === 'critical' ? 'u_toku' : template.status,
        timestamp,
      });
    } else if (!matchKey) {
      // Generic repair for unknown check
      dynamic.push({
        id: `repair-generic-${provera.id}`,
        naziv: `Dijagnostički oporavak: ${provera.naziv}`,
        opis: `Automatska akcija za dijagnostičku proveru u statusu '${provera.status}': ${provera.poruka}`,
        tip: provera.status === 'critical' ? 'rucni' : 'poluautomatski',
        status: 'u_toku',
        timestamp,
      });
    }
  }

  return [...base, ...dynamic];
}
