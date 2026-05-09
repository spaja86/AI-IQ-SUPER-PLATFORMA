'use client';

import { useEffect, useMemo, useState } from 'react';
import { dohvatiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';

interface B2BChecklistStavka {
  caseId: string;
  status: string;
  missing: string[];
  readyForPayment: boolean;
}

interface B2BCaseUI {
  id: string;
  sifra: string;
  status: string;
  partner: { naziv: string; status: string; kanalKontakta: string };
  vozilo: { marka: string; model: string; oprema: string; budzet: number; valuta: string };
  payment: { status: string; izvorSredstava: string; fakturaBroj: string | null };
  delivery: { status: string; adresaIsporuke: string };
  ponude: Array<{ id: string; cena: number; valuta: string; status: string }>;
  pregovori: Array<{ id: string; kanal: string; napomena: string }>;
}

interface ApiPayload {
  slucajevi?: B2BCaseUI[];
}

interface ChecklistPayload {
  stavke?: B2BChecklistStavka[];
}

export default function ProcurementB2BDashboardKlijent() {
  const [sesija] = useState<OmegaSesija | null>(() => {
    if (typeof window === 'undefined') return null;
    return dohvatiSesiju();
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !!dohvatiSesiju()?.token;
  });
  const [cases, setCases] = useState<B2BCaseUI[]>([]);
  const [checklist, setChecklist] = useState<B2BChecklistStavka[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = sesija;
    if (!active?.token) return;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${active.token}`,
    };

    Promise.all([
      fetch('/api/b2b-procurement?includeSensitive=1', { headers }),
      fetch('/api/b2b-procurement/checklista', { headers }),
    ])
      .then(async ([casesRes, checklistRes]) => {
        if (!casesRes.ok) throw new Error('Nije moguće učitati B2B slučajeve.');
        if (!checklistRes.ok) throw new Error('Nije moguće učitati checklistu.');
        const casesData = (await casesRes.json()) as ApiPayload;
        const checklistData = (await checklistRes.json()) as ChecklistPayload;
        setCases(casesData.slucajevi ?? []);
        setChecklist(checklistData.stavke ?? []);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Neočekivana greška.');
      })
      .finally(() => setLoading(false));
  }, [sesija]);

  const checklistById = useMemo(() => new Map(checklist.map((item) => [item.caseId, item])), [checklist]);

  if (!sesija) {
    return (
      <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-6 text-yellow-200">
        Prijavite se da biste otvorili interni B2B procurement dashboard.
      </div>
    );
  }

  if (loading) {
    return <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-gray-300">Učitavanje B2B podataka...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
        Greška: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6">
        <h2 className="text-2xl font-semibold text-blue-100">🏢 Internal B2B Procurement Dashboard</h2>
        <p className="mt-2 text-sm text-blue-200">
          Partnerstva, ponude, dokumentacija, payment approval i delivery tracking u jednom internom workflow-u.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="text-sm text-gray-400">Slučajevi</div>
          <div className="mt-1 text-3xl font-bold text-white">{cases.length}</div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="text-sm text-gray-400">Spremni za uplatu</div>
          <div className="mt-1 text-3xl font-bold text-emerald-400">
            {checklist.filter((item) => item.readyForPayment).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="text-sm text-gray-400">Nedostaci u checklisti</div>
          <div className="mt-1 text-3xl font-bold text-orange-400">
            {checklist.filter((item) => item.missing.length > 0).length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cases.map((item) => {
          const itemChecklist = checklistById.get(item.id);
          return (
            <div key={item.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {item.sifra} — {item.vozilo.marka} {item.vozilo.model}
                </h3>
                <span className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-200">
                  status: {item.status}
                </span>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
                <div>
                  <div>Partner: {item.partner.naziv}</div>
                  <div>Kontakt: {item.partner.kanalKontakta}</div>
                  <div>Vozilo/oprema: {item.vozilo.oprema}</div>
                </div>
                <div>
                  <div>
                    Budžet: {item.vozilo.budzet.toLocaleString()} {item.vozilo.valuta}
                  </div>
                  <div>Payment status: {item.payment.status}</div>
                  <div>Delivery status: {item.delivery.status}</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-800 bg-black/20 p-3 text-sm">
                <div className="font-medium text-white">Checklist status</div>
                {itemChecklist?.missing.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-orange-300">
                    {itemChecklist.missing.map((missingItem) => (
                      <li key={missingItem}>{missingItem}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-emerald-300">Svi obavezni uslovi su ispunjeni.</p>
                )}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-gray-800 bg-black/20 p-3 text-sm text-gray-300">
                  <div className="mb-1 font-medium text-white">Ponude</div>
                  {item.ponude.length === 0 ? (
                    <div>Nema unetih ponuda.</div>
                  ) : (
                    item.ponude.slice(0, 3).map((offer) => (
                      <div key={offer.id}>
                        #{offer.id.slice(0, 8)} — {offer.cena.toLocaleString()} {offer.valuta} ({offer.status})
                      </div>
                    ))
                  )}
                </div>
                <div className="rounded-lg border border-gray-800 bg-black/20 p-3 text-sm text-gray-300">
                  <div className="mb-1 font-medium text-white">Pregovori</div>
                  {item.pregovori.length === 0 ? (
                    <div>Nema zapisa pregovora.</div>
                  ) : (
                    item.pregovori.slice(0, 3).map((note) => (
                      <div key={note.id}>
                        [{note.kanal}] {note.napomena}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
