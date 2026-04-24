// Autofinish #984 — Dashboard VelocityWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishVelocityResult } from '@/lib/autofinish-petlja';

interface Props {
  velocity: AutofinishVelocityResult;
}

/**
 * VelocityWidget — prikazuje brzinu autofinish iteracija po danu/satu/sedmici.
 */
export function VelocityWidget({ velocity }: Props) {
  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Brzina autofinish iteracija"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">⚡ </span>Velocity — Brzina Iteracija
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Verzija <span className="text-white font-mono">{velocity.verzija}</span> —
        iteracija <span className="text-white font-mono">#{velocity.autofinishBroj}</span>
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="list">
        <div
          className="bg-gray-800/50 rounded-lg p-3 text-center"
          role="listitem"
          aria-label={`Brzina po satu: ${velocity.brzinaPoSatu} iteracija/sat`}
        >
          <dt className="text-xs text-gray-500 mb-1">Po Satu</dt>
          <dd className="text-2xl font-mono font-bold text-blue-400">{velocity.brzinaPoSatu}</dd>
          <div className="text-xs text-gray-600 mt-1">iteracija/sat</div>
        </div>

        <div
          className="bg-gray-800/50 rounded-lg p-3 text-center"
          role="listitem"
          aria-label={`Brzina po danu: ${velocity.brzinaPoSatima} iteracija/dan`}
        >
          <dt className="text-xs text-gray-500 mb-1">Po Danu</dt>
          <dd className="text-2xl font-mono font-bold text-green-400">{velocity.brzinaPoSatima}</dd>
          <div className="text-xs text-gray-600 mt-1">iteracija/dan</div>
        </div>

        <div
          className="bg-gray-800/50 rounded-lg p-3 text-center"
          role="listitem"
          aria-label={`Brzina po sedmici: ${velocity.brzinaPoSedmici} iteracija/sedmici`}
        >
          <dt className="text-xs text-gray-500 mb-1">Po Sedmici</dt>
          <dd className="text-2xl font-mono font-bold text-purple-400">{velocity.brzinaPoSedmici}</dd>
          <div className="text-xs text-gray-600 mt-1">iteracija/sedmici</div>
        </div>
      </dl>

      <p className="text-xs text-gray-500 mt-4 italic" role="note">
        {velocity.prognoza}
      </p>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-velocity"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi velocity podatke kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
