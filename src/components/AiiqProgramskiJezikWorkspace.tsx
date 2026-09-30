'use client';

import { useEffect, useState } from 'react';

type ApiResult = {
  valid: boolean;
  status: string;
  recommendedAction: string;
  overallScore?: number;
  readinessScore?: number;
  warnings: string[];
  compiledProgram?: string;
  integrationProfile: {
    dokDikDakDukConsistencyHealth: {
      deterministicFallbackRequired: boolean;
      promotionFreeze: boolean;
    };
  };
};

type EpilogijaCovecnosti = {
  title: string;
  canonicalNarrativeId: string;
  interpretation: string;
  packageOutputs: { masterEpilog: string; auditShortSummary: string; governanceChecklistStatus: string };
  imageToSignalProfile: { signalOutputs: { readinessStatus: string; deterministicFallbackRequired: boolean } };
};

const DEFAULT_SOURCE = `INTENT: Objasni VRH status
RULE: Koristi postojeće EXTREM i EXTRONDOL izvore
AI: read-only interpretacija
ORCHESTRATE: deterministic review
OUTPUT: audit-safe summary
NO_SECRET: true`;

function ResultPanel({ title, result }: { title: string; result: ApiResult | null }) {
  if (!result) return null;

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
        <p><span className="text-slate-400">Status: </span><span className="font-semibold text-cyan-200">{result.status}</span></p>
        <p><span className="text-slate-400">Preporuka: </span><span className="font-semibold text-cyan-200">{result.recommendedAction}</span></p>
        <p><span className="text-slate-400">Rezultat: </span><span className="font-semibold text-cyan-200">{result.overallScore ?? result.readinessScore ?? '—'}</span></p>
      </div>
      <p className="mt-3 text-xs text-slate-400">Fallback: {String(result.integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired)} · Promotion freeze: {String(result.integrationProfile.dokDikDakDukConsistencyHealth.promotionFreeze)}</p>
      {result.warnings.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-100">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
      {result.compiledProgram && <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-cyan-100">{result.compiledProgram}</pre>}
    </section>
  );
}

export default function AiiqProgramskiJezikWorkspace() {
  const [goal, setGoal] = useState('Read-only pregled VRH PROGRAMSKOG EKVILADENTA i MARKAN statusa');
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [mode, setMode] = useState<'DETERMINISTIC_ONLY' | 'HYBRID' | 'AI_NATIVE'>('DETERMINISTIC_ONLY');
  const [evaluateResult, setEvaluateResult] = useState<ApiResult | null>(null);
  const [compileResult, setCompileResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'evaluate' | 'compile' | null>(null);
  const [epilog, setEpilog] = useState<EpilogijaCovecnosti | null>(null);
  const [epilogError, setEpilogError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/extrimli/extrondol')
      .then(async (response) => {
        const payload = await response.json() as { data?: { spajaKod?: { epilogijaCovecnosti?: EpilogijaCovecnosti } } };
        if (!response.ok || !payload.data?.spajaKod?.epilogijaCovecnosti) throw new Error('EPILOG nije dostupan.');
        setEpilog(payload.data.spajaKod.epilogijaCovecnosti);
      })
      .catch((requestError: unknown) => setEpilogError(requestError instanceof Error ? requestError.message : 'EPILOG nije dostupan.'));
  }, []);

  async function request(path: string, body: Record<string, unknown>): Promise<ApiResult> {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await response.json() as { data?: ApiResult; error?: { message?: string } | string };
    if (!response.ok || !payload.data) {
      const message = typeof payload.error === 'string' ? payload.error : payload.error?.message;
      throw new Error(message ?? 'Evaluacija nije dostupna.');
    }
    return payload.data;
  }

  async function evaluate() {
    setLoading('evaluate');
    setError(null);
    try {
      setEvaluateResult(await request('/api/ai-iq-programski-jezik/evaluate', {
        referenceId: 'vrh-workspace', goal, mode,
        promptComplexity: 40, ruleCoverage: 90, orchestrationReadiness: 82,
        autonomyLevel: 0, riskLevel: 0, explainabilityNeed: 90,
        securityPolicyScore: 95, fallbackConfigured: true,
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Evaluacija nije dostupna.');
    } finally {
      setLoading(null);
    }
  }

  async function compile() {
    setLoading('compile');
    setError(null);
    try {
      setCompileResult(await request('/api/ai-iq-programski-jezik/compile', {
        referenceId: 'vrh-workspace', source, targetMode: mode,
        strictSecurity: true, featureFlagAiIqLanguage: false,
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Kompajliranje nije dostupno.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Read-only workspace</p>
          <h1 className="mt-2 text-3xl font-bold">AI IQ Programski Jezik</h1>
          <p className="mt-3 text-slate-300">DSL evaluacija i kompajliranje koriste postojeće ugovore. Rezultati ne pokreću deploy, automatizaciju ni upis podataka.</p>
        </header>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <label htmlFor="aiiq-goal" className="block text-sm font-medium text-slate-200">Cilj evaluacije</label>
            <input id="aiiq-goal" value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" />
            <label htmlFor="aiiq-mode" className="mt-4 block text-sm font-medium text-slate-200">Režim</label>
            <select id="aiiq-mode" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className="mt-2 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white">
              <option value="DETERMINISTIC_ONLY">DETERMINISTIC_ONLY</option><option value="HYBRID">HYBRID</option><option value="AI_NATIVE">AI_NATIVE</option>
            </select>
            <button type="button" onClick={evaluate} disabled={loading !== null || goal.trim().length === 0} className="mt-5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading === 'evaluate' ? 'Evaluacija...' : 'Evaluiraj'}</button>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <label htmlFor="aiiq-source" className="block text-sm font-medium text-slate-200">AI IQ DSL program</label>
            <textarea id="aiiq-source" value={source} onChange={(event) => setSource(event.target.value)} rows={10} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-cyan-100" />
            <button type="button" onClick={compile} disabled={loading !== null || source.trim().length === 0} className="mt-5 rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-200 disabled:opacity-50">{loading === 'compile' ? 'Kompajliranje...' : 'Kompajliraj'}</button>
          </div>
        </section>
        {error && <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-200">{error}</p>}
        <section className="rounded-xl border border-cyan-500/30 bg-slate-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Audit-safe narrative</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{epilog?.title ?? 'EPILOGIJA ČOVEČANSTVA'}</h2>
          {epilogError && <p className="mt-3 text-sm text-amber-100">{epilogError}</p>}
          {epilog && <>
            <p className="mt-3 text-sm text-slate-300">{epilog.interpretation}</p>
            <p className="mt-3 text-xs text-slate-400">Narativ: {epilog.canonicalNarrativeId} · Status: {epilog.imageToSignalProfile.signalOutputs.readinessStatus} · Fallback: {String(epilog.imageToSignalProfile.signalOutputs.deterministicFallbackRequired)}</p>
            <p className="mt-4 text-sm text-cyan-100">{epilog.packageOutputs.auditShortSummary}</p>
            <p className="mt-2 text-xs text-amber-100">{epilog.packageOutputs.governanceChecklistStatus}</p>
          </>}
        </section>

        <ResultPanel title="Evaluacija" result={evaluateResult} />
        <ResultPanel title="Kompajliranje" result={compileResult} />
      </div>
    </main>
  );
}
