import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getEnterpriseZahtevi } from '@/lib/kompanija-spaja-operativa';
import { ucitajEnterpriseUgovore } from '@/lib/enterprise-ugovor-modul';
import { getB2BProcurementCases, getMissingChecklist } from '@/lib/b2b-procurement-workflow';
import {
  demoSlucajevi,
  getPoslovniTokMeta,
  izracunajKpi,
  izracunajSlaIzvestaj,
  mozeTransicija,
  proveraDocumentGate,
  type PoslovniTokStatus,
} from '@/lib/poslovni-tok';

export async function GET() {
  const [enterpriseZahtevi, enterpriseUgovori, b2bSlucajevi] = await Promise.all([
    Promise.resolve(getEnterpriseZahtevi()),
    ucitajEnterpriseUgovore(),
    getB2BProcurementCases({ includeSensitive: false }),
  ]);

  const meta = getPoslovniTokMeta();
  const kpi = izracunajKpi(demoSlucajevi);
  const slaIzvestaji = demoSlucajevi.map((s) => izracunajSlaIzvestaj(s));
  const ugovoriMap = new Map(enterpriseUgovori.map((item) => [item.provider, item]));

  const slucajeviSaGateovom = demoSlucajevi.map((slucaj) => {
    const sledecaFaza = (() => {
      const redosled: PoslovniTokStatus[] = [
        'lead', 'kontaktiran', 'ponuda', 'ugovor', 'uplata', 'isporuka', 'zatvoreno',
      ];
      const idx = redosled.indexOf(slucaj.status);
      return idx >= 0 && idx < redosled.length - 1 ? redosled[idx + 1] : null;
    })();

    const documentGate = sledecaFaza
      ? proveraDocumentGate(slucaj.dokumentacija, sledecaFaza)
      : { ok: true, nedostaje: [] };

    const transicijaCheck = sledecaFaza
      ? mozeTransicija(slucaj, sledecaFaza)
      : { ok: true };

    return {
      id: slucaj.id,
      tip: slucaj.tip,
      naziv: slucaj.naziv,
      status: slucaj.status,
      prioritet: slucaj.prioritet,
      sledecaFaza,
      documentGate: {
        ok: documentGate.ok,
        nedostaje: documentGate.nedostaje,
      },
      tranzicijaOk: transicijaCheck.ok,
      tranzicijaRazlog: transicijaCheck.ok ? null : transicijaCheck.razlog,
      blockchain: slucaj.blockchain ? { txHash: slucaj.blockchain.txHash, mreza: slucaj.blockchain.mreza } : null,
      slaPrekoracenja: slucaj.slaFaze.filter((f) => f.prekoracen).length,
    };
  });

  const enterpriseEvidencija = enterpriseZahtevi.map((paket) => {
    const ugovor = ugovoriMap.get(paket.id);
    return {
      tip: 'enterprise' as const,
      id: paket.id,
      naziv: paket.provajder,
      statusRikvesta: paket.status,
      statusPoslovanja: ugovor?.status ?? 'pending',
      poslato: paket.status === 'poslato',
      proslo: (ugovor?.status ?? 'pending') === 'potpisano',
      kanal: paket.kanalPodnosenja.url,
    };
  });

  const lamborghiniEvidencija = b2bSlucajevi
    .filter((item) => /lamborghini|lamburgini/i.test(item.vozilo.marka))
    .map((item) => ({
      tip: 'b2b' as const,
      id: item.id,
      naziv: `${item.vozilo.marka} ${item.vozilo.model}`.trim(),
      statusRikvesta: item.status,
      statusPoslovanja: item.status,
      poslato: item.status !== 'upit',
      proslo: item.status === 'preuzeto',
      spremnoZaUplatu: getMissingChecklist(item).length === 0,
    }));

  const evidencija = [...enterpriseEvidencija, ...lamborghiniEvidencija];
  const ukupnoRikvestova = evidencija.length;
  const poslatoRikvestova = evidencija.filter((item) => item.poslato).length;
  const prosloRikvestova = evidencija.filter((item) => item.proslo).length;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Poslovni Tok — Unified Business Flow',
    verzija: APP_VERSION,
    meta,
    kpi,
    slaIzvestaji,
    slucajevi: slucajeviSaGateovom,
    licnaStatistika: {
      ukupnoRikvestova,
      poslatoRikvestova,
      prosloRikvestova,
      otvoreno: ukupnoRikvestova - prosloRikvestova,
      ukupnoPoslovanja: evidencija.length,
      prosloPoslovanja: prosloRikvestova,
    },
    evidencijaRikvestova: evidencija,
    timestamp: new Date().toISOString(),
  });
}
