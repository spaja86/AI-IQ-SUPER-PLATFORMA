// Autofinish #996 — Dashboard DependencyWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishPodsistemiDependenciesResult } from '@/lib/autofinish-petlja';

interface Props {
  dependencies: AutofinishPodsistemiDependenciesResult;
}

/**
 * DependencyWidget — tabela zavisnosti između 9 OMEGA podsistema.
 */
export function DependencyWidget({ dependencies }: Props) {
  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Zavisnosti između OMEGA podsistema"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🔗 </span>Zavisnosti Podsistema
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-white font-mono">{dependencies.ukupnoPodsistema}</span> podsistema —
        verzija <span className="text-white font-mono">{dependencies.verzija}</span>
        {dependencies.imaKruznih && (
          <span className="text-red-400 ml-2" role="alert">⚠️ Kružne zavisnosti detektovane</span>
        )}
      </p>

      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          role="table"
          aria-label="Tabela zavisnosti podsistema"
        >
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-800">
              <th scope="col" className="pb-2 pr-4 font-medium">Podsistem</th>
              <th scope="col" className="pb-2 pr-4 font-medium">Ovisi o</th>
              <th scope="col" className="pb-2 font-medium">Zavisan od</th>
            </tr>
          </thead>
          <tbody>
            {dependencies.podsistemi.map((p) => (
              <tr key={p.id} className="border-b border-gray-800/50 last:border-0">
                <td className="py-2 pr-4 text-gray-300 font-medium whitespace-nowrap">{p.naziv}</td>
                <td className="py-2 pr-4 text-gray-500 text-xs">
                  {p.ovisiO.length === 0 ? (
                    <span className="text-gray-600 italic">—</span>
                  ) : (
                    p.ovisiO.join(', ')
                  )}
                </td>
                <td className="py-2 text-gray-500 text-xs">
                  {p.zavisniOd.length === 0 ? (
                    <span className="text-gray-600 italic">—</span>
                  ) : (
                    p.zavisniOd.join(', ')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-dependencies"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi dependency podatke kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
