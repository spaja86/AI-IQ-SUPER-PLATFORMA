'use client';

import { useEffect, useState } from 'react';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';
import VrCapabilityCheck from '@/components/VrCapabilityCheck';

type DeploymentSummary = { rezim: string; napomena: string; deploymenti: Array<{ id: string; naziv: string; state: string; checkedAt: string; source: string; message: string; alert: string; alertMessage: string | null }>; incidenti: Array<{ level: string; platformId: string; naziv: string; message: string; checkedAt: string; checklist: string[]; reviewStatus: string; owner: string; note: string; nextAction: string }> };

type Monitoring = { rezim: string; napomena: string; platforme: Array<{ id: string; naziv: string; state: string; source: string; alert: string }> };

type Platforma = { id: string; naziv: string; url: string; opis: string; kategorija: string };
type Katalog = { rezim: string; napomena: string; platforme: Platforma[] };

type Status = {
  naziv: string;
  rezim: string;
  napomena: string;
  statistika: { ukupnoKomponenti: number; aktivnihKomponenti: number; ukupnoKompjutera: number; ukupnoKonzola: number };
  komponente: Array<{ id: string; naziv: string; status: string }>;
  aiIqVrh: { canonicalScope: string; markanAlias: string; dslProfile: string; executionMode: string; readinessStatus: string; markanStatus: string; automatizacijaProgramskogJezikaStatus: string; explanation: string };
  digitalniBrouvzer: { naziv: string; verzija: string; ekstremniRezim: string; aktivnihModula: number; ukupnoModula: number; gamingIntegration: string; browserUrl: string; gamingUrl: string; napomena: string };
  timestamp: string;
};

export default function DigitalniKompjuterControlCenter() {
  const [status, setStatus] = useState<Status | null>(null);
  const [greska, setGreska] = useState<string | null>(null);
  const [katalog, setKatalog] = useState<Katalog | null>(null);
  const [monitoring, setMonitoring] = useState<Monitoring | null>(null);
  const [deploymenti, setDeploymenti] = useState<DeploymentSummary | null>(null);

  useEffect(() => {
    const sesija = dohvatiSesiju();
    if (!sesija) return;

    const headers = { Authorization: `Bearer ${sesija.token}` };
    Promise.all([
      fetch('/api/b2b-control-center/digitalni-kompjuter', { headers }),
      fetch('/api/b2b-control-center/platforme', { headers }),
      fetch('/api/b2b-control-center/nadzor-platformi', { headers }),
      fetch('/api/b2b-control-center/vercel-deployment-summary', { headers }),
    ])
      .then(async ([statusResponse, katalogResponse, monitoringResponse, deploymentResponse]) => {
        const statusPayload = await statusResponse.json() as Status | { error?: string };
        const katalogPayload = await katalogResponse.json() as Katalog | { error?: string };
        const monitoringPayload = await monitoringResponse.json() as Monitoring | { error?: string };
        const deploymentPayload = await deploymentResponse.json() as DeploymentSummary | { error?: string };
        if (!statusResponse.ok) throw new Error('error' in statusPayload ? statusPayload.error : 'Status nije dostupan.');
        if (!katalogResponse.ok) throw new Error('error' in katalogPayload ? katalogPayload.error : 'Katalog nije dostupan.');
        if (!monitoringResponse.ok) throw new Error('error' in monitoringPayload ? monitoringPayload.error : 'Nadzor nije dostupan.');
        if (!deploymentResponse.ok) throw new Error('error' in deploymentPayload ? deploymentPayload.error : 'Deployment status nije dostupan.');
        setStatus(statusPayload as Status);
        setKatalog(katalogPayload as Katalog);
        setMonitoring(monitoringPayload as Monitoring);
        setDeploymenti(deploymentPayload as DeploymentSummary);
      })
      .catch((error: unknown) => setGreska(error instanceof Error ? error.message : 'Status nije dostupan.'));
  }, []);

  if (greska) return <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-200">{greska}</p>;
  if (!status) return <p className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-300">Učitavanje statusa…</p>;

  const metrike = [
    ['Komponente', status.statistika.ukupnoKomponenti],
    ['Deklarisano aktivne', status.statistika.aktivnihKomponenti],
    ['Tipovi sistema', status.statistika.ukupnoKompjutera],
    ['Konzole', status.statistika.ukupnoKonzola],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-300">{status.rezim}</p>
      <h1 className="text-3xl font-bold text-white">{status.naziv}</h1>
      <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">{status.napomena}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrike.map(([naziv, vrednost]) => <div key={String(naziv)} className="rounded-xl border border-slate-700 bg-slate-900 p-5"><p className="text-sm text-slate-400">{naziv}</p><p className="mt-2 text-3xl font-bold text-cyan-200">{vrednost}</p></div>)}
      </div>
      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">AI IQ Programski Jezik — VRH profil</h2>
        <p className="mt-2 text-sm text-amber-100">{status.aiIqVrh.explanation}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-400">VRH status</dt><dd className="font-semibold text-cyan-200">{status.aiIqVrh.readinessStatus}</dd></div>
          <div><dt className="text-slate-400">MARKAN status</dt><dd className="font-semibold text-cyan-200">{status.aiIqVrh.markanStatus}</dd></div>
          <div><dt className="text-slate-400">Automatizacija jezika</dt><dd className="font-semibold text-cyan-200">{status.aiIqVrh.automatizacijaProgramskogJezikaStatus}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-slate-400">{status.aiIqVrh.canonicalScope} · {status.aiIqVrh.dslProfile} · {status.aiIqVrh.executionMode}</p>
      </div>
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Deklarisano aktivne komponente</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{status.komponente.map((komponenta) => <li key={komponenta.id} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200">{komponenta.naziv} <span className="text-cyan-300">({komponenta.status})</span></li>)}</ul>
      </div>
      <section className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Digitalni Brouvzer i igrice</h2>
        <p className="mt-2 text-sm text-slate-300">{status.digitalniBrouvzer.gamingIntegration}</p>
        <p className="mt-2 text-xs text-slate-400">{status.digitalniBrouvzer.naziv} v{status.digitalniBrouvzer.verzija} · {status.digitalniBrouvzer.ekstremniRezim} · aktivni moduli: {status.digitalniBrouvzer.aktivnihModula}/{status.digitalniBrouvzer.ukupnoModula}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={status.digitalniBrouvzer.browserUrl} className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-200">Otvori Digitalni Brouvzer</a>
          <a href={status.digitalniBrouvzer.gamingUrl} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Otvori gaming platformu</a>
        </div>
        <p className="mt-3 text-xs text-amber-100">{status.digitalniBrouvzer.napomena}</p>
      </section>
      <VrCapabilityCheck />
      {deploymenti && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Vercel deployment sažetak</h2>
        <p className="mt-2 text-sm text-amber-100">{deploymenti.napomena}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{deploymenti.deploymenti.map((deployment) => <li key={deployment.id} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200"><span className="font-semibold">{deployment.naziv}</span><span className="ml-2 text-cyan-300">{deployment.state}</span>{deployment.alert !== 'none' && <span className={deployment.alert === 'critical' ? 'ml-2 text-red-300' : 'ml-2 text-amber-300'}>{deployment.alert}</span>}<p className="mt-1 text-xs text-slate-400">{deployment.alertMessage ?? deployment.message}</p></li>)}</ul>
      </div>}
      {deploymenti && deploymenti.incidenti.length > 0 && <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/20 p-5">
        <h2 className="text-lg font-semibold text-red-100">Incident panel</h2>
        <p className="mt-2 text-sm text-red-200">Informativni pregled za ljudsku proveru. Panel ne pokreće deploy, obaveštenja niti izmene.</p>
        <div className="mt-4 grid gap-3">{deploymenti.incidenti.map((incident) => <article key={incident.platformId} className="rounded-lg bg-slate-900 p-4 text-sm text-slate-200"><p className="font-semibold">{incident.naziv} <span className="text-red-300">{incident.level}</span></p><p className="mt-1">{incident.message}</p><p className="mt-1 text-xs text-slate-400">Provereno: {new Date(incident.checkedAt).toLocaleString('sr-RS')}</p><p className="mt-2 text-xs text-amber-200">Pregled: {incident.reviewStatus} · Vlasnik: {incident.owner}</p><p className="mt-1 text-xs text-slate-300">{incident.note} {incident.nextAction}</p><ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-slate-300">{incident.checklist.map((stavka) => <li key={stavka}>{stavka}</li>)}</ol></article>)}</div>
      </div>}
      {monitoring && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Nadzor platformi</h2>
        <p className="mt-2 text-sm text-amber-100">{monitoring.napomena}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{monitoring.platforme.map((platforma) => <li key={platforma.id} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200"><span className="font-semibold">{platforma.naziv}</span><span className="ml-2 text-amber-300">{platforma.state}</span><p className="mt-1 text-xs text-slate-400">{platforma.alert}</p></li>)}</ul>
      </div>}
      {katalog && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Povezane platforme</h2>
        <p className="mt-2 text-sm text-amber-100">{katalog.napomena}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{katalog.platforme.map((platforma) => <a key={platforma.id} href={platforma.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 bg-slate-800 p-4 transition hover:border-cyan-400"><p className="font-semibold text-white">{platforma.naziv}</p><p className="mt-1 text-sm text-slate-300">{platforma.opis}</p><p className="mt-2 text-xs uppercase tracking-wide text-cyan-300">{platforma.kategorija}</p></a>)}</div>
      </div>}
    </section>
  );
}
