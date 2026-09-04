/**
 * DeployKpiPanel — panel sa ključnim deployment KPI-jevima
 */

interface KpiRow {
  naziv: string;
  cilj: string;
  alertPrag: string;
  owner: string;
}

interface DeployKpiPanelProps {
  kpis?: KpiRow[];
}

const defaultKpis: KpiRow[] = [
  { naziv: 'API latency p95', cilj: '≤ 300ms', alertPrag: '> 2s', owner: 'Platform Ops' },
  { naziv: 'Nova Generacija eval p99', cilj: '≤ 50ms', alertPrag: '> 100ms', owner: 'AI Engine' },
  { naziv: 'Uptime SLA', cilj: '≥ 99.99%', alertPrag: '< 99%', owner: 'Operations' },
  { naziv: 'Build duration', cilj: '≤ 3 min', alertPrag: '> 10 min', owner: 'CI / Platform Ops' },
  { naziv: 'Cold start p95', cilj: '≤ 1.5s', alertPrag: '> 3s', owner: 'Platform Ops' },
  { naziv: 'Error rate', cilj: '< 0.1%', alertPrag: '> 1%', owner: 'CI / Release Ops' },
  { naziv: 'Gaming session completion', cilj: '≥ 95%', alertPrag: '< 80%', owner: 'Gaming' },
  { naziv: 'Checkout fail rate', cilj: '< 2%', alertPrag: '> 5%', owner: 'Billing' },
];

export default function DeployKpiPanel({ kpis = defaultKpis }: DeployKpiPanelProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700/60 bg-zinc-900/80">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-700/60 bg-zinc-800/60 text-xs uppercase text-zinc-400">
          <tr>
            <th className="px-4 py-3">KPI</th>
            <th className="px-4 py-3">Ciljna vrednost</th>
            <th className="px-4 py-3">Alert prag</th>
            <th className="px-4 py-3">Owner</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi, i) => (
            <tr
              key={kpi.naziv}
              className={`border-t border-zinc-800/60 transition-colors hover:bg-zinc-800/40 ${i % 2 === 0 ? 'bg-zinc-900/40' : 'bg-zinc-900/20'}`}
            >
              <td className="px-4 py-3 font-medium text-zinc-200">{kpi.naziv}</td>
              <td className="px-4 py-3 font-mono text-green-400">{kpi.cilj}</td>
              <td className="px-4 py-3 font-mono text-red-400">{kpi.alertPrag}</td>
              <td className="px-4 py-3 text-zinc-400">{kpi.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
