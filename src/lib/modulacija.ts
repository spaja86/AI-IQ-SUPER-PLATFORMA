/**
 * 📡 MODULACIJA
 *
 * Operativni modul za modulaciju signala i adaptivno kodovanje
 * kroz višekanalne prenosne tokove. Modeluje ciklus modulacije —
 * kodovanje, prenos, dekodovanje i verifikaciju integriteta signala.
 */

export interface ModulacijaKanal {
  id: string;
  naziv: string;
  frekvencijaKHz: number;
  bandwidthKHz: number;
  snaga: number;
  modulacioniIndeks: number;
  integritet: number;
  status: 'aktivan' | 'degradiran' | 'neaktivan';
}

export interface ModulacijaRezultat {
  status: 'aktivan';
  indeksModulacije: number;
  prosekIntegriteta: number;
  prosekSnage: number;
  efikasnostPrenosa: number;
  ukupnaBandwidth: number;
  kanali: ModulacijaKanal[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildModulacija(userId: string): ModulacijaRezultat {
  const kanali: Omit<ModulacijaKanal, 'status'>[] = [
    {
      id: 'mod-kodovanje',
      naziv: 'Kodovanje Signala',
      frekvencijaKHz: 100,
      bandwidthKHz: 20,
      snaga: 0.92,
      modulacioniIndeks: 0.88,
      integritet: 0.95,
    },
    {
      id: 'mod-prenos',
      naziv: 'Prenosni Kanal',
      frekvencijaKHz: 200,
      bandwidthKHz: 40,
      snaga: 0.87,
      modulacioniIndeks: 0.91,
      integritet: 0.89,
    },
    {
      id: 'mod-dekodovanje',
      naziv: 'Dekodovanje Signala',
      frekvencijaKHz: 300,
      bandwidthKHz: 20,
      snaga: 0.94,
      modulacioniIndeks: 0.85,
      integritet: 0.93,
    },
    {
      id: 'mod-verifikacija',
      naziv: 'Verifikacija Integriteta',
      frekvencijaKHz: 50,
      bandwidthKHz: 10,
      snaga: 0.96,
      modulacioniIndeks: 0.93,
      integritet: 0.97,
    },
  ];

  const kanalSaStatusom: ModulacijaKanal[] = kanali.map((kanal) => {
    const status: ModulacijaKanal['status'] =
      kanal.integritet < 0.6 || kanal.snaga < 0.6
        ? 'neaktivan'
        : kanal.integritet < 0.8 || kanal.snaga < 0.8
          ? 'degradiran'
          : 'aktivan';

    return { ...kanal, status };
  });

  const prosekIntegriteta = round4(
    kanalSaStatusom.reduce((sum, k) => sum + k.integritet, 0) / kanalSaStatusom.length,
  );
  const prosekSnage = round4(
    kanalSaStatusom.reduce((sum, k) => sum + k.snaga, 0) / kanalSaStatusom.length,
  );
  const prosekModulacionogIndeksa = round4(
    kanalSaStatusom.reduce((sum, k) => sum + k.modulacioniIndeks, 0) / kanalSaStatusom.length,
  );
  const ukupnaBandwidth = kanalSaStatusom.reduce((sum, k) => sum + k.bandwidthKHz, 0);

  const efikasnostPrenosa = clamp01(
    round4(prosekIntegriteta * 0.5 + prosekSnage * 0.35 + prosekModulacionogIndeksa * 0.15),
  );
  const indeksModulacije = clamp01(
    round4(
      efikasnostPrenosa * 0.45 + prosekModulacionogIndeksa * 0.35 + prosekIntegriteta * 0.2,
    ),
  );

  return {
    status: 'aktivan',
    indeksModulacije,
    prosekIntegriteta,
    prosekSnage,
    efikasnostPrenosa,
    ukupnaBandwidth,
    kanali: kanalSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
