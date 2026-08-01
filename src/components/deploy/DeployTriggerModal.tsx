'use client';

/**
 * DeployTriggerModal — Confirmation modal pre pokretanja deploymenta
 *
 * Zahteva potvrdu korisnika, selekciju okruženja i (za production)
 * unos confirmToken-a.
 */

import { useState } from 'react';
import type { DeployEnvironment } from '@/lib/deploy/deploy-registry';

interface DeployTriggerModalProps {
  platformId: string;
  platformName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (environment: DeployEnvironment, confirmToken?: string) => Promise<void>;
}

const ENVIRONMENTS: { value: DeployEnvironment; label: string; icon: string }[] = [
  { value: 'dev', label: 'Dev', icon: '🔧' },
  { value: 'staging', label: 'Staging', icon: '🧪' },
  { value: 'production', label: 'Production', icon: '🚀' },
];

export default function DeployTriggerModal({
  platformId: _platformId,
  platformName,
  isOpen,
  onClose,
  onConfirm,
}: DeployTriggerModalProps) {
  const [environment, setEnvironment] = useState<DeployEnvironment>('staging');
  const [confirmToken, setConfirmToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleConfirm() {
    setError(null);
    if (environment === 'production' && confirmToken !== 'DEPLOY_PRODUCTION') {
      setError('Za production deploy unesite: DEPLOY_PRODUCTION');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(environment, confirmToken || undefined);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri pokretanju deploymenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deploy-modal-title"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
        <h2 id="deploy-modal-title" className="text-lg font-bold text-white mb-1">
          🚀 Pokreni Deploy
        </h2>
        <p className="text-zinc-400 text-sm mb-5">
          Platforma: <span className="text-white font-medium">{platformName}</span>
        </p>

        <div className="mb-4">
          <label className="block text-xs text-zinc-400 mb-2 font-medium">Okruženje</label>
          <div className="flex gap-2">
            {ENVIRONMENTS.map((env) => (
              <button
                key={env.value}
                type="button"
                onClick={() => setEnvironment(env.value)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  environment === env.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {env.icon} {env.label}
              </button>
            ))}
          </div>
        </div>

        {environment === 'production' && (
          <div className="mb-4">
            <label
              htmlFor="deploy-confirm-token"
              className="block text-xs text-red-400 mb-2 font-medium"
            >
              ⚠️ Production potvrda (unesite: DEPLOY_PRODUCTION)
            </label>
            <input
              id="deploy-confirm-token"
              type="text"
              value={confirmToken}
              onChange={(e) => setConfirmToken(e.target.value)}
              placeholder="DEPLOY_PRODUCTION"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
              autoComplete="off"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 transition-colors disabled:opacity-50"
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Deploy...' : '🚀 Pokreni'}
          </button>
        </div>
      </div>
    </div>
  );
}
