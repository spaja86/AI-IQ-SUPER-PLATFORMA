'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Digit Engine Card Component
// Kompanija SPAJA — Digitalna Industrija

import { useState } from 'react';
import type { DigitDescriptor } from '@/lib/digit-engine';
import { getDigitDescriptor } from '@/lib/digit-engine';

interface DigitEngineCardProps {
  digit?: number;
  className?: string;
}

export function DigitEngineCard({ digit = 0, className = '' }: DigitEngineCardProps) {
  const [selectedDigit, setSelectedDigit] = useState<number>(digit);
  const descriptor: DigitDescriptor | undefined = getDigitDescriptor(selectedDigit);

  return (
    <section className={`rounded-xl border border-violet-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase text-violet-300">Digit Intelligence Engine</h3>

      {/* Digit selector */}
      <div className="mt-3 flex gap-1 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelectedDigit(i)}
            className={`w-8 h-8 rounded text-sm font-mono font-bold transition-colors ${
              selectedDigit === i
                ? 'bg-violet-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      {descriptor ? (
        <div className="mt-3 space-y-1 text-sm">
          <p><span className="text-slate-400">Naziv:</span> <strong>{descriptor.name}</strong></p>
          <p><span className="text-slate-400">Uloga:</span> {descriptor.role}</p>
          <p><span className="text-slate-400">Node:</span> <strong>{descriptor.hipermrezaNode}</strong></p>
          <p><span className="text-slate-400">Oktava:</span> <strong>{descriptor.octave}</strong></p>
        </div>
      ) : (
        <p className="mt-2 text-xs text-red-400">Cifra {selectedDigit} nije pronađena.</p>
      )}
    </section>
  );
}
