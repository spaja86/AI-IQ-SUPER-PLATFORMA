/**
 * 🔬 SINTETIZACIJA
 *
 * Operativni modul za sintezu i integraciju procesnih entiteta
 * u koherentne strukture. Modeluje ciklus sinteze — prikupljanje,
 * spajanje, validaciju i emisiju sintetizovanih rezultata.
 */

export interface SintetizacijaKomponenta {
  id: string;
  naziv: string;
  ulazniSignali: number;
  stepen: number;
  koherentnost: number;
  integritet: number;
  status: 'aktivan' | 'sinhronizacija' | 'neaktivan';
}

export interface SintetizacijaRezultat {
  status: 'aktivan';
  indeksSinteze: number;
  prosekStepenaSinteze: number;
  prosekIntegriteta: number;
  stabilnostSinteze: number;
  efikasnostIntegracije: number;
  komponente: SintetizacijaKomponenta[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildSintetizacija(userId: string): SintetizacijaRezultat {
  const komponente: Omit<SintetizacijaKomponenta, 'status'>[] = [
    {
      id: 'sn-prikupljanje',
      naziv: 'Prikupljanje Signala',
      ulazniSignali: 16,
      stepen: 0.91,
      koherentnost: 0.88,
      integritet: 0.94,
    },
    {
      id: 'sn-spajanje',
      naziv: 'Spajanje Entiteta',
      ulazniSignali: 12,
      stepen: 0.86,
      koherentnost: 0.92,
      integritet: 0.89,
    },
    {
      id: 'sn-validacija',
      naziv: 'Validacija Strukture',
      ulazniSignali: 8,
      stepen: 0.95,
      koherentnost: 0.87,
      integritet: 0.96,
    },
    {
      id: 'sn-emisija',
      naziv: 'Emisija Rezultata',
      ulazniSignali: 4,
      stepen: 0.89,
      koherentnost: 0.93,
      integritet: 0.91,
    },
  ];

  const komponenteSaStatusom: SintetizacijaKomponenta[] = komponente.map((k) => {
    const status: SintetizacijaKomponenta['status'] =
      k.stepen < 0.6 || k.integritet < 0.6
        ? 'neaktivan'
        : k.stepen < 0.8 || k.integritet < 0.8
          ? 'sinhronizacija'
          : 'aktivan';

    return { ...k, status };
  });

  const prosekStepenaSinteze = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.stepen, 0) / komponenteSaStatusom.length,
  );
  const prosekIntegriteta = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.integritet, 0) / komponenteSaStatusom.length,
  );
  const prosekKoherentnosti = round4(
    komponenteSaStatusom.reduce((sum, k) => sum + k.koherentnost, 0) / komponenteSaStatusom.length,
  );

  const stabilnostSinteze = clamp01(
    round4(prosekKoherentnosti * 0.5 + prosekIntegriteta * 0.35 + prosekStepenaSinteze * 0.15),
  );
  const efikasnostIntegracije = clamp01(round4(prosekStepenaSinteze * 0.55 + prosekIntegriteta * 0.45));
  const indeksSinteze = clamp01(
    round4(stabilnostSinteze * 0.45 + efikasnostIntegracije * 0.35 + prosekKoherentnosti * 0.2),
  );

  return {
    status: 'aktivan',
    indeksSinteze,
    prosekStepenaSinteze,
    prosekIntegriteta,
    stabilnostSinteze,
    efikasnostIntegracije,
    komponente: komponenteSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
