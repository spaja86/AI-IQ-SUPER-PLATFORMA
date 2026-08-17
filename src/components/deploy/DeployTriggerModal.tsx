'use client';

/**
 * DeployTriggerModal — Confirmation modal pre pokretanja deploymenta
 *
 * Zahteva potvrdu korisnika, selekciju okruženja i (za production)
 * unos confirmToken-a.
 */

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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
      aria-describedby="deploy-modal-description"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
        <h2 id="deploy-modal-title" className="text-lg font-bold text-white mb-1">
          🚀 Pokreni Deploy
        </h2>
        <p id="deploy-modal-description" className="text-zinc-400 text-sm mb-5">
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
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
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
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
            className="flex-1 rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '⏳ Deploy...' : '🚀 Pokreni'}
          </button>
        </div>
      </div>
    </div>
  );
}
