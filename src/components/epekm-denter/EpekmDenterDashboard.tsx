// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Status Dashboard Component
// Kompanija SPAJA — Digitalna Industrija
//
// Displays the current health and delivery status of the EPEKM-D module.

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { EpekmHealthReport } from '@/lib/epekm-denter';

interface DashboardState {
  health: EpekmHealthReport | null;
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

export function EpekmDenterDashboard() {
  const [state, setState] = useState<DashboardState>({
    health: null,
    loading: false,
    error: null,
    lastRefresh: null,
  });

  const fetchHealth = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/epekm-denter/health');
      const json = (await res.json()) as { data?: EpekmHealthReport; error?: string };
      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: json.error ?? 'Unknown error',
        }));
        return;
      }
      setState({
        health: json.data ?? null,
        loading: false,
        error: null,
        lastRefresh: new Date().toISOString(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Fetch failed',
      }));
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const { health, loading, error, lastRefresh } = state;

  return (
    <div className="epekm-denter-dashboard">
      <header className="epekm-denter-dashboard__header">
        <h2>EPEKM-D — Permanent Email Denter</h2>
        <span className="epekm-denter-dashboard__persona">
          Persona: epekm-denter-core · Octave 11 · Node 88
        </span>
        <button
          className="epekm-denter-dashboard__refresh-btn"
          onClick={() => void fetchHealth()}
          disabled={loading}
          type="button"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div className="epekm-denter-dashboard__error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {health && (
        <section className="epekm-denter-dashboard__health">
          <div className="epekm-denter-dashboard__status-badge" data-status={health.status}>
            {health.status === 'ok' ? '✅ OK' : '⚠️ Degraded'}
          </div>

          <dl className="epekm-denter-dashboard__stats">
            <div>
              <dt>Registered Identities</dt>
              <dd>{health.registeredIdentities}</dd>
            </div>
            <div>
              <dt>Active Identities</dt>
              <dd>{health.activeIdentities}</dd>
            </div>
            <div>
              <dt>Total Messages</dt>
              <dd>{health.totalMessages}</dd>
            </div>
            <div>
              <dt>Pending Deliveries</dt>
              <dd>{health.pendingDeliveries}</dd>
            </div>
            <div>
              <dt>Contract Version</dt>
              <dd>{health.contractVersion}</dd>
            </div>
            <div>
              <dt>Module Version</dt>
              <dd>{health.moduleVersion}</dd>
            </div>
          </dl>

          <p className="epekm-denter-dashboard__timestamp">
            Module timestamp: {health.timestamp}
          </p>
        </section>
      )}

      {lastRefresh && (
        <p className="epekm-denter-dashboard__last-refresh">
          Last refreshed: {lastRefresh}
        </p>
      )}
    </div>
  );
}

export default EpekmDenterDashboard;
