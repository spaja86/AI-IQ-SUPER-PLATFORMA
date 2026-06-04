/**
 * 📶 DEMODULACIJA
 *
 * Operativni modul za rekonstrukciju modulisanih tokova kroz
 * filtraciju, dekodovanje i proveru kvaliteta izlaznog signala.
 */

export interface DemodulacijaKanal {
  id: string;
  naziv: string;
  ulaznaFrekvencijaKHz: number;
  signalNoiseRatioDb: number;
  stopaGreske: number;
  verovatnocaRekonstrukcije: number;
  kvalitetIzlaza: number;
  status: 'aktivan' | 'degradiran' | 'neaktivan';
}

export interface DemodulacijaRezultat {
  status: 'aktivan';
  indeksDemodulacije: number;
  prosekKvaliteta: number;
  prosekSNR: number;
  pouzdanostDekodovanja: number;
  kanali: DemodulacijaKanal[];
  userId: string;
  timestamp: string;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function buildDemodulacija(userId: string): DemodulacijaRezultat {
  const kanali: Omit<DemodulacijaKanal, 'status'>[] = [
    {
      id: 'dem-ulazni-filter',
      naziv: 'Ulazni Band-Filter',
      ulaznaFrekvencijaKHz: 110,
      signalNoiseRatioDb: 31,
      stopaGreske: 0.014,
      verovatnocaRekonstrukcije: 0.94,
      kvalitetIzlaza: 0.92,
    },
    {
      id: 'dem-adaptivni-eq',
      naziv: 'Adaptivni Ekvilajzer',
      ulaznaFrekvencijaKHz: 220,
      signalNoiseRatioDb: 29,
      stopaGreske: 0.019,
      verovatnocaRekonstrukcije: 0.91,
      kvalitetIzlaza: 0.89,
    },
    {
      id: 'dem-kanal-dekoder',
      naziv: 'Kanalni Dekoder',
      ulaznaFrekvencijaKHz: 340,
      signalNoiseRatioDb: 34,
      stopaGreske: 0.011,
      verovatnocaRekonstrukcije: 0.96,
      kvalitetIzlaza: 0.95,
    },
    {
      id: 'dem-kontrola-kvaliteta',
      naziv: 'Kontrola Kvaliteta Izlaza',
      ulaznaFrekvencijaKHz: 90,
      signalNoiseRatioDb: 33,
      stopaGreske: 0.009,
      verovatnocaRekonstrukcije: 0.97,
      kvalitetIzlaza: 0.96,
    },
  ];

  const kanaliSaStatusom: DemodulacijaKanal[] = kanali.map((kanal) => {
    const status: DemodulacijaKanal['status'] =
      kanal.kvalitetIzlaza < 0.6 || kanal.verovatnocaRekonstrukcije < 0.6
        ? 'neaktivan'
        : kanal.kvalitetIzlaza < 0.8 || kanal.verovatnocaRekonstrukcije < 0.8
          ? 'degradiran'
          : 'aktivan';

    return { ...kanal, status };
  });

  const prosekKvaliteta = round4(
    kanaliSaStatusom.reduce((sum, k) => sum + k.kvalitetIzlaza, 0) / kanaliSaStatusom.length,
  );
  const prosekSNR = round4(
    kanaliSaStatusom.reduce((sum, k) => sum + k.signalNoiseRatioDb, 0) / kanaliSaStatusom.length,
  );
  const prosekRekonstrukcije = round4(
    kanaliSaStatusom.reduce((sum, k) => sum + k.verovatnocaRekonstrukcije, 0) /
      kanaliSaStatusom.length,
  );
  const prosecnaStopaGreske = round4(
    kanaliSaStatusom.reduce((sum, k) => sum + k.stopaGreske, 0) / kanaliSaStatusom.length,
  );

  const normalizovanSNR = clamp01(round4(prosekSNR / 40));
  const pouzdanostDekodovanja = clamp01(
    round4(prosekRekonstrukcije * 0.55 + prosekKvaliteta * 0.3 + normalizovanSNR * 0.15),
  );
  const indeksDemodulacije = clamp01(
    round4(
      pouzdanostDekodovanja * 0.45 +
        prosekKvaliteta * 0.35 +
        (1 - prosecnaStopaGreske) * 0.2,
    ),
  );

  return {
    status: 'aktivan',
    indeksDemodulacije,
    prosekKvaliteta,
    prosekSNR,
    pouzdanostDekodovanja,
    kanali: kanaliSaStatusom,
    userId,
    timestamp: new Date().toISOString(),
  };
}
