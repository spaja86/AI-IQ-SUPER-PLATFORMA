// SpajaUltraOmegaCore -∞Ω+∞ — Delivery Checklist Modul
// Kompanija SPAJA — Digitalna Industrija
//
// Operativni delivery checklist za isporuku vozila i potpisivanje na licu mesta.
// Svaki „arrival event" mora proći checklist pre statusa `zatvoreno`.

import { APP_VERSION } from '@/lib/constants';

// ── Tipovi ────────────────────────────────────────────────────────────────

export type DeliveryChecklistStavkaStatus = 'ceka' | 'potvrdjeno' | 'preskoceno';
export type DeliverySignatureTip = 'digitalni' | 'fizicki_skenirano' | 'fizicki_evidentirano';

export interface DeliveryChecklistStavka {
  id: string;
  kljuc: string;
  naziv: string;
  opis: string;
  obavezan: boolean;
  status: DeliveryChecklistStavkaStatus;
  potvrdilaOsoba: string | null;
  napomena: string | null;
  updatedAt: string;
}

export interface DeliverySignaturaEvidencija {
  tip: DeliverySignatureTip;
  potpisnik: string;
  predstavnikKompanije: string;
  lokacija: string;
  timestamp: string;
  digitalniZapis: string | null;    // URL ili base64 scan
  fallbackRazlog: string | null;    // Popuniti samo za fizicki_ tipove
  odobrio: string | null;           // Ko je odobrio fizički fallback
}

export interface ArrivalEvent {
  slucajId: string;
  timestamp: string;
  lokacija: string;
  kontaktNaLicuMesta: string;
  checklist: DeliveryChecklistStavka[];
  signatura: DeliverySignaturaEvidencija | null;
  zatvorenoAt: string | null;
  napomena: string | null;
}

// ── Obavezne stavke checkliste ────────────────────────────────────────────

export const DEFAULT_DELIVERY_CHECKLIST: Array<{
  kljuc: string;
  naziv: string;
  opis: string;
  obavezan: boolean;
}> = [
  {
    kljuc: 'najava-dolaska',
    naziv: 'Najava dolaska',
    opis: 'Kupac/primalac je pismeno ili telefonski obavešten o datumu i vremenu isporuke',
    obavezan: true,
  },
  {
    kljuc: 'identifikacija-primaoca',
    naziv: 'Identifikacija primaoca',
    opis: 'Primalac je identifikovan (lična karta / punomoćje za pravno lice)',
    obavezan: true,
  },
  {
    kljuc: 'pregled-vozila',
    naziv: 'Pregled vozila',
    opis: 'Vozilo pregledan na licu mesta — nema oštećenja, oprema kompletna',
    obavezan: true,
  },
  {
    kljuc: 'dokumentacija-predana',
    naziv: 'Dokumentacija predata',
    opis: 'Sva dokumentacija (saobraćajna, garancija, uputstvo) predata primaocu',
    obavezan: true,
  },
  {
    kljuc: 'kljucevi-predani',
    naziv: 'Ključevi predati',
    opis: 'Svi kompleti ključeva predate primaocu i evidentirani',
    obavezan: true,
  },
  {
    kljuc: 'zapisnik-primopredaje',
    naziv: 'Zapisnik o primopredaji',
    opis: 'Zapisnik o primopredaji popunjen i potpisan od obe strane',
    obavezan: true,
  },
  {
    kljuc: 'foto-dokaz',
    naziv: 'Foto/scan dokaz',
    opis: 'Fotografije ili scan isporuke i potpisanih dokumenata digitalizovani',
    obavezan: true,
  },
  {
    kljuc: 'sistem-azuriran',
    naziv: 'Sistem ažuriran',
    opis: 'Status slučaja ažuriran u sistemu odmah nakon potpisivanja',
    obavezan: true,
  },
];

// ── Kreiranje checkliste ──────────────────────────────────────────────────

export function kreirajDeliveryChecklist(slucajId: string): ArrivalEvent {
  const now = new Date().toISOString();
  return {
    slucajId,
    timestamp: now,
    lokacija: '',
    kontaktNaLicuMesta: '',
    checklist: DEFAULT_DELIVERY_CHECKLIST.map((stavka) => ({
      id: `${slucajId}-${stavka.kljuc}`,
      kljuc: stavka.kljuc,
      naziv: stavka.naziv,
      opis: stavka.opis,
      obavezan: stavka.obavezan,
      status: 'ceka' as const,
      potvrdilaOsoba: null,
      napomena: null,
      updatedAt: now,
    })),
    signatura: null,
    zatvorenoAt: null,
    napomena: null,
  };
}

// ── Validacija arrival eventa ─────────────────────────────────────────────

export interface ValidacijaArrivalEventRezultat {
  ok: boolean;
  nedostaju: string[];
  upozorenja: string[];
  mozatvoriti: boolean;
}

export function validirajArrivalEvent(event: ArrivalEvent): ValidacijaArrivalEventRezultat {
  const nedostaju: string[] = [];
  const upozorenja: string[] = [];

  if (!event.lokacija) nedostaju.push('Lokacija isporuke nije unesena');
  if (!event.kontaktNaLicuMesta) nedostaju.push('Kontakt na licu mesta nije unesen');

  for (const stavka of event.checklist) {
    if (stavka.obavezan && stavka.status !== 'potvrdjeno') {
      nedostaju.push(`Obavezna stavka nije potvrđena: ${stavka.naziv}`);
    }
    if (!stavka.obavezan && stavka.status === 'ceka') {
      upozorenja.push(`Neobavezna stavka čeka potvrdu: ${stavka.naziv}`);
    }
  }

  if (!event.signatura) {
    nedostaju.push('Potpisivanje na licu mesta nije evidentirano');
  } else if (
    event.signatura.tip !== 'digitalni' &&
    !event.signatura.fallbackRazlog
  ) {
    nedostaju.push('Fizički potpis zahteva evidenciju razloga fallback-a');
  } else if (
    event.signatura.tip !== 'digitalni' &&
    !event.signatura.odobrio
  ) {
    nedostaju.push('Fizički potpis zahteva odobrenje odgovorne osobe');
  }

  if (event.signatura && !event.signatura.digitalniZapis) {
    if (event.signatura.tip === 'fizicki_skenirano') {
      upozorenja.push('Scan potpisanih dokumenata nije uploadovan');
    }
  }

  const mozatvoriti = nedostaju.length === 0;
  return { ok: mozatvoriti, nedostaju, upozorenja, mozatvoriti };
}

// ── Finalizacija arrival eventa ───────────────────────────────────────────

export function finalizirajArrivalEvent(event: ArrivalEvent): ArrivalEvent {
  const validacija = validirajArrivalEvent(event);
  if (!validacija.mozatvoriti) return event;
  return {
    ...event,
    zatvorenoAt: new Date().toISOString(),
  };
}

// ── Metadata ─────────────────────────────────────────────────────────────

export function getDeliveryChecklistMeta() {
  return {
    naziv: 'Delivery Checklist Modul',
    verzija: APP_VERSION,
    opis: 'Operativni checklist za isporuku vozila i potpisivanje na licu mesta. Svaki arrival event mora proći kroz sve obavezne stavke pre zatvaranja slučaja.',
    obavezneStavke: DEFAULT_DELIVERY_CHECKLIST.filter((s) => s.obavezan).map((s) => s.kljuc),
    signatureTipovi: ['digitalni', 'fizicki_skenirano', 'fizicki_evidentirano'],
    napomena:
      'Fizičko potpisivanje zahteva evidenciju razloga (fallbackRazlog) i odobrenje odgovorne osobe. Svi dokumenti moraju biti digitalizovani odmah nakon potpisivanja.',
  };
}
