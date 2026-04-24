// Autofinish #925 — Milestone Detail Modal (Client Component)
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React, { useState } from 'react';
import type { AutofinishMilestoneDetailResult, AutofinishMilestoneStatus } from '@/lib/autofinish-petlja';

interface RoadmapMilestone {
  naziv: string;
  opis: string;
  status: AutofinishMilestoneStatus;
  autofinishOd: number;
  autofinishDo: number;
}

interface Props {
  milestones: RoadmapMilestone[];
  milestoneDetails: Record<string, AutofinishMilestoneDetailResult | null>;
  progres: number;
  done: number;
  ukupno: number;
}

function toSlug(naziv: string): string {
  return naziv.toLowerCase().replace(/\s+/g, '-');
}

export function RoadmapWithModal({ milestones, milestoneDetails, progres, done, ukupno }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedDetail = selectedId ? milestoneDetails[selectedId] : null;

  function closeModal() {
    setSelectedId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedId(id);
    }
  }

  return (
    <>
      <section
        className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
        aria-label="Autofinish roadmap milestones"
      >
        <h2 className="text-lg font-semibold text-gray-300 mb-1">
          <span aria-hidden="true">🗺️ </span>Roadmap
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Progres: <span className="text-white font-mono">{progres}%</span>
          {' '}({done}/{ukupno} završeno) — klikni na milestone za detalje
        </p>
        <div className="overflow-x-auto" role="region" aria-label="Milestones tabla">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="pb-2 pr-4 font-medium" scope="col">Naziv</th>
                <th className="pb-2 pr-4 font-medium hidden sm:table-cell" scope="col">Raspon</th>
                <th className="pb-2 font-medium" scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => {
                const slug = toSlug(m.naziv);
                return (
                  <tr
                    key={m.naziv}
                    className="border-b border-gray-800 last:border-0 cursor-pointer hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 transition-colors"
                    onClick={() => setSelectedId(slug)}
                    onKeyDown={(e) => handleKeyDown(e, slug)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Otvori detalje za milestone: ${m.naziv}`}
                  >
                    <td className="py-2 pr-4">
                      <div className="text-white font-medium underline decoration-dotted">{m.naziv}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{m.opis}</div>
                    </td>
                    <td className="py-2 pr-4 text-gray-400 font-mono text-xs hidden sm:table-cell">
                      #{m.autofinishOd}–#{m.autofinishDo}
                    </td>
                    <td className="py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          m.status === 'done'
                            ? 'bg-green-900 text-green-300'
                            : m.status === 'active'
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                        aria-label={`Status: ${m.status}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-right">
          <a
            href="/api/autofinish-roadmap"
            className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            aria-label="Preuzmi roadmap kao JSON"
          >
            JSON API →
          </a>
        </div>
      </section>

      {/* #925 — Milestone Detail Modal */}
      {selectedId && selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalji milestone-a: ${selectedDetail.naziv}`}
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedDetail.naziv}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{selectedDetail.opis}</p>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 mt-0.5 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                aria-label="Zatvori modal"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 text-sm">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  selectedDetail.status === 'done'
                    ? 'bg-green-900 text-green-300'
                    : selectedDetail.status === 'active'
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {selectedDetail.status}
              </span>
              <span className="text-gray-500 font-mono text-xs">
                #{selectedDetail.autofinishOd}–#{selectedDetail.autofinishDo}
              </span>
              <span className="text-gray-500 text-xs">
                {selectedDetail.ukupnoIteracija} iteracija
              </span>
            </div>

            {selectedDetail.iteracije.length > 0 ? (
              <ul className="space-y-1.5" role="list" aria-label="Iteracije unutar milestone-a">
                {selectedDetail.iteracije.map((it) => (
                  <li key={it.broj} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-500 font-mono min-w-[2.5rem]">#{it.broj}</span>
                    <span className="text-gray-300">{it.opis}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Nema upisanih iteracija za ovaj milestone.</p>
            )}

            <div className="mt-4 pt-3 border-t border-gray-800 text-right">
              <a
                href={`/api/autofinish-milestone/${selectedId}`}
                className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                aria-label="Preuzmi detalje milestone-a kao JSON"
                target="_blank"
                rel="noopener noreferrer"
              >
                JSON API →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
