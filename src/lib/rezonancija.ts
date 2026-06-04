/**
 * 🎛️ REZONANCIJA
 *
 * Operativni modul za usklađivanje frekvencija i stabilizaciju
 * oscilatornih tokova kroz više procesnih slojeva. Modeluje ciklus
 * rezonancije — pobudu, usklađivanje, stabilizaciju i emitovanje.
 */

export interface RezonancijaCvor {
  id: string;
  naziv: string;
  frekvencijaHz: number;
  amplituda: number;
  koherentnost: number;
  stabilnost: number;
  status: 'aktivan' | 'tjuning' | 'neaktivan';
}

export interface RezonancijaRezultat {
  status: 'aktivan';
  indeksRezonancije: number;
  prosekAmplitude: number;
  prosekStabilnosti: number;
  koherentnostMreze: number;
  efikasnostTjuninga: number;
  cvorovi: RezonancijaCvor[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildRezonancija(userId: string): RezonancijaRezultat {
  const cvorovi: Omit<RezonancijaCvor, 'status'>[] = [
    {
      id: 'rz-pobuda',
      naziv: 'Pobuda Mreže',
      frekvencijaHz: 432,
      amplituda: 0.9,
      koherentnost: 0.88,
      stabilnost: 0.92,
    },
    {
      id: 'rz-uskladjivanje',
      naziv: 'Usklađivanje Faznog Polja',
      frekvencijaHz: 528,
      amplituda: 0.86,
      koherentnost: 0.93,
      stabilnost: 0.89,
    },
    {
      id: 'rz-stabilizacija',
      naziv: 'Stabilizacija Rezonance',
      frekvencijaHz: 639,
      amplituda: 0.94,
      koherentnost: 0.87,
      stabilnost: 0.95,
    },
    {
      id: 'rz-emisija',
      naziv: 'Emitovanje Harmoničnog Izlaza',
      frekvencijaHz: 741,
      amplituda: 0.89,
      koherentnost: 0.91,
      stabilnost: 0.9,
    },
  ];

  const cvoroviSaStatusom: RezonancijaCvor[] = cvorovi.map((cvor) => {
    const status: RezonancijaCvor['status'] =
      cvor.amplituda < 0.6 || cvor.stabilnost < 0.6
        ? 'neaktivan'
        : cvor.amplituda < 0.8 || cvor.stabilnost < 0.8
          ? 'tjuning'
          : 'aktivan';

    return { ...cvor, status };
  });

  const prosekAmplitude = round4(
    cvoroviSaStatusom.reduce((sum, cvor) => sum + cvor.amplituda, 0) / cvoroviSaStatusom.length,
  );
  const prosekStabilnosti = round4(
    cvoroviSaStatusom.reduce((sum, cvor) => sum + cvor.stabilnost, 0) / cvoroviSaStatusom.length,
  );
  const prosekKoherentnosti = round4(
    cvoroviSaStatusom.reduce((sum, cvor) => sum + cvor.koherentnost, 0) / cvoroviSaStatusom.length,
  );

  const koherentnostMreze = clamp01(
    round4(prosekKoherentnosti * 0.5 + prosekStabilnosti * 0.35 + prosekAmplitude * 0.15),
  );
  const efikasnostTjuninga = clamp01(round4(prosekAmplitude * 0.55 + prosekStabilnosti * 0.45));
  const indeksRezonancije = clamp01(
    round4(koherentnostMreze * 0.45 + efikasnostTjuninga * 0.35 + prosekKoherentnosti * 0.2),
  );

  return {
    status: 'aktivan',
    indeksRezonancije,
    prosekAmplitude,
    prosekStabilnosti,
    koherentnostMreze,
    efikasnostTjuninga,
    cvorovi: cvoroviSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
