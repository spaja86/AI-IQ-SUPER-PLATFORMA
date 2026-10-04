'use client';
import { useState } from 'react';
import { summarizeLocalEvidence } from '@/lib/local-evidence-display';

export default function LocalEvidencePanel() {
  const [report, setReport] = useState<ReturnType<typeof summarizeLocalEvidence> | null>(null);
  const [error, setError] = useState('');
  async function load(file?: File) {
    setReport(null); setError('');
    if (!file) return;
    try {
      if (file.size > 65536) throw new Error('Report too large');
      setReport(summarizeLocalEvidence(await file.text()));
    } catch { setError('Nevalidan ili prevelik izveštaj.'); }
  }
  return <section className="mx-auto max-w-5xl p-6" aria-labelledby="local-evidence-heading">
    <h2 id="local-evidence-heading">Lokalni izveštaj provera</h2>
    <p>Fajl se čita samo u browseru, bez slanja serveru. JSON nije potpisan; nema potvrde autentičnosti niti poređenja sa trenutnim deploymentom.</p>
    <label>Izaberi izveštaj v2 (do 64 KiB) <input type="file" accept="application/json,.json" onChange={event => { void load(event.target.files?.[0]); }} /></label>
    <p role="status" aria-live="polite">{error}</p>
    {report && <div>
      <p>Status: {report.status}. trusted=false; izvršavanje isključeno.</p>
      <p>Prijavljena revizija: <code>{report.revision}</code></p>
      <p>Prijavljeno vreme: {report.finishedAt}</p>
      <table><thead><tr><th>Provera</th><th>Prijavljen rezultat</th><th>Exit</th><th>ms</th></tr></thead>
        <tbody>{report.rows.map((row: {name: string;status: string;exitCode: number|null;durationMs: number}) => <tr key={row.name}><td>{row.name}</td><td>{row.status}</td><td>{row.exitCode ?? '—'}</td><td>{row.durationMs}</td></tr>)}</tbody></table>
      <p>Ovaj izveštaj ne potvrđuje Java/Next build i ne odobrava deployment.</p>
    </div>}
  </section>;
}
