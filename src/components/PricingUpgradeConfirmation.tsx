'use client';

import { useMemo, useState } from 'react';
import {
  BILLING_UPGRADE_DISCLOSURE,
  UPGRADE_ACCEPTANCE_TEXT,
} from '@/lib/billing/upgrade-disclosure';

interface UpgradeApiResponse {
  requestRecord?: {
    requestId: string;
    status: string;
  };
  error?: string;
}

export default function PricingUpgradeConfirmation() {
  const enabled = process.env.NEXT_PUBLIC_BILLING_UPGRADE_FLOW_V1 !== 'false';
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const disclosureText = useMemo(
    () => `${BILLING_UPGRADE_DISCLOSURE.legalDisclosure} ${BILLING_UPGRADE_DISCLOSURE.billingThresholdPolicy}`,
    [],
  );

  if (!enabled) return null;

  async function handleConfirmAndRequestDispatch() {
    if (!accepted || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/billing-upgrade-company-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: BILLING_UPGRADE_DISCLOSURE.version,
          expectedTotalUsd: BILLING_UPGRADE_DISCLOSURE.totalUsd,
          acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
          autoSendToCompanyBilling: true,
          sendMode: 'dispatch_internal',
        }),
      });

      const data = (await response.json()) as UpgradeApiResponse;

      if (!response.ok || !data.requestRecord) {
        setMessage(data.error ?? 'Nije moguće poslati billing zahtev trenutno.');
        return;
      }

      setMessage(
        `✅ Zahtev je evidentiran (${data.requestRecord.requestId}) sa statusom "${data.requestRecord.status}". Nastavite na dashboard za checkout korak.`,
      );
    } catch {
      setMessage('Greška u mreži. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="spaja-container max-w-4xl">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6">
          <h2 className="mb-2 text-2xl font-bold text-white">Upgrade Confirmation</h2>
          <p className="mb-4 whitespace-pre-line text-sm text-slate-200">{disclosureText}</p>

          <div className="mb-4 overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase text-slate-300">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {BILLING_UPGRADE_DISCLOSURE.lineItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-700/60">
                    <td className="px-4 py-3 text-slate-200">{item.label}</td>
                    <td className="px-4 py-3 text-slate-200">${item.costUsd}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-700/60 bg-slate-800/60">
                  <td className="px-4 py-3 font-semibold text-white">Total</td>
                  <td className="px-4 py-3 font-semibold text-white">
                    ${BILLING_UPGRADE_DISCLOSURE.totalUsd} / month
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <label className="mb-5 flex cursor-pointer items-start gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            <span>I confirm and accept the upgrade billing terms shown above.</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConfirmAndRequestDispatch}
              disabled={!accepted || loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Slanje zahteva…' : 'Potvrdi i pošalji kompanijski billing zahtev'}
            </button>
            <a
              href="/dashboard"
              className="rounded-lg border border-slate-500 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
            >
              Nastavi na checkout (Dashboard)
            </a>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.startsWith('✅') ? 'text-green-300' : 'text-red-300'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
