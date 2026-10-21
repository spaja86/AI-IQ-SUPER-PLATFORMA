'use client';

import { useState } from 'react';
import { expandOmegaItem, type OmegaItem } from '@/lib/omegatrojektorijum';

export default function IdeaCard({ item }: { item: OmegaItem }) {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={event => setOpen(event.currentTarget.open)} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <summary className="cursor-pointer font-semibold">{item.id} · {item.domain} — {item.title}</summary>
      {open ? <>
        <p className="my-3 text-slate-300">Cilj: {item.goal}. Status: ideja.</p>
        <ol className="list-decimal space-y-4 pl-6">{expandOmegaItem(item).concepts.map(concept => (
          <li key={concept.id}><strong>{concept.id} · {concept.title}</strong><p className="text-sm text-slate-300">{concept.proposal}</p></li>
        ))}</ol>
      </> : null}
    </details>
  );
}

