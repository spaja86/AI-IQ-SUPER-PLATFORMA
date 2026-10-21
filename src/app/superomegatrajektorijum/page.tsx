import type { Metadata } from 'next';
import SuperOmegaRegistry from '@/components/SuperOmegaRegistry';
import { buildSuperOmegaRegistry, portfolioContext } from '@/lib/superomegatrajektorijum/registry';

export const metadata: Metadata = {
  title: 'SUPEROMEGATRAJEKTORIJUM — zajednički registar',
  description: 'Projekti, aplikacije, repozitorijumi i SPAJA Deploy sa izvorima i granicama potvrđenih mogućnosti.',
};
export const dynamic = 'force-dynamic';

export default function SuperOmegaPage() {
  // Request-time clock in a dynamic Server Component; passed once for consistent hydration.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();
  return <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
    <header className="space-y-4">
      <p className="text-sm uppercase tracking-widest text-cyan-300">SPAJA · zajednički pristup</p>
      <h1 className="break-words text-3xl font-bold sm:text-4xl">SUPEROMEGATRAJEKTORIJUM</h1>
      <p className="max-w-3xl text-slate-300">Platforme, aplikacije i razvojne ideje na jednom mestu. Svaki zapis ima stabilan identifikator, izvor i objašnjenje šta je potvrđeno.</p>
      <p className="rounded-xl border border-amber-700/60 bg-amber-950/30 p-4 text-sm text-amber-100">Stanje implementacije i dostupnost su odvojeni. Oznaka „aktivan“, definisana health adresa ili istorijski uspeh nisu dokaz da servis sada radi. Pregled registra ne pokreće provere spoljnih servisa niti deployment.</p>
    </header>
    <nav aria-label="Radni prostori registra" className="flex flex-wrap gap-4 text-cyan-300">
      <a className="underline" href="/omegatrojektorijum">Ideje i JSON izvoz</a>
      <a className="underline" href="/omegatrojektorijum/studio">Filmski studio</a>
      <a className="underline" href="/api/deploy-portfolio">Deploy portfolio (metapodaci)</a>
      <a className="underline" href="https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1365">Zaseban razvoj OMEGA grafa · PR #1365</a>
    </nav>
    <SuperOmegaRegistry entries={buildSuperOmegaRegistry()} initialNow={initialNow} />
    <details className="rounded-xl border border-slate-700 p-5">
      <summary className="cursor-pointer font-semibold">SPAJA Deploy — ciljevi i istorijski zapis</summary>
      <p className="my-3 text-sm text-slate-300">Ovo su KPI ciljevi iz deploy portfolija, bez rezultata tekućih merenja. Istorijski nepotvrđen zapis: <time dateTime={portfolioContext.historicalAt}>{portfolioContext.historicalAt}</time>.</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">{Object.entries(portfolioContext.kpiTargets).map(([key, value]) => <div key={key}><dt className="break-words text-slate-400">{key}</dt><dd>{value}</dd></div>)}</dl>
      <a className="mt-4 inline-block text-cyan-300 underline" href={portfolioContext.evidenceUrl}>Izvor istorijskog zapisa i ograničenja</a>
    </details>
  </div>;
}
