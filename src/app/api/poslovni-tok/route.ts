import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
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
  const meta = getPoslovniTokMeta();
  const kpi = izracunajKpi(demoSlucajevi);
  const slaIzvestaji = demoSlucajevi.map((s) => izracunajSlaIzvestaj(s));

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

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Poslovni Tok — Unified Business Flow',
    verzija: APP_VERSION,
    meta,
    kpi,
    slaIzvestaji,
    slucajevi: slucajeviSaGateovom,
    timestamp: new Date().toISOString(),
  });
}
