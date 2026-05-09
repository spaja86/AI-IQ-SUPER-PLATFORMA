import { createClient } from '@supabase/supabase-js';
import { APP_VERSION } from '@/lib/constants';
import { getKontaktKanal } from '@/lib/kompanija-spaja-operativa';

export type B2BPartnerTip = 'proizvodjac' | 'ovlasceni_diler' | 'posrednik' | 'tehnoloski_partner';
export type B2BPartnerStatus = 'lead' | 'kontaktiran' | 'u_pregovorima' | 'aktivan' | 'odbijen';

export type B2BProcurementStatus =
  | 'upit'
  | 'ponuda'
  | 'pregovori'
  | 'odobrenje'
  | 'placanje'
  | 'isporuka'
  | 'preuzeto'
  | 'otkazano';

export type B2BDokumentStatus = 'nedostaje' | 'primljeno' | 'verifikovano';
export type B2BOdobrenjeStatus = 'pending' | 'approved' | 'rejected';
export type B2BPaymentStatus = 'ceka_odobrenje' | 'spremno_za_uplatu' | 'uplaceno';
export type B2BDeliveryStatus = 'nije_zakazano' | 'zakazano' | 'u_toku' | 'isporuceno' | 'preuzeto';

export interface B2BPartner {
  id: string;
  naziv: string;
  tip: B2BPartnerTip;
  trziste: string;
  kanalKontakta: string;
  status: B2BPartnerStatus;
}

export interface B2BVehicleSpec {
  marka: string;
  model: string;
  oprema: string;
  trziste: string;
  budzet: number;
  valuta: 'EUR' | 'USD' | 'RSD';
  prioritet: 'nizak' | 'srednji' | 'visok' | 'kritican';
  rok: string | null;
}

export interface B2BOffer {
  id: string;
  izvor: string;
  cena: number;
  valuta: 'EUR' | 'USD' | 'RSD';
  fullOpremaStavke: string[];
  vaziDo: string | null;
  status: 'primljena' | 'u_analizi' | 'prihvacena' | 'odbijena';
  createdAt: string;
}

export interface B2BNegotiationNote {
  id: string;
  kanal: 'email' | 'poziv' | 'sastanak' | 'kontakt_forma';
  napomena: string;
  sledeciKorak: string | null;
  odgovornaOsoba: string;
  createdAt: string;
}

export interface B2BDokument {
  id: string;
  kljuc: string;
  naziv: string;
  status: B2BDokumentStatus;
  obaveznoZaPlacanje: boolean;
  verifikovao: string | null;
  updatedAt: string;
}

export interface B2BOdobrenje {
  id: string;
  kljuc: string;
  naziv: string;
  status: B2BOdobrenjeStatus;
  odobrio: string | null;
  updatedAt: string;
}

export interface B2BPaymentInfo {
  status: B2BPaymentStatus;
  izvorSredstava: string;
  fakturaBroj: string | null;
  predracunBroj: string | null;
  potvrdaUplate: string | null;
  updatedAt: string;
}

export interface B2BDeliveryInfo {
  status: B2BDeliveryStatus;
  adresaIsporuke: string;
  kontaktZaIsporuku: string;
  terminIsporuke: string | null;
  napomena: string | null;
  updatedAt: string;
}

export interface B2BPrivateKontakt {
  vlasnik: string;
  privatniTelefon: string;
}

export interface B2BProcurementCase {
  id: string;
  sifra: string;
  status: B2BProcurementStatus;
  partner: B2BPartner;
  vozilo: B2BVehicleSpec;
  payment: B2BPaymentInfo;
  delivery: B2BDeliveryInfo;
  privatniKontakt: B2BPrivateKontakt;
  dokumentacija: B2BDokument[];
  odobrenja: B2BOdobrenje[];
  ponude: B2BOffer[];
  pregovori: B2BNegotiationNote[];
  createdAt: string;
  updatedAt: string;
}

export interface B2BProcurementSummary {
  ukupno: number;
  poStatusu: Record<B2BProcurementStatus, number>;
  otvoreni: number;
  spremniZaUplatu: number;
  privatniPodaciSkriveni: boolean;
}

const DEFAULT_DOKUMENTA: Array<{ kljuc: string; naziv: string; obaveznoZaPlacanje: boolean }> = [
  { kljuc: 'pravno-lice', naziv: 'Dokaz o pravnom licu', obaveznoZaPlacanje: true },
  { kljuc: 'dokumentacija-kupca', naziv: 'Dokumentacija kupca', obaveznoZaPlacanje: true },
  { kljuc: 'dokumentacija-prodavca', naziv: 'Dokumentacija prodavca', obaveznoZaPlacanje: true },
  { kljuc: 'faktura-predracun', naziv: 'Faktura / predračun', obaveznoZaPlacanje: true },
  { kljuc: 'potvrda-logistike', naziv: 'Potvrda logistike', obaveznoZaPlacanje: false },
];

const DEFAULT_ODOBRENJA: Array<{ kljuc: string; naziv: string }> = [
  { kljuc: 'vlasnicko-odobrenje', naziv: 'Vlasničko odobrenje' },
  { kljuc: 'billing-approval', naziv: 'Billing approval' },
  { kljuc: 'operativa-approval', naziv: 'Operativno odobrenje' },
];

const STATUS_TRANSITIONS: Record<B2BProcurementStatus, B2BProcurementStatus[]> = {
  upit: ['ponuda', 'otkazano'],
  ponuda: ['pregovori', 'otkazano'],
  pregovori: ['odobrenje', 'otkazano'],
  odobrenje: ['placanje', 'otkazano'],
  placanje: ['isporuka', 'otkazano'],
  isporuka: ['preuzeto', 'otkazano'],
  preuzeto: [],
  otkazano: [],
};

const FALLBACK_CASE_ID = 'b2b-proc-001';
const salesKontakt = getKontaktKanal('sales')?.email ?? 'sales@spaja.rs';
const billingKontakt = getKontaktKanal('billing')?.email ?? 'billing@spaja.rs';

const fallbackCase: B2BProcurementCase = {
  id: FALLBACK_CASE_ID,
  sifra: 'B2B-LUX-001',
  status: 'upit',
  partner: {
    id: 'partner-lux-auto',
    naziv: 'Luksuzni auto partner Srbija',
    tip: 'ovlasceni_diler',
    trziste: 'Srbija',
    kanalKontakta: salesKontakt,
    status: 'lead',
  },
  vozilo: {
    marka: 'Lamborghini',
    model: 'N/A',
    oprema: 'FULL OPREMA',
    trziste: 'Srbija',
    budzet: 0,
    valuta: 'EUR',
    prioritet: 'kritican',
    rok: null,
  },
  payment: {
    status: 'ceka_odobrenje',
    izvorSredstava: 'AI IQ World Bank',
    fakturaBroj: null,
    predracunBroj: null,
    potvrdaUplate: null,
    updatedAt: new Date().toISOString(),
  },
  delivery: {
    status: 'nije_zakazano',
    adresaIsporuke: 'Danila Kiša 18, Smederevo 11300',
    kontaktZaIsporuku: 'interni-vlasnik-kontakt',
    terminIsporuke: null,
    napomena: 'Adresa i privatni kontakt su admin-only podaci.',
    updatedAt: new Date().toISOString(),
  },
  privatniKontakt: {
    vlasnik: 'Nikola Spajić',
    privatniTelefon: '+381642396577',
  },
  dokumentacija: DEFAULT_DOKUMENTA.map((doc, idx) => ({
    id: `doc-${idx + 1}`,
    kljuc: doc.kljuc,
    naziv: doc.naziv,
    status: 'nedostaje',
    obaveznoZaPlacanje: doc.obaveznoZaPlacanje,
    verifikovao: null,
    updatedAt: new Date().toISOString(),
  })),
  odobrenja: DEFAULT_ODOBRENJA.map((approval, idx) => ({
    id: `approval-${idx + 1}`,
    kljuc: approval.kljuc,
    naziv: approval.naziv,
    status: 'pending',
    odobrio: null,
    updatedAt: new Date().toISOString(),
  })),
  ponude: [],
  pregovori: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const memoryStore = new Map<string, B2BProcurementCase>([[fallbackCase.id, fallbackCase]]);

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function cloneCase(caseItem: B2BProcurementCase): B2BProcurementCase {
  return JSON.parse(JSON.stringify(caseItem)) as B2BProcurementCase;
}

function sanitizeCase(caseItem: B2BProcurementCase, includeSensitive: boolean): B2BProcurementCase {
  if (includeSensitive) return cloneCase(caseItem);
  return {
    ...cloneCase(caseItem),
    delivery: {
      ...caseItem.delivery,
      adresaIsporuke: 'INTERNAL_ONLY',
      kontaktZaIsporuku: salesKontakt,
    },
    privatniKontakt: {
      vlasnik: 'INTERNAL_ONLY',
      privatniTelefon: 'INTERNAL_ONLY',
    },
  };
}

function normalizeFromSnapshot(snapshot: unknown): B2BProcurementCase | null {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const maybe = snapshot as Partial<B2BProcurementCase>;
  if (!maybe.id || !maybe.sifra || !maybe.partner || !maybe.vozilo) return null;
  return maybe as B2BProcurementCase;
}

async function loadFromSupabase(): Promise<B2BProcurementCase[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('b2b_nabavke').select('id, snapshot').order('created_at', { ascending: false });
  if (error || !data) return null;

  const items: B2BProcurementCase[] = [];
  for (const row of data) {
    const normalized = normalizeFromSnapshot(row.snapshot);
    if (normalized) items.push(normalized);
  }
  if (items.length === 0) return null;
  return items;
}

async function saveSnapshotToSupabase(caseItem: B2BProcurementCase): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  await supabase.from('b2b_partneri').upsert(
    {
      id: caseItem.partner.id,
      naziv: caseItem.partner.naziv,
      tip: caseItem.partner.tip,
      trziste: caseItem.partner.trziste,
      kanal_kontakta: caseItem.partner.kanalKontakta,
      status: caseItem.partner.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  await supabase.from('b2b_nabavke').upsert(
    {
      id: caseItem.id,
      partner_id: caseItem.partner.id,
      case_code: caseItem.sifra,
      status: caseItem.status,
      market: caseItem.vozilo.trziste,
      vehicle_make: caseItem.vozilo.marka,
      vehicle_model: caseItem.vozilo.model,
      vehicle_trim: caseItem.vozilo.oprema,
      budget_amount: caseItem.vozilo.budzet,
      budget_currency: caseItem.vozilo.valuta,
      priority: caseItem.vozilo.prioritet,
      due_date: caseItem.vozilo.rok,
      financing_source: caseItem.payment.izvorSredstava,
      owner_name: caseItem.privatniKontakt.vlasnik,
      private_phone: caseItem.privatniKontakt.privatniTelefon,
      delivery_address: caseItem.delivery.adresaIsporuke,
      snapshot: caseItem as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
}

async function appendTimelineRows(caseItem: B2BProcurementCase): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const latestOffer = caseItem.ponude[caseItem.ponude.length - 1];
  if (latestOffer) {
    await supabase.from('b2b_ponude').upsert(
      {
        id: latestOffer.id,
        nabavka_id: caseItem.id,
        source: latestOffer.izvor,
        amount: latestOffer.cena,
        currency: latestOffer.valuta,
        valid_until: latestOffer.vaziDo,
        full_oprema: latestOffer.fullOpremaStavke,
        status: latestOffer.status,
      },
      { onConflict: 'id' },
    );
  }
  const latestPregovor = caseItem.pregovori[caseItem.pregovori.length - 1];
  if (latestPregovor) {
    await supabase.from('b2b_pregovori_istorija').upsert(
      {
        id: latestPregovor.id,
        nabavka_id: caseItem.id,
        kanal: latestPregovor.kanal,
        napomena: latestPregovor.napomena,
        sledeci_korak: latestPregovor.sledeciKorak,
        odgovorna_osoba: latestPregovor.odgovornaOsoba,
      },
      { onConflict: 'id' },
    );
  }

  for (const doc of caseItem.dokumentacija) {
    await supabase.from('b2b_dokumentacija').upsert(
      {
        id: doc.id,
        nabavka_id: caseItem.id,
        doc_key: doc.kljuc,
        naziv: doc.naziv,
        status: doc.status,
        required_for_payment: doc.obaveznoZaPlacanje,
        verified_by: doc.verifikovao,
      },
      { onConflict: 'id' },
    );
  }

  for (const approval of caseItem.odobrenja) {
    await supabase.from('b2b_payment_approvals').upsert(
      {
        id: approval.id,
        nabavka_id: caseItem.id,
        approval_key: approval.kljuc,
        naziv: approval.naziv,
        status: approval.status,
        approved_by: approval.odobrio,
      },
      { onConflict: 'id' },
    );
  }

  await supabase.from('b2b_placanja').upsert(
    {
      nabavka_id: caseItem.id,
      status: caseItem.payment.status,
      source_of_funds: caseItem.payment.izvorSredstava,
      invoice_number: caseItem.payment.fakturaBroj,
      proforma_number: caseItem.payment.predracunBroj,
      payment_confirmation: caseItem.payment.potvrdaUplate,
      updated_at: caseItem.payment.updatedAt,
    },
    { onConflict: 'nabavka_id' },
  );

  await supabase.from('b2b_delivery_tracking').upsert(
    {
      nabavka_id: caseItem.id,
      status: caseItem.delivery.status,
      delivery_address: caseItem.delivery.adresaIsporuke,
      delivery_contact: caseItem.delivery.kontaktZaIsporuku,
      eta: caseItem.delivery.terminIsporuke,
      napomena: caseItem.delivery.napomena,
      updated_at: caseItem.delivery.updatedAt,
    },
    { onConflict: 'nabavka_id' },
  );
}

async function getAllCasesRaw(): Promise<B2BProcurementCase[]> {
  const dbCases = await loadFromSupabase();
  if (dbCases && dbCases.length > 0) return dbCases;
  return Array.from(memoryStore.values()).map(cloneCase);
}

async function saveCase(caseItem: B2BProcurementCase): Promise<B2BProcurementCase> {
  const normalized = cloneCase(caseItem);
  memoryStore.set(normalized.id, normalized);
  await saveSnapshotToSupabase(normalized);
  await appendTimelineRows(normalized);
  return normalized;
}

export function getMissingChecklist(caseItem: B2BProcurementCase): string[] {
  const missing: string[] = [];
  if (!caseItem.dokumentacija.some((d) => d.kljuc === 'pravno-lice' && d.status === 'verifikovano')) {
    missing.push('Pravno lice nije verifikovano.');
  }
  if (!caseItem.odobrenja.some((a) => a.kljuc === 'vlasnicko-odobrenje' && a.status === 'approved')) {
    missing.push('Nedostaje vlasničko odobrenje.');
  }
  if (!caseItem.odobrenja.some((a) => a.kljuc === 'billing-approval' && a.status === 'approved')) {
    missing.push('Nedostaje billing approval.');
  }
  if (!caseItem.dokumentacija.some((d) => d.kljuc === 'dokumentacija-kupca' && d.status === 'verifikovano')) {
    missing.push('Nedostaje verifikovana dokumentacija kupca.');
  }
  if (!caseItem.dokumentacija.some((d) => d.kljuc === 'dokumentacija-prodavca' && d.status === 'verifikovano')) {
    missing.push('Nedostaje verifikovana dokumentacija prodavca.');
  }
  if (!caseItem.dokumentacija.some((d) => d.kljuc === 'faktura-predracun' && d.status !== 'nedostaje')) {
    missing.push('Nedostaje faktura/predračun.');
  }
  if (!caseItem.dokumentacija.some((d) => d.kljuc === 'potvrda-logistike' && d.status !== 'nedostaje')) {
    missing.push('Nedostaje potvrda logistike.');
  }
  return missing;
}

export function canTransition(caseItem: B2BProcurementCase, nextStatus: B2BProcurementStatus): {
  ok: boolean;
  reason?: string;
} {
  const allowed = STATUS_TRANSITIONS[caseItem.status];
  if (!allowed.includes(nextStatus)) {
    return { ok: false, reason: `Nedozvoljen prelaz iz ${caseItem.status} u ${nextStatus}.` };
  }
  if (nextStatus === 'placanje') {
    const missing = getMissingChecklist(caseItem);
    if (missing.length > 0) {
      return { ok: false, reason: `Nije spremno za plaćanje: ${missing.join(' ')}` };
    }
  }
  return { ok: true };
}

export function buildKomunikacioniSablon(
  tip: 'inicijalni_upit' | 'zahtev_full_oprema' | 'zahtev_dostava' | 'zahtev_dokumentacija' | 'potvrda_uplate',
  caseItem: B2BProcurementCase,
): { naslov: string; telo: string } {
  const common = [
    `Predmet je nabavka vozila ${caseItem.vozilo.marka} ${caseItem.vozilo.model} (${caseItem.vozilo.oprema}).`,
    `Finansiranje ide preko ${caseItem.payment.izvorSredstava}.`,
    `Za komercijalnu komunikaciju koristiti ${salesKontakt}; za billing ${billingKontakt}.`,
  ].join(' ');

  switch (tip) {
    case 'zahtev_full_oprema':
      return {
        naslov: `Zahtev za FULL OPREMA paket — ${caseItem.sifra}`,
        telo: `${common}\n\nMolimo ponudu koja uključuje full opremu i detaljnu specifikaciju dodatne opreme.`,
      };
    case 'zahtev_dostava':
      return {
        naslov: `Zahtev za isporuku na adresu — ${caseItem.sifra}`,
        telo: `${common}\n\nMolimo potvrdu logistike i plan isporuke na ugovorenu adresu (admin-only evidencija).`,
      };
    case 'zahtev_dokumentacija':
      return {
        naslov: `Dopuna dokumentacije — ${caseItem.sifra}`,
        telo: `${common}\n\nMolimo listu dodatne dokumentacije potrebne za finalizaciju ugovora i plaćanja.`,
      };
    case 'potvrda_uplate':
      return {
        naslov: `Potvrda spremnosti za uplatu — ${caseItem.sifra}`,
        telo: `${common}\n\nPotvrđujemo spremnost da izvršimo uplatu po finalnim komercijalnim uslovima.`,
      };
    case 'inicijalni_upit':
    default:
      return {
        naslov: `Inicijalni B2B upit za partnerstvo i nabavku — ${caseItem.sifra}`,
        telo: `${common}\n\nMolimo početnu ponudu i predlog narednih koraka za pregovore.`,
      };
  }
}

export async function getB2BProcurementCases(options?: {
  includeSensitive?: boolean;
}): Promise<B2BProcurementCase[]> {
  const all = await getAllCasesRaw();
  return all.map((item) => sanitizeCase(item, options?.includeSensitive === true));
}

export async function getB2BProcurementCaseById(
  caseId: string,
  options?: { includeSensitive?: boolean },
): Promise<B2BProcurementCase | null> {
  const all = await getAllCasesRaw();
  const found = all.find((item) => item.id === caseId);
  if (!found) return null;
  return sanitizeCase(found, options?.includeSensitive === true);
}

export async function createB2BProcurementCase(input: {
  partner: Pick<B2BPartner, 'naziv' | 'tip' | 'trziste' | 'kanalKontakta'>;
  vozilo: Pick<B2BVehicleSpec, 'marka' | 'model' | 'oprema' | 'trziste' | 'budzet' | 'valuta' | 'prioritet' | 'rok'>;
  paymentSource?: string;
  deliveryAddress: string;
  deliveryContact: string;
  privateOwnerName: string;
  privatePhone: string;
}): Promise<B2BProcurementCase> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const partnerId = crypto.randomUUID();
  const caseItem: B2BProcurementCase = {
    id,
    sifra: `B2B-${now.slice(0, 10).replace(/-/g, '')}-${id.slice(0, 6).toUpperCase()}`,
    status: 'upit',
    partner: {
      id: partnerId,
      naziv: input.partner.naziv,
      tip: input.partner.tip,
      trziste: input.partner.trziste,
      kanalKontakta: input.partner.kanalKontakta,
      status: 'lead',
    },
    vozilo: { ...input.vozilo },
    payment: {
      status: 'ceka_odobrenje',
      izvorSredstava: input.paymentSource ?? 'AI IQ World Bank',
      fakturaBroj: null,
      predracunBroj: null,
      potvrdaUplate: null,
      updatedAt: now,
    },
    delivery: {
      status: 'nije_zakazano',
      adresaIsporuke: input.deliveryAddress,
      kontaktZaIsporuku: input.deliveryContact,
      terminIsporuke: null,
      napomena: null,
      updatedAt: now,
    },
    privatniKontakt: {
      vlasnik: input.privateOwnerName,
      privatniTelefon: input.privatePhone,
    },
    dokumentacija: DEFAULT_DOKUMENTA.map((doc) => ({
      id: crypto.randomUUID(),
      kljuc: doc.kljuc,
      naziv: doc.naziv,
      status: 'nedostaje',
      obaveznoZaPlacanje: doc.obaveznoZaPlacanje,
      verifikovao: null,
      updatedAt: now,
    })),
    odobrenja: DEFAULT_ODOBRENJA.map((approval) => ({
      id: crypto.randomUUID(),
      kljuc: approval.kljuc,
      naziv: approval.naziv,
      status: 'pending',
      odobrio: null,
      updatedAt: now,
    })),
    ponude: [],
    pregovori: [],
    createdAt: now,
    updatedAt: now,
  };
  return saveCase(caseItem);
}

export async function patchB2BProcurementCase(input: {
  caseId: string;
  action:
    | { type: 'offer_upsert'; payload: Omit<B2BOffer, 'id' | 'createdAt'> & { id?: string } }
    | { type: 'negotiation_add'; payload: Omit<B2BNegotiationNote, 'id' | 'createdAt'> & { id?: string } }
    | { type: 'document_update'; payload: { kljuc: string; status: B2BDokumentStatus; verifikovao?: string | null } }
    | { type: 'approval_update'; payload: { kljuc: string; status: B2BOdobrenjeStatus; odobrio?: string | null } }
    | {
        type: 'payment_update';
        payload: Partial<Omit<B2BPaymentInfo, 'updatedAt'>> & { status?: B2BPaymentStatus };
      }
    | {
        type: 'delivery_update';
        payload: Partial<Omit<B2BDeliveryInfo, 'updatedAt'>> & { status?: B2BDeliveryStatus };
      }
    | { type: 'status_transition'; payload: { status: B2BProcurementStatus } };
}): Promise<{ updated?: B2BProcurementCase; error?: string }> {
  const all = await getAllCasesRaw();
  const found = all.find((item) => item.id === input.caseId);
  if (!found) return { error: `Nabavka nije pronađena: ${input.caseId}` };

  const now = new Date().toISOString();
  const next = cloneCase(found);

  const action = input.action;
  switch (action.type) {
    case 'offer_upsert': {
      const payload = action.payload;
      const existingIdx = next.ponude.findIndex((offer) => offer.id === payload.id);
      const offer: B2BOffer = {
        id: payload.id ?? crypto.randomUUID(),
        izvor: payload.izvor,
        cena: payload.cena,
        valuta: payload.valuta,
        fullOpremaStavke: payload.fullOpremaStavke,
        vaziDo: payload.vaziDo,
        status: payload.status,
        createdAt: now,
      };
      if (existingIdx >= 0) next.ponude[existingIdx] = offer;
      else next.ponude.unshift(offer);
      break;
    }
    case 'negotiation_add': {
      const payload = action.payload;
      next.pregovori.unshift({
        id: payload.id ?? crypto.randomUUID(),
        kanal: payload.kanal,
        napomena: payload.napomena,
        sledeciKorak: payload.sledeciKorak ?? null,
        odgovornaOsoba: payload.odgovornaOsoba,
        createdAt: now,
      });
      break;
    }
    case 'document_update': {
      const payload = action.payload;
      const idx = next.dokumentacija.findIndex((doc) => doc.kljuc === payload.kljuc);
      if (idx < 0) return { error: `Dokument nije pronađen: ${payload.kljuc}` };
      next.dokumentacija[idx] = {
        ...next.dokumentacija[idx],
        status: payload.status,
        verifikovao: payload.verifikovao ?? next.dokumentacija[idx].verifikovao,
        updatedAt: now,
      };
      break;
    }
    case 'approval_update': {
      const payload = action.payload;
      const idx = next.odobrenja.findIndex((approval) => approval.kljuc === payload.kljuc);
      if (idx < 0) return { error: `Approval nije pronađen: ${payload.kljuc}` };
      next.odobrenja[idx] = {
        ...next.odobrenja[idx],
        status: payload.status,
        odobrio: payload.odobrio ?? next.odobrenja[idx].odobrio,
        updatedAt: now,
      };
      break;
    }
    case 'payment_update': {
      const payload = action.payload;
      next.payment = {
        ...next.payment,
        ...payload,
        updatedAt: now,
      };
      break;
    }
    case 'delivery_update': {
      const payload = action.payload;
      next.delivery = {
        ...next.delivery,
        ...payload,
        updatedAt: now,
      };
      break;
    }
    case 'status_transition': {
      const payload = action.payload;
      const check = canTransition(next, payload.status);
      if (!check.ok) return { error: check.reason ?? 'Status tranzicija nije dozvoljena.' };
      next.status = payload.status;
      break;
    }
    default:
      return { error: 'Nepoznata akcija.' };
  }

  next.updatedAt = now;
  const updated = await saveCase(next);
  return { updated };
}

export async function getB2BProcurementChecklist(caseId: string): Promise<{
  caseId: string;
  status: B2BProcurementStatus;
  missing: string[];
  readyForPayment: boolean;
}> {
  const caseItem = await getB2BProcurementCaseById(caseId, { includeSensitive: true });
  if (!caseItem) {
    return {
      caseId,
      status: 'upit',
      missing: ['Nabavka nije pronađena.'],
      readyForPayment: false,
    };
  }
  const missing = getMissingChecklist(caseItem);
  return {
    caseId,
    status: caseItem.status,
    missing,
    readyForPayment: missing.length === 0,
  };
}

export async function getB2BProcurementSummary(includeSensitive: boolean): Promise<B2BProcurementSummary> {
  const items = await getB2BProcurementCases({ includeSensitive });
  const poStatusu: Record<B2BProcurementStatus, number> = {
    upit: 0,
    ponuda: 0,
    pregovori: 0,
    odobrenje: 0,
    placanje: 0,
    isporuka: 0,
    preuzeto: 0,
    otkazano: 0,
  };
  let spremniZaUplatu = 0;
  for (const item of items) {
    poStatusu[item.status] += 1;
    if (getMissingChecklist(item).length === 0) spremniZaUplatu += 1;
  }

  return {
    ukupno: items.length,
    poStatusu,
    otvoreni: items.filter((item) => item.status !== 'preuzeto' && item.status !== 'otkazano').length,
    spremniZaUplatu,
    privatniPodaciSkriveni: !includeSensitive,
  };
}

export function getB2BWorkflowMeta() {
  return {
    naziv: 'Internal B2B Procurement Workflow',
    verzija: APP_VERSION,
    domeni: ['partneri', 'nabavke', 'ponude', 'pregovori', 'dokumentacija', 'payment', 'delivery'],
    napomena:
      'Privatni kontakt podaci i adresa isporuke su dostupni samo uz admin pristup; javni kanali koriste kompanijske email adrese.',
    defaultKontakti: {
      sales: salesKontakt,
      billing: billingKontakt,
    },
  };
}
