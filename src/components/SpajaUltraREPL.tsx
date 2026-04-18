'use client';

import { useMemo, useState } from 'react';
import { createRuntime, parseSpajaUltra, transpile, type ASTNode, type AuditRecord } from '@/lib/spaja-ultra-core';

const DEFAULT_CODE = `MOŽE: pristup_sistemu
MOŽE: upravljanje_korisnicima
ŽELIM: da pokrenem analizu
DO: ECHO Sistem se pokreće...
WAIT: 500
ASSERT: korisnik_ima_pravo == true
PRIV: user
DO: ECHO Sve dozvole potvrđene!
ŽELIM: da sačuvam rezultate
DO: ECHO Sesija završena uspešno.`;

const DEFAULT_CTX = {
  roles: ['user'],
  korisnik_ima_pravo: true,
  vreme: new Date().getHours(),
};

type RuntimeCommand = 'moze' | 'zelim' | 'do' | 'wait' | 'assert' | 'priv';

function resolveRuntimeCall(node: ASTNode): { method: RuntimeCommand; arg: string } {
  const upper = node.name.toLocaleUpperCase('sr-RS');
  const arg = node.args.join(' ');

  if (upper === 'MOŽE' || upper === 'MOZE') return { method: 'moze', arg };
  if (upper === 'ŽELIM' || upper === 'ZELIM') return { method: 'zelim', arg };
  if (upper === 'DO') return { method: 'do', arg };
  if (upper === 'WAIT') return { method: 'wait', arg };
  if (upper === 'ASSERT') return { method: 'assert', arg };
  if (upper === 'PRIV') return { method: 'priv', arg };
  if (upper === 'ECHO') return { method: 'do', arg: `ECHO ${arg}`.trim() };

  throw new Error(`Nepodržana naredba: ${node.name}`);
}

export default function SpajaUltraREPL() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [ctxJson, setCtxJson] = useState<string>(() => JSON.stringify(DEFAULT_CTX, null, 2));
  const [output, setOutput] = useState<string[]>([]);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [latestAst, setLatestAst] = useState<ASTNode[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const astJson = useMemo(() => JSON.stringify(latestAst, null, 2), [latestAst]);

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    const runtime = createRuntime();

    try {
      const ast = parseSpajaUltra(code);
      transpile(ast);
      setLatestAst(ast);

      const parsedValue = JSON.parse(ctxJson) as unknown;
      if (typeof parsedValue !== 'object' || parsedValue === null || Array.isArray(parsedValue)) {
        throw new Error('Runtime ctx mora biti JSON objekat.');
      }

      const parsedCtx = parsedValue as Record<string, unknown>;
      const executionOutput: string[] = [];

      const executionCtx = {
        ...parsedCtx,
        onOutput: (line: string) => executionOutput.push(line),
      };

      for (const node of ast) {
        const { method, arg } = resolveRuntimeCall(node);
        const callable = runtime[method];
        if (typeof callable !== 'function') {
          throw new Error(`Runtime metoda nije dostupna: ${String(method)}`);
        }

        await callable.call(runtime, arg, executionCtx);
      }

      setOutput(executionOutput.length > 0 ? executionOutput : ['✅ Izvršavanje završeno bez output poruka.']);
      setAuditLog(runtime.getAuditLog());
    } catch (e) {
      setOutput([]);
      setAuditLog(runtime.getAuditLog());
      setError(e instanceof Error ? e.message : 'Nepoznata greška pri izvršavanju.');
    } finally {
      setIsRunning(false);
    }
  };

  const clearAll = () => {
    setOutput([]);
    setAuditLog([]);
    setError('');
    setLatestAst([]);
  };

  const copyAst = async () => {
    try {
      await navigator.clipboard.writeText(astJson);
      setError('');
    } catch {
      setError('Clipboard nije dostupan u ovom okruženju.');
    }
  };

  const exportAudit = () => {
    const blob = new Blob([JSON.stringify(auditLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `spaja-audit-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-gray-800 bg-black p-6 text-gray-100 shadow-xl shadow-black/50">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="spaja-ultra-kod" className="mb-2 block text-sm font-medium text-gray-300">SpajaUltra kod</label>
          <textarea
            id="spaja-ultra-kod"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            rows={14}
            className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 font-mono text-sm text-green-300 focus:border-[#e84393] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="spaja-ultra-ctx" className="mb-2 block text-sm font-medium text-gray-300">Runtime ctx (JSON)</label>
          <textarea
            id="spaja-ultra-ctx"
            value={ctxJson}
            onChange={(event) => setCtxJson(event.target.value)}
            rows={14}
            className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 font-mono text-sm text-gray-200 focus:border-[#e84393] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runCode}
          disabled={isRunning}
          className="rounded-lg bg-[#e84393] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff5ca9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          ▶ Pokreni
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
        >
          🗑 Obriši
        </button>
        <button
          type="button"
          onClick={copyAst}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
        >
          📋 Kopiraj AST
        </button>
        <button
          type="button"
          onClick={exportAudit}
          disabled={auditLog.length === 0}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-50"
        >
          📥 Eksport JSON
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/60 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-200">Output</h3>
          <div className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {output.length === 0 ? (
              <p className="text-gray-500">Nema output-a.</p>
            ) : (
              output.map((line, index) => (
                <p key={`${line}-${index}`} className="text-green-400">{line}</p>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-200">Audit Log</h3>
          <div className="max-h-64 space-y-2 overflow-y-auto text-xs">
            {auditLog.length === 0 ? (
              <p className="text-gray-500">Audit log je prazan.</p>
            ) : (
              auditLog.map((record) => (
                <div
                  key={record.id}
                  className={`rounded-lg border px-3 py-2 ${record.status === 'ok'
                    ? 'border-green-800 bg-green-950/30 text-green-300'
                    : 'border-red-800 bg-red-950/30 text-red-300'}`}
                >
                  <p><strong>{record.cmd}</strong>: {record.arg || '—'}</p>
                  <p>{record.timestamp}</p>
                  <p>Status: {record.status}{record.duration !== undefined ? ` · ${record.duration}ms` : ''}</p>
                  {record.message && <p>Poruka: {record.message}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
