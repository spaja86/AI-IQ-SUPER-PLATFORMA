/**
 * 💪 SNAGA
 *
 * Operativni modul za strukturnu čvrstinu, otpornost sistema i elastičnost
 * platforme pod opterećenjem.
 * Modeluje ciklus snage — izgradnju, ojačanje, testiranje i održavanje.
 */

export interface SnagaKomponenta {
  id: string;
  naziv: string;
  cvstoce: number;
  otpornost: number;
  elasticnost: number;
  izdrzljivost: number;
  status: 'cvrsto' | 'optimizacija' | 'slabo';
}

export interface SnagaRezultat {
  status: 'aktivan';
  indeksSnage: number;
  prosekCvrstoce: number;
  prosekOtpornosti: number;
  stabilnostSnage: number;
  efikasnostOtpornosti: number;
  komponente: SnagaKomponenta[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildSnaga(userId: string): SnagaRezultat {
  const komponente: Omit<SnagaKomponenta, 'status'>[] = [
    {
      id: 'sn-izgradnja',
      naziv: 'Izgradnja Temelja',
      cvstoce: 0.96,
      otpornost: 0.94,
      elasticnost: 0.88,
      izdrzljivost: 0.95,
    },
    {
      id: 'sn-ojacanje',
      naziv: 'Ojačanje Strukture',
      cvstoce: 0.91,
      otpornost: 0.89,
      elasticnost: 0.92,
      izdrzljivost: 0.90,
    },
    {
      id: 'sn-testiranje',
      naziv: 'Testiranje Opterećenja',
      cvstoce: 0.87,
      otpornost: 0.93,
      elasticnost: 0.90,
      izdrzljivost: 0.88,
    },
    {
      id: 'sn-odrzavanje',
      naziv: 'Održavanje Integriteta',
      cvstoce: 0.93,
      otpornost: 0.91,
      elasticnost: 0.86,
      izdrzljivost: 0.94,
    },
  ];

  const komponenteSaStatusom: SnagaKomponenta[] = komponente.map((k) => {
    const status: SnagaKomponenta['status'] =
      k.cvstoce < 0.65 || k.otpornost < 0.65
        ? 'slabo'
        : k.cvstoce < 0.82 || k.otpornost < 0.82
          ? 'optimizacija'
          : 'cvrsto';
    return { ...k, status };
  });

  const prosekCvrstoce = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.cvstoce, 0) / komponenteSaStatusom.length,
  );
  const prosekOtpornosti = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.otpornost, 0) / komponenteSaStatusom.length,
  );
  const prosekElasticnosti = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.elasticnost, 0) / komponenteSaStatusom.length,
  );

  const stabilnostSnage = clamp01(
    round4(prosekCvrstoce * 0.45 + prosekOtpornosti * 0.35 + prosekElasticnosti * 0.2),
  );
  const efikasnostOtpornosti = clamp01(round4(prosekOtpornosti * 0.55 + prosekCvrstoce * 0.45));
  const indeksSnage = clamp01(
    round4(stabilnostSnage * 0.45 + efikasnostOtpornosti * 0.35 + prosekCvrstoce * 0.2),
  );

  return {
    status: 'aktivan',
    indeksSnage,
    prosekCvrstoce,
    prosekOtpornosti,
    stabilnostSnage,
    efikasnostOtpornosti,
    komponente: komponenteSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
