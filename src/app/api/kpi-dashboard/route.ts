import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { demoSlucajevi, izracunajKpi, getPoslovniTokMeta } from '@/lib/poslovni-tok';

export async function GET() {
  const kpi = izracunajKpi(demoSlucajevi);
  const meta = getPoslovniTokMeta();

  const targetKpi = {
    stopaZatvaranja: 95,
    procenatKompletnihDokumenata: 100,
    procenatBlockchainTraga: 80,
    slaPrekoracenjaMax: 0,
  };

  const kpiOcenaNivo =
    kpi.kpiOcena >= 90 ? 'odlicno' :
    kpi.kpiOcena >= 75 ? 'dobro' :
    kpi.kpiOcena >= 50 ? 'zadovoljavajuce' : 'zahteva_pažnju';

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'KPI Dashboard — 100% Uspešno Poslovanje',
    verzija: APP_VERSION,
    meta: {
      kpiKomponente: meta.kpiKomponente,
      canonicalLifecycle: meta.canonicalLifecycle,
    },
    kpi,
    kpiOcenaNivo,
    targetKpi,
    statusVs100: {
      stopaZatvaranja: {
        trenutna: `${kpi.stopaZatvaranja}%`,
        cilj: `${targetKpi.stopaZatvaranja}%`,
        razlika: kpi.stopaZatvaranja - targetKpi.stopaZatvaranja,
        ok: kpi.stopaZatvaranja >= targetKpi.stopaZatvaranja,
      },
      kompletnaDoc: {
        trenutna: `${kpi.procenatKompletnihDokumenata}%`,
        cilj: `${targetKpi.procenatKompletnihDokumenata}%`,
        razlika: kpi.procenatKompletnihDokumenata - targetKpi.procenatKompletnihDokumenata,
        ok: kpi.procenatKompletnihDokumenata >= targetKpi.procenatKompletnihDokumenata,
      },
      blockchainTrag: {
        trenutna: `${kpi.procenatBlockchainTraga}%`,
        cilj: `${targetKpi.procenatBlockchainTraga}%`,
        razlika: kpi.procenatBlockchainTraga - targetKpi.procenatBlockchainTraga,
        ok: kpi.procenatBlockchainTraga >= targetKpi.procenatBlockchainTraga,
      },
      sla: {
        prekoracenih: kpi.slaPrekoracenih,
        cilj: targetKpi.slaPrekoracenjaMax,
        ok: kpi.slaPrekoracenih <= targetKpi.slaPrekoracenjaMax,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
