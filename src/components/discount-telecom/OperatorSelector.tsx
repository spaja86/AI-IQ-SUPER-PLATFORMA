'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom Components
// Kompanija SPAJA — Digitalna Industrija

import React, { useState, useMemo } from 'react';
import { TELECOM_OPERATORS } from '@/lib/discount-telecom';
import type { TelecomOperator, TelecomRegion } from '@/lib/discount-telecom';

interface OperatorSelectorProps {
  value: string;
  onChange: (operatorId: string) => void;
}

const REGION_LABELS: Record<TelecomRegion, string> = {
  EU: '🇪🇺 Europe',
  US: '🇺🇸 United States',
  APAC: '🌏 Asia-Pacific',
  LATAM: '🌎 Latin America',
  Africa: '🌍 Africa',
  ME: '🕌 Middle East',
};

/** Searchable operator selector grouped by region. */
export function OperatorSelector({ value, onChange }: OperatorSelectorProps) {
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const active = TELECOM_OPERATORS.filter(
      (op) =>
        op.active &&
        (op.name.toLowerCase().includes(q) ||
          op.countries.some((c) => c.toLowerCase().includes(q)))
    );
    const groups: Partial<Record<TelecomRegion, TelecomOperator[]>> = {};
    for (const op of active) {
      if (!groups[op.region]) groups[op.region] = [];
      groups[op.region]!.push(op);
    }
    return groups;
  }, [search]);

  const regions = Object.keys(grouped) as TelecomRegion[];

  return (
    <div className="operator-selector">
      <input
        type="text"
        placeholder="Search operator or country…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="operator-selector__search"
        aria-label="Search telecom operator"
      />
      <div className="operator-selector__list" role="listbox" aria-label="Telecom operators">
        {regions.length === 0 && (
          <p className="operator-selector__empty">No operators found.</p>
        )}
        {regions.map((region) => (
          <div key={region} className="operator-selector__group">
            <div className="operator-selector__group-label">{REGION_LABELS[region]}</div>
            {grouped[region]!.map((op) => (
              <button
                key={op.id}
                type="button"
                role="option"
                aria-selected={value === op.id}
                className={`operator-selector__item${value === op.id ? ' operator-selector__item--selected' : ''}`}
                onClick={() => onChange(op.id)}
              >
                <span className="operator-selector__item-name">{op.name}</span>
                <span className="operator-selector__item-meta">
                  {op.countries.slice(0, 5).join(', ')}
                  {op.countries.length > 5 ? ` +${op.countries.length - 5}` : ''}
                  {' · '}
                  {op.networkTypes.join('/')}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
