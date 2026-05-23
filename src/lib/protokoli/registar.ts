import { PROKSI_KAPACITET, PROTOKOLI_VERZIJA } from '@/lib/constants';
import { omegaDispatchProtokoli } from '@/lib/vlasnicki-vip-plan';
import type { Protokol } from './types';

const START_TIMESTAMP = '2026-01-01T00:00:00.000Z';

const SPAJA_PROTOKOLI: Protokol[] = [
  {
    id: 'spaja-pmt',
    naziv: 'PMT (Proksi-Mobilna Transfer)',
    verzija: 'v2.0',
    kategorija: 'transfer',
    status: 'aktivan',
    opis: 'Transfer između proksi mreže i mobilnih centrala',
    kapacitet: PROKSI_KAPACITET,
    latency: '< 1ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
  },
  {
    id: 'spaja-omsp',
    naziv: 'OMSP (OMEGA Matricni Sinhronizacioni Protokol)',
    verzija: 'v3.0',
    kategorija: 'komunikacioni',
    status: 'aktivan',
    opis: 'Sinhronizacija OMEGA AI persona kroz MatrixSync',
    kapacitet: 'neograničen',
    latency: '< 0.1ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
  },
  {
    id: 'spaja-stp',
    naziv: 'STP (Spaja Transfer Protokol)',
    verzija: 'v1.5',
    kategorija: 'transfer',
    status: 'aktivan',
    opis: 'Transfer podataka između SpajaPro verzija',
    kapacitet: '10¹⁰ TB/s',
    latency: '< 5ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
  },
  {
    id: 'spaja-edp',
    naziv: 'EDP (Ekosistem Deploy Protokol)',
    verzija: 'v2.1',
    kategorija: 'operativni',
    status: 'aktivan',
    opis: 'Deploy i distribucija kroz GitHub proksi',
    kapacitet: '10⁵ deploya/min',
    latency: '< 10ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
  },
  {
    id: 'spaja-dmp',
    naziv: 'DMP (Dijagnostički Monitoring Protokol)',
    verzija: 'v1.0',
    kategorija: 'operativni',
    status: 'aktivan',
    opis: 'Real-time monitoring zdravlja platforme',
    kapacitet: 'kontinualni stream',
    latency: '< 2ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'spaja-protokoli',
    izvor: 'spaja-protokoli',
  },
];

const AUTOFINISH_PROTOKOLI: Protokol[] = [
  {
    id: 'autofinish-protocol-integrity',
    naziv: 'Protokol Integritet',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Verifikacija integriteta komunikacionih protokola u ekosistemu',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
  },
  {
    id: 'autofinish-encryption-validation',
    naziv: 'Enkripcija Validacija',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Provera ispravnosti enkripcije na svim protokolima',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
  },
  {
    id: 'autofinish-auth-protocol',
    naziv: 'Autentifikacija Protokol',
    verzija: 'v1.0',
    kategorija: 'autentifikacioni',
    status: 'aktivan',
    opis: 'Validacija autentifikacionih protokola i tokena',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
  },
  {
    id: 'autofinish-transport-security',
    naziv: 'Transport Sigurnost',
    verzija: 'v1.0',
    kategorija: 'bezbednosni',
    status: 'aktivan',
    opis: 'Provera sigurnosti transportnog sloja komunikacije',
    kapacitet: 'kontinualna provera',
    latency: '< 15ms',
    kreiran: START_TIMESTAMP,
    azuriran: START_TIMESTAMP,
    vlasnickiModul: 'autofinish-protokol-verifikacija',
    izvor: 'autofinish-protokol-verifikacija',
  },
];

const VIP_DISPATCH_PROTOKOLI: Protokol[] = omegaDispatchProtokoli.protokoli.map((p) => ({
  id: `vip-${p.id}`,
  naziv: p.naziv,
  verzija: 'v1.0',
  kategorija:
    p.tip === 'internet' || p.tip === 'mobilni' || p.tip === 'fiksni'
      ? 'komunikacioni'
      : p.tip === 'enterprise'
        ? 'poslovni'
        : 'operativni',
  status: 'aktivan',
  opis: p.opis,
  kapacitet: p.mogucnosti.join(', '),
  latency: p.tip === 'iot' ? '< 1ms' : '< 20ms',
  kreiran: START_TIMESTAMP,
  azuriran: START_TIMESTAMP,
  vlasnickiModul: 'vlasnicki-vip-plan-dispatch-protokoli',
  izvor: 'vlasnicki-vip-plan-dispatch-protokoli',
}));

const PROTOKOLI_REGISTAR: Protokol[] = [
  ...SPAJA_PROTOKOLI,
  ...AUTOFINISH_PROTOKOLI,
  ...VIP_DISPATCH_PROTOKOLI,
];

export function getProtokolRegistar(): Protokol[] {
  return PROTOKOLI_REGISTAR.map((p) => ({ ...p }));
}

export function findProtokolById(id: string): Protokol | undefined {
  return PROTOKOLI_REGISTAR.find((p) => p.id === id);
}

export function getProtokolRegistarMeta() {
  return {
    verzija: PROTOKOLI_VERZIJA,
    ukupnoProtokola: PROTOKOLI_REGISTAR.length,
  };
}
