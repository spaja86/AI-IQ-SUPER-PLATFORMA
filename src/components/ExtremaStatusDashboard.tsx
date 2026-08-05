'use client';

import { useEffect, useState, useCallback } from 'react';

interface CatalogStats {
  total: number;
  byModule: Record<string, number>;
  bySeverity: Record<string, number>;
}

interface AuditLogEntry {
  timestamp: string;
  level: string;
  module: string;
  findingId: string;
  condition: string;
  remediation: string;
  value: unknown;
}

interface ReportData {
  generatedAt: string;
  totalEntries: number;
  showing: number;
  catalogStats: CatalogStats;
  entries: AuditLogEntry[];
}

interface DiagnosticsReport {
  generatedAt: string;
  module: string;
  totalFindings: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  status: 'OK' | 'DEGRADED' | 'CRITICAL';
  findings: {
    catalogEntry: { id: string; condition: string; remediation: string };
    detectedAt: string;
    value: unknown;
    module: string;
    severity: string;
  }[];
}

const MODULE_ICON: Record<string, string> = {
  gigatron: '🛒',
  'nova-generacija': '🎮',
  calculator: '🔢',
  'ci-cd': '🤖',
  network: '🌐',
  all: '🔬',
};

const SEVERITY_STYLE: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  INFO: 'bg-blue-100 text-blue-800 border-blue-300',
};

const STATUS_STYLE: Record<string, string> = {
  OK: 'text-green-600',
  DEGRADED: 'text-yellow-600',
  CRITICAL: 'text-red-600',
};

const STATUS_ICON: Record<string, string> = {
  OK: '✅',
  DEGRADED: '🟡',
  CRITICAL: '🔴',
};

export default function ExtremaStatusDashboard() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [lastScan, setLastScan] = useState<DiagnosticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (severityFilter) params.set('severity', severityFilter);
      const res = await fetch(`/api/diagnostics/extrema/report?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ReportData;
      setReportData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju izveštaja');
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  const runScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const body =
        activeModule === 'all'
          ? { module: 'all', inputsByModule: {} }
          : { module: activeModule, inputs: {} };

      const res = await fetch('/api/diagnostics/extrema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as DiagnosticsReport;
      setLastScan(data);
      await fetchReport();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri skeniranju');
    } finally {
      setScanning(false);
    }
  }, [activeModule, fetchReport]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  const modules = ['all', 'gigatron', 'nova-generacija', 'calculator', 'ci-cd', 'network'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🔬 Dijagnostika Ekstrimiteta Ekstrema</h1>
          <p className="text-sm text-gray-500 mt-1">
            Detekcija ekstremnih stanja u svim modulima — AI IQ SUPER PLATFORMA
          </p>
        </div>
        <button
          onClick={() => void runScan()}
          disabled={scanning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {scanning ? '⏳ Skeniranje...' : '▶ Pokreni dijagnostiku'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Catalog stats */}
      {reportData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold">{reportData.catalogStats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Katalog ekstrema</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {reportData.catalogStats.bySeverity?.CRITICAL ?? 0}
            </div>
            <div className="text-xs text-red-600 mt-1">🔴 CRITICAL</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {reportData.catalogStats.bySeverity?.WARNING ?? 0}
            </div>
            <div className="text-xs text-yellow-600 mt-1">🟡 WARNING</div>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-700">{reportData.totalEntries}</div>
            <div className="text-xs text-gray-500 mt-1">Audit log unosa</div>
          </div>
        </div>
      )}

      {/* Last scan result */}
      {lastScan && (
        <div className={`border rounded-lg p-4 ${lastScan.status === 'CRITICAL' ? 'bg-red-50 border-red-300' : lastScan.status === 'DEGRADED' ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-300'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{STATUS_ICON[lastScan.status]}</span>
            <span className={`font-bold ${STATUS_STYLE[lastScan.status]}`}>
              Poslednji scan: {lastScan.status}
            </span>
            <span className="text-xs text-gray-500 ml-auto">{lastScan.generatedAt}</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span>Ukupno: <strong>{lastScan.totalFindings}</strong></span>
            <span className="text-red-600">🔴 {lastScan.criticalCount}</span>
            <span className="text-yellow-600">🟡 {lastScan.warningCount}</span>
          </div>
          {lastScan.findings.length > 0 && (
            <div className="mt-3 space-y-2">
              {lastScan.findings.slice(0, 5).map((f, i) => (
                <div key={i} className={`text-xs border rounded px-3 py-2 ${SEVERITY_STYLE[f.severity] ?? 'bg-gray-50'}`}>
                  <span className="font-mono font-bold">{f.catalogEntry.id}</span>
                  {' · '}
                  {f.catalogEntry.condition}
                </div>
              ))}
              {lastScan.findings.length > 5 && (
                <div className="text-xs text-gray-500">
                  + još {lastScan.findings.length - 5} nalaza
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Module tabs + filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setActiveModule(m)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${activeModule === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
            >
              {MODULE_ICON[m] ?? '📦'} {m}
            </button>
          ))}
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="">Sve severity</option>
          <option value="CRITICAL">🔴 CRITICAL</option>
          <option value="WARNING">🟡 WARNING</option>
          <option value="INFO">🔵 INFO</option>
        </select>
      </div>

      {/* Audit log table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium">
            Audit log
            {reportData && (
              <span className="text-gray-500 font-normal ml-2">
                ({reportData.showing} od {reportData.totalEntries})
              </span>
            )}
          </span>
          <button
            onClick={() => void fetchReport()}
            disabled={loading}
            className="text-xs text-blue-600 hover:underline disabled:opacity-50"
          >
            {loading ? 'Učitavanje...' : '🔄 Osveži'}
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">⏳ Učitavanje...</div>
        ) : !reportData || reportData.entries.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            ✅ Nema zabeleženih ekstrema.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Vreme</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Modul</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Uslov</th>
                  <th className="px-4 py-3 text-left">Remedijacija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reportData.entries.map((entry, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString('sr-RS')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">
                      {entry.findingId}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {MODULE_ICON[entry.module] ?? '📦'} {entry.module}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${SEVERITY_STYLE[entry.level] ?? 'bg-gray-50'}`}>
                        {entry.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-xs truncate">
                      {entry.condition}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                      {entry.remediation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog coverage by module */}
      {reportData && (
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium mb-3">📋 Pokrivenost kataloga po modulu</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(reportData.catalogStats.byModule).map(([mod, count]) => (
              <div key={mod} className="text-center p-3 bg-gray-50 rounded-lg border">
                <div className="text-xl">{MODULE_ICON[mod] ?? '📦'}</div>
                <div className="text-lg font-bold mt-1">{count}</div>
                <div className="text-xs text-gray-500">{mod}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        AI IQ SUPER PLATFORMA — Kompanija SPAJA · Dijagnostika Ekstrimiteta Ekstrema
      </p>
    </div>
  );
}
