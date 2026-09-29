'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';

type PlanId = 'basic' | 'pro' | 'enterprise' | 'unlimited';

const PLANOVI: Array<{ id: PlanId; naziv: string; cena: string; opis: string }> = [
  { id: 'basic', naziv: 'Basic', cena: '€9 / mesec', opis: 'Za pojedince sa proširenim pristupom.' },
  { id: 'pro', naziv: 'Pro', cena: '€29 / mesec', opis: 'Za profesionalni rad i napredne alate.' },
  { id: 'enterprise', naziv: 'Enterprise', cena: '€99 / mesec', opis: 'Za timove sa SLA i audit potrebama.' },
  { id: 'unlimited', naziv: 'Unlimited', cena: '€199 / mesec', opis: 'Za neograničen pristup platformi.' },
];

export default function SubscriptionCheckout() {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);

  async function startCheckout(planId: PlanId) {
    const sesija = dohvatiSesiju();
    if (!sesija) {
      window.location.href = `/login?redirect=${encodeURIComponent('/pretplata')}`;
      return;
    }

    setLoadingPlan(planId);
    setPoruka(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sesija.token}`,
        },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json() as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setPoruka(data.error ?? 'Checkout trenutno nije dostupan. Pokušajte kasnije.');
        return;
      }

      window.location.assign(data.url);
    } catch {
      setPoruka('Mrežna greška. Proverite vezu i pokušajte ponovo.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section className="spaja-shell px-4 py-16">
      <div className="spaja-container max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-white">Pretplata</h1>
          <p className="mt-3 text-slate-300">
            Izaberite plan. Plaćanje se obrađuje na Stripe Checkout stranici; podaci kartice se ne unose u ovu aplikaciju.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PLANOVI.map((plan) => (
            <article key={plan.id} className="spaja-card flex flex-col p-6">
              <h2 className="text-xl font-semibold text-white">{plan.naziv}</h2>
              <p className="mt-2 text-2xl font-bold text-green-300">{plan.cena}</p>
              <p className="mt-3 flex-1 text-sm text-slate-300">{plan.opis}</p>
              <Button
                className="mt-6 w-full"
                variant="success"
                loading={loadingPlan === plan.id}
                loadingLabel="Otvaranje checkout-a…"
                onClick={() => startCheckout(plan.id)}
              >
                Izaberi {plan.naziv}
              </Button>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Pre nastavka morate imati korisnički nalog. Ako Stripe ili baza nisu podešeni, aplikacija neće kreirati naplatu.
        </p>
        {poruka && <p role="alert" className="mt-4 text-sm text-red-300">{poruka}</p>}
      </div>
    </section>
  );
}
