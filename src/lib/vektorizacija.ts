/**
 * 📐 VEKTORIZACIJA
 *
 * Operativni modul za vektorizaciju procesnih tokova, transformaciju
 * signalnih prostora i projekciju multi-dimenzionalnih entiteta.
 * Modeluje ciklus vektorizacije — inicijalizaciju, transformaciju,
 * normalizaciju i projekciju izlaznih vektora.
 */

export interface VektorizacijaVektor {
  id: string;
  naziv: string;
  dimenzije: number;
  magnituda: number;
  normalizacija: number;
  koherentnost: number;
  status: 'aktivan' | 'optimizacija' | 'neaktivan';
}

export interface VektorizacijaRezultat {
  status: 'aktivan';
  indeksVektorizacije: number;
  prosekMagnitude: number;
  prosekKoherentnosti: number;
  stabilnostProstora: number;
  efikasnostTransformacije: number;
  vektori: VektorizacijaVektor[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildVektorizacija(userId: string): VektorizacijaRezultat {
  const vektori: Omit<VektorizacijaVektor, 'status'>[] = [
    {
      id: 'vk-inicijalizacija',
      naziv: 'Inicijalizacija Prostora',
      dimenzije: 512,
      magnituda: 0.92,
      normalizacija: 0.95,
      koherentnost: 0.89,
    },
    {
      id: 'vk-transformacija',
      naziv: 'Transformacija Signala',
      dimenzije: 768,
      magnituda: 0.87,
      normalizacija: 0.91,
      koherentnost: 0.93,
    },
    {
      id: 'vk-normalizacija',
      naziv: 'Normalizacija Vektora',
      dimenzije: 256,
      magnituda: 0.94,
      normalizacija: 0.98,
      koherentnost: 0.86,
    },
    {
      id: 'vk-projekcija',
      naziv: 'Projekcija Izlaza',
      dimenzije: 128,
      magnituda: 0.88,
      normalizacija: 0.93,
      koherentnost: 0.91,
    },
  ];

  const vektoriSaStatusom: VektorizacijaVektor[] = vektori.map((vektor) => {
    const status: VektorizacijaVektor['status'] =
      vektor.magnituda < 0.6 || vektor.koherentnost < 0.6
        ? 'neaktivan'
        : vektor.magnituda < 0.8 || vektor.koherentnost < 0.8
          ? 'optimizacija'
          : 'aktivan';

    return { ...vektor, status };
  });

  const prosekMagnitude = round4(
    vektoriSaStatusom.reduce((sum, v) => sum + v.magnituda, 0) / vektoriSaStatusom.length,
  );
  const prosekKoherentnosti = round4(
    vektoriSaStatusom.reduce((sum, v) => sum + v.koherentnost, 0) / vektoriSaStatusom.length,
  );
  const prosekNormalizacije = round4(
    vektoriSaStatusom.reduce((sum, v) => sum + v.normalizacija, 0) / vektoriSaStatusom.length,
  );

  const stabilnostProstora = clamp01(
    round4(prosekKoherentnosti * 0.5 + prosekNormalizacije * 0.35 + prosekMagnitude * 0.15),
  );
  const efikasnostTransformacije = clamp01(round4(prosekMagnitude * 0.55 + prosekNormalizacije * 0.45));
  const indeksVektorizacije = clamp01(
    round4(stabilnostProstora * 0.45 + efikasnostTransformacije * 0.35 + prosekKoherentnosti * 0.2),
  );

  return {
    status: 'aktivan',
    indeksVektorizacije,
    prosekMagnitude,
    prosekKoherentnosti,
    stabilnostProstora,
    efikasnostTransformacije,
    vektori: vektoriSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
