import { PROKSI_KAPACITET, PROTOKOLI_VERZIJA } from '@/lib/constants';
import { omegaDispatchProtokoli } from '@/lib/vlasnicki-vip-plan';
import type { Protokol, ProtokolIzvor, ProtokolKategorija, ProtokolKriticnost, ProtokolOkruzenje } from './types';

const START_TIMESTAMP = '2026-01-01T00:00:00.000Z';

const SOURCE_PRIORITY: Record<ProtokolIzvor, number> = {
  'spaja-protokoli': 300,
  'autofinish-protokol-verifikacija': 200,
  'vlasnicki-vip-plan-dispatch-protokoli': 100,
};

function createProtocol(
  payload: Omit<Protokol, 'kreiran' | 'azuriran'> & { kreiran?: string; azuriran?: string },
): Protokol {
  return {
    ...payload,
    kreiran: payload.kreiran ?? START_TIMESTAMP,
    azuriran: payload.azuriran ?? START_TIMESTAMP,
  };
}

function createOwner(tim: string, kontakt: string, uloga: string) {
  return { tim, kontakt, uloga };
}

const SPAJA_PROTOKOLI: Protokol[] = [
  createProtocol({
    id: 'spaja-pmt',
    naziv: 'PMT (Proksi-Mobilna Transfer)',
    verzija: 'v2.0',
    kategorija: 'transfer',
    status: 'aktivan',
    opis: 'Transfer između proksi mreže i mobilnih centrala',
    kapacitet: PROKSI_KAPACITET,
    latency: '< 1ms',
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
    vlasnik: createOwner('Proksi Core', 'network-ops@spaja86.dev', 'mrežni operater'),
    kriticnost: 'kriticna',
    okruzenje: 'produkcija',
    zavisnosti: ['spaja-omsp', 'spaja-dmp'],
    slo: { latencyTargetMs: 1, availabilityTargetPct: 99.99, maxIncidentResponseMin: 5 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/spaja-protokoli/route.ts',
  }),
  createProtocol({
    id: 'spaja-omsp',
    naziv: 'OMSP (OMEGA Matricni Sinhronizacioni Protokol)',
    verzija: 'v3.0',
    kategorija: 'komunikacioni',
    status: 'aktivan',
    opis: 'Sinhronizacija OMEGA AI persona kroz MatrixSync',
    kapacitet: 'neograničen',
    latency: '< 0.1ms',
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
    vlasnik: createOwner('OMEGA AI Core', 'omega-core@spaja86.dev', 'platform owner'),
    kriticnost: 'kriticna',
    okruzenje: 'hibridno',
    zavisnosti: ['spaja-dmp'],
    slo: { latencyTargetMs: 1, availabilityTargetPct: 99.95, maxIncidentResponseMin: 10 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/spaja-protokoli/route.ts',
  }),
  createProtocol({
    id: 'spaja-stp',
    naziv: 'STP (Spaja Transfer Protokol)',
    verzija: 'v1.5',
    kategorija: 'transfer',
    status: 'aktivan',
    opis: 'Transfer podataka između SpajaPro verzija',
    kapacitet: '10¹⁰ TB/s',
    latency: '< 5ms',
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
    vlasnik: createOwner('SpajaPro Runtime', 'runtime@spaja86.dev', 'runtime maintainer'),
    kriticnost: 'visoka',
    okruzenje: 'produkcija',
    zavisnosti: ['spaja-pmt'],
    slo: { latencyTargetMs: 5, availabilityTargetPct: 99.9, maxIncidentResponseMin: 15 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/spaja-protokoli/route.ts',
  }),
  createProtocol({
    id: 'spaja-edp',
    naziv: 'EDP (Ekosistem Deploy Protokol)',
    verzija: 'v2.1',
    kategorija: 'operativni',
    status: 'aktivan',
    opis: 'Deploy i distribucija kroz GitHub proksi',
    kapacitet: '10⁵ deploya/min',
    latency: '< 10ms',
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
    vlasnik: createOwner('Release Engineering', 'release@spaja86.dev', 'release manager'),
    kriticnost: 'visoka',
    okruzenje: 'hibridno',
    zavisnosti: ['spaja-dmp'],
    slo: { latencyTargetMs: 10, availabilityTargetPct: 99.9, maxIncidentResponseMin: 20 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/spaja-protokoli/route.ts',
  }),
  createProtocol({
    id: 'spaja-dmp',
    naziv: 'DMP (Dijagnostički Monitoring Protokol)',
    verzija: 'v1.0',
    kategorija: 'operativni',
    status: 'aktivan',
    opis: 'Real-time monitoring zdravlja platforme',
    kapacitet: 'kontinualni stream',
    latency: '< 2ms',
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
    vlasnik: createOwner('Observability', 'observability@spaja86.dev', 'signal owner'),
    kriticnost: 'kriticna',
    okruzenje: 'hibridno',
    zavisnosti: [],
    slo: { latencyTargetMs: 2, availabilityTargetPct: 99.95, maxIncidentResponseMin: 10 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/spaja-protokoli/route.ts',
  }),
];

const AUTOFINISH_PROTOKOLI: Protokol[] = [
  createProtocol({
    id: 'autofinish-protocol-integrity',
    naziv: 'Protokol Integritet',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Verifikacija integriteta komunikacionih protokola u ekosistemu',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
    vlasnik: createOwner('Autofinish Security', 'autofinish@spaja86.dev', 'quality gate owner'),
    kriticnost: 'visoka',
    okruzenje: 'hibridno',
    zavisnosti: ['spaja-dmp', 'spaja-edp'],
    slo: { latencyTargetMs: 15, availabilityTargetPct: 99.9, maxIncidentResponseMin: 20 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/autofinish-protokol-verifikacija/route.ts',
  }),
  createProtocol({
    id: 'autofinish-encryption-validation',
    naziv: 'Enkripcija Validacija',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Provera ispravnosti enkripcije na svim protokolima',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
    vlasnik: createOwner('Autofinish Security', 'autofinish@spaja86.dev', 'security validator'),
    kriticnost: 'kriticna',
    okruzenje: 'produkcija',
    zavisnosti: ['autofinish-protocol-integrity'],
    slo: { latencyTargetMs: 15, availabilityTargetPct: 99.9, maxIncidentResponseMin: 15 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/autofinish-protokol-verifikacija/route.ts',
  }),
  createProtocol({
    id: 'autofinish-auth-protocol',
    naziv: 'Autentifikacija Protokol',
    verzija: 'v1.0',
    kategorija: 'autentifikacioni',
    status: 'aktivan',
    opis: 'Validacija autentifikacionih protokola i tokena',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
    vlasnik: createOwner('Identity & Access', 'iam@spaja86.dev', 'auth owner'),
    kriticnost: 'kriticna',
    okruzenje: 'produkcija',
    zavisnosti: ['autofinish-encryption-validation'],
    slo: { latencyTargetMs: 15, availabilityTargetPct: 99.95, maxIncidentResponseMin: 10 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/autofinish-protokol-verifikacija/route.ts',
  }),
  createProtocol({
    id: 'autofinish-transport-security',
    naziv: 'Transport Sigurnost',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Provera sigurnosti transportnog sloja komunikacije',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
    vlasnik: createOwner('Network Security', 'transport@spaja86.dev', 'transport guardian'),
    kriticnost: 'visoka',
    okruzenje: 'produkcija',
    zavisnosti: ['autofinish-protocol-integrity', 'spaja-pmt'],
    slo: { latencyTargetMs: 15, availabilityTargetPct: 99.9, maxIncidentResponseMin: 15 },
    sourceOfTruth: '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/autofinish-protokol-verifikacija/route.ts',
  }),
];

function resolveVipCategory(tip: string): ProtokolKategorija {
  if (tip === 'internet' || tip === 'mobilni' || tip === 'fiksni') return 'komunikacioni';
  if (tip === 'enterprise') return 'poslovni';
  if (tip === 'iot') return 'operativni';
  return 'transfer';
}

function resolveVipCriticality(tip: string): ProtokolKriticnost {
  if (tip === 'enterprise' || tip === 'internet') return 'visoka';
  if (tip === 'iot') return 'kriticna';
  return 'srednja';
}

function resolveVipEnvironment(tip: string): ProtokolOkruzenje {
  if (tip === 'enterprise' || tip === 'iot') return 'hibridno';
  return 'produkcija';
}

const VIP_DISPATCH_PROTOKOLI: Protokol[] = omegaDispatchProtokoli.protokoli.map((p) =>
  createProtocol({
    id: `vip-${p.id}`,
    naziv: p.naziv,
    verzija: 'v1.0',
    kategorija: resolveVipCategory(p.tip),
    status: 'aktivan',
    opis: p.opis,
    kapacitet: p.mogucnosti.join(', '),
    latency: p.tip === 'iot' ? '< 1ms' : '< 20ms',
    vlasnickiModul: 'vlasnicki-vip-plan-dispatch-protokoli',
    izvor: 'vlasnicki-vip-plan-dispatch-protokoli',
    vlasnik: createOwner('VIP Dispatch', 'dispatch@spaja86.dev', 'service owner'),
    kriticnost: resolveVipCriticality(p.tip),
    okruzenje: resolveVipEnvironment(p.tip),
    zavisnosti: ['spaja-edp', 'spaja-omsp'],
    slo: {
      latencyTargetMs: p.tip === 'iot' ? 1 : 20,
      availabilityTargetPct: p.tip === 'enterprise' ? 99.95 : 99.5,
      maxIncidentResponseMin: p.tip === 'enterprise' ? 15 : 30,
    },
    sourceOfTruth:
      '/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/src/app/api/vlasnicki-vip-plan-dispatch-protokoli/route.ts',
  }),
);

const PROTOKOLI_SOURCE_GROUPS: Record<ProtokolIzvor, Protokol[]> = {
  'spaja-protokoli': SPAJA_PROTOKOLI,
  'autofinish-protokol-verifikacija': AUTOFINISH_PROTOKOLI,
  'vlasnicki-vip-plan-dispatch-protokoli': VIP_DISPATCH_PROTOKOLI,
};

function buildCatalog(groups: Record<ProtokolIzvor, Protokol[]>): Protokol[] {
  const registry = new Map<string, Protokol>();
  const entries = Object.entries(groups) as Array<[ProtokolIzvor, Protokol[]]>;

  for (const [izvor, protokoli] of entries) {
    for (const protokol of protokoli) {
      const existing = registry.get(protokol.id);
      if (!existing || SOURCE_PRIORITY[izvor] >= SOURCE_PRIORITY[existing.izvor]) {
        registry.set(protokol.id, { ...protokol, izvor });
      }
    }
  }

  return [...registry.values()].sort((a, b) => {
    const sourceDiff = SOURCE_PRIORITY[b.izvor] - SOURCE_PRIORITY[a.izvor];
    if (sourceDiff !== 0) return sourceDiff;
    return a.naziv.localeCompare(b.naziv, 'sr');
  });
}

const PROTOKOLI_REGISTAR: Protokol[] = buildCatalog(PROTOKOLI_SOURCE_GROUPS);

export function getProtokolRegistar(): Protokol[] {
  return PROTOKOLI_REGISTAR.map((p) => ({ ...p, zavisnosti: [...p.zavisnosti], slo: { ...p.slo }, vlasnik: { ...p.vlasnik } }));
}

export function findProtokolById(id: string): Protokol | undefined {
  const protokol = PROTOKOLI_REGISTAR.find((p) => p.id === id);
  return protokol
    ? { ...protokol, zavisnosti: [...protokol.zavisnosti], slo: { ...protokol.slo }, vlasnik: { ...protokol.vlasnik } }
    : undefined;
}

export function getProtokolRegistarMeta() {
  return {
    verzija: PROTOKOLI_VERZIJA,
    ukupnoProtokola: PROTOKOLI_REGISTAR.length,
    operationalModel: 'operativni-kontrolni-centar',
    sourcePriority: SOURCE_PRIORITY,
    dedupeStrategy: 'id+source-priority',
    persistence: {
      registry: 'code-defined',
      statusOverrides: 'runtime-memory',
      verificationSnapshots: 'runtime-memory',
      auditLog: 'runtime-memory + optional supabase mirror',
    },
  };
}
