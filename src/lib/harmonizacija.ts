/**
 * 🎵 HARMONIZACIJA
 *
 * Operativni modul za harmonizaciju procesnih slojeva, sinhronizaciju
 * sistemskih komponenti i optimizaciju protoka podataka.
 * Modeluje harmonizacijske cikluse — inicijalizaciju, sinhronizaciju,
 * kalibraciju i konsolidaciju.
 */

export interface HarmonizacijaSloj {
  id: string;
  naziv: string;
  frekvencija: number;
  amplituda: number;
  sinhronizacija: number;
  kalibracija: number;
  status: 'harmonicno' | 'kalibracija' | 'disharmonija';
}

export interface HarmonizacijaRezultat {
  status: 'aktivan';
  indeksHarmonije: number;
  prosekSinhronizacije: number;
  prosekKalibracije: number;
  rezonancija: number;
  stabilnost: number;
  slojevi: HarmonizacijaSloj[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildHarmonizacija(userId: string): HarmonizacijaRezultat {
  const slojevi: Omit<HarmonizacijaSloj, 'status'>[] = [
    {
      id: 'hz-inicijalizacija',
      naziv: 'Inicijalizacija Sloj',
      frekvencija: 440,
      amplituda: 0.88,
      sinhronizacija: 0.92,
      kalibracija: 0.85,
    },
    {
      id: 'hz-sinhronizacija',
      naziv: 'Sinhronizacija Sloj',
      frekvencija: 880,
      amplituda: 0.79,
      sinhronizacija: 0.96,
      kalibracija: 0.81,
    },
    {
      id: 'hz-kalibracija',
      naziv: 'Kalibracija Sloj',
      frekvencija: 528,
      amplituda: 0.83,
      sinhronizacija: 0.78,
      kalibracija: 0.94,
    },
    {
      id: 'hz-konsolidacija',
      naziv: 'Konsolidacija Sloj',
      frekvencija: 396,
      amplituda: 0.91,
      sinhronizacija: 0.87,
      kalibracija: 0.89,
    },
  ];

  const slojeviSaStatusom: HarmonizacijaSloj[] = slojevi.map((sloj) => {
    const status: HarmonizacijaSloj['status'] =
      sloj.sinhronizacija < 0.5 || sloj.kalibracija < 0.5
        ? 'disharmonija'
        : sloj.sinhronizacija < 0.75 || sloj.kalibracija < 0.75
          ? 'kalibracija'
          : 'harmonicno';
    return { ...sloj, status };
  });

  const prosekSinhronizacije = round4(
    slojeviSaStatusom.reduce((sum, s) => sum + s.sinhronizacija, 0) / slojeviSaStatusom.length,
  );
  const prosekKalibracije = round4(
    slojeviSaStatusom.reduce((sum, s) => sum + s.kalibracija, 0) / slojeviSaStatusom.length,
  );
  const prosekAmplitude = round4(
    slojeviSaStatusom.reduce((sum, s) => sum + s.amplituda, 0) / slojeviSaStatusom.length,
  );

  const stabilnost = clamp01(
    round4(prosekSinhronizacije * 0.45 + prosekKalibracije * 0.35 + prosekAmplitude * 0.2),
  );
  const rezonancija = clamp01(round4(stabilnost * 0.6 + prosekSinhronizacije * 0.4));
  const indeksHarmonije = clamp01(
    round4(stabilnost * 0.4 + rezonancija * 0.35 + prosekKalibracije * 0.25),
  );

  return {
    status: 'aktivan',
    indeksHarmonije,
    prosekSinhronizacije,
    prosekKalibracije,
    rezonancija,
    stabilnost,
    slojevi: slojeviSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
