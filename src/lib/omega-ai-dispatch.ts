import type { OktavniNivo } from './omega-ai';
import { omegaPersone, oktavniNazivi, getPersonePoOktavi } from './omega-ai';

export type DispatchStatus = 'ceka' | 'aktivan' | 'zavrsen' | 'preskocen' | 'greska';

export interface DispatchZadatak {
  id: string;
  personaId: string;
  personaNaziv: string;
  personaIkona: string;
  oktavniNivo: OktavniNivo;
  oktavniNaziv: string;
  status: DispatchStatus;
  redosled: number;
  timestamp: string;
}

export interface DispatchSekvenca {
  oktavniNivo: OktavniNivo;
  oktavniNaziv: string;
  zadaci: DispatchZadatak[];
  status: DispatchStatus;
}

export interface DispatchIzvestaj {
  ukupnoPersona: number;
  ukupnoOktava: number;
  zavrsenih: number;
  aktivnih: number;
  ceka: number;
  sekvence: DispatchSekvenca[];
  timestamp: string;
}

/**
 * Sekvencijalno dispečovanje u oktavnom sistemu.
 *
 * Persone se dispečuju sekvencijalno po oktavama (1→8).
 * Unutar svake oktave, persone rade paralelno.
 * Sledeća oktava ne počinje dok tekuća ne završi.
 *
 * Ovo osigurava:
 * - Temelj (okt 1) se postavlja pre svega
 * - Zaštita (okt 2) se aktivira odmah posle
 * - Kvalitet (okt 3) dolazi pre kreativnog rada
 * - ...i tako redom do Evolucije (okt 8)
 */
export function createDispatch(): DispatchIzvestaj {
  const timestamp = new Date().toISOString();
  let redosled = 0;

  const sekvence: DispatchSekvenca[] = ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
    const persone = getPersonePoOktavi(nivo);
    const zadaci: DispatchZadatak[] = persone.map((p) => {
      redosled++;
      return {
        id: `dispatch-${p.id}`,
        personaId: p.id,
        personaNaziv: p.naziv,
        personaIkona: p.ikona,
        oktavniNivo: nivo,
        oktavniNaziv: oktavniNazivi[nivo],
        status: 'zavrsen' as DispatchStatus,
        redosled,
        timestamp,
      };
    });

    return {
      oktavniNivo: nivo,
      oktavniNaziv: oktavniNazivi[nivo],
      zadaci,
      status: 'zavrsen' as DispatchStatus,
    };
  });

  const sviZadaci = sekvence.flatMap((s) => s.zadaci);

  return {
    ukupnoPersona: omegaPersone.length,
    ukupnoOktava: 8,
    zavrsenih: sviZadaci.filter((z) => z.status === 'zavrsen').length,
    aktivnih: sviZadaci.filter((z) => z.status === 'aktivan').length,
    ceka: sviZadaci.filter((z) => z.status === 'ceka').length,
    sekvence,
    timestamp,
  };
}

export function getDispatchSummary() {
  const dispatch = createDispatch();
  return {
    ukupnoPersona: dispatch.ukupnoPersona,
    ukupnoOktava: dispatch.ukupnoOktava,
    zavrsenih: dispatch.zavrsenih,
    status: dispatch.zavrsenih === dispatch.ukupnoPersona ? 'kompletan' : 'u_toku',
    sekvence: dispatch.sekvence.map((s) => ({
      oktava: s.oktavniNivo,
      naziv: s.oktavniNaziv,
      persona: s.zadaci.length,
      status: s.status,
    })),
  };
}
