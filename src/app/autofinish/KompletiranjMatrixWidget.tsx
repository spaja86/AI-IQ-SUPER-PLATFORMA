// Autofinish #1009 — Dashboard KompletiranjMatrixWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishKompletiranjMatrixResult } from '@/lib/autofinish-petlja';

interface Props { matrix: AutofinishKompletiranjMatrixResult; }

function cellColor(v: number): string {
  if (v === 100) return 'bg-green-900/60 text-green-300';
  if (v >= 90) return 'bg-blue-900/40 text-blue-300';
  if (v >= 75) return 'bg-yellow-900/30 text-yellow-300';
  return 'bg-red-900/30 text-red-300';
}

export function KompletiranjMatrixWidget({ matrix }: Props) {
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800 overflow-x-auto" aria-label="Matrica završenosti podsistema">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🔢 </span>Kompletiranje Matrix</h2>
      <p className="text-sm text-gray-500 mb-4"><span className="text-white font-mono">{matrix.dimenzija}×{matrix.dimenzija}</span> matrica — verzija <span className="text-white font-mono">{matrix.verzija}</span></p>
      <table className="text-xs border-collapse" role="grid" aria-label={`${matrix.dimenzija}x${matrix.dimenzija} kompletiranje matrica`}>
        <thead>
          <tr>
            <th scope="col" className="w-20 p-1 text-gray-600"></th>
            {matrix.kolone.map((k) => (<th key={k} scope="col" className="p-1 text-gray-500 font-normal text-center whitespace-nowrap" style={{writingMode:'vertical-lr',transform:'rotate(180deg)',height:'5rem'}}>{k}</th>))}
          </tr>
        </thead>
        <tbody>
          {matrix.matrica.map((red, i) => (
            <tr key={matrix.redovi[i]}>
              <th scope="row" className="p-1 text-gray-400 font-normal text-right whitespace-nowrap pr-2">{matrix.redovi[i]}</th>
              {red.map((cell, j) => (
                <td key={j} className={`p-1 text-center font-mono w-10 h-8 rounded ${cellColor(cell.vrijednost)}`} title={cell.opisano} aria-label={cell.opisano}>{cell.vrijednost}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-right"><a href="/api/autofinish-kompletiranje-matrix" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
