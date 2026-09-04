'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom Components
// Kompanija SPAJA — Digitalna Industrija

import React from 'react';
import { TELECOM_OPERATORS } from '@/lib/discount-telecom';
import type { TelecomRegion } from '@/lib/discount-telecom';

const REGION_COORDS: Record<TelecomRegion, { x: number; y: number; label: string }> = {
  EU:     { x: 48,  y: 28,  label: '🇪🇺 EU' },
  US:     { x: 20,  y: 32,  label: '🇺🇸 US' },
  APAC:   { x: 75,  y: 38,  label: '🌏 APAC' },
  LATAM:  { x: 26,  y: 58,  label: '🌎 LATAM' },
  Africa: { x: 50,  y: 58,  label: '🌍 Africa' },
  ME:     { x: 60,  y: 38,  label: '🕌 ME' },
};

/** Visual coverage map widget showing active operators per region. */
export function CoverageMapWidget() {
  const countsByRegion = Object.fromEntries(
    (Object.keys(REGION_COORDS) as TelecomRegion[]).map((r) => [
      r,
      TELECOM_OPERATORS.filter((op) => op.active && op.region === r).length,
    ])
  ) as Record<TelecomRegion, number>;

  return (
    <div className="coverage-map" aria-label="Global telecom coverage map">
      <h3 className="coverage-map__title">Global Network Coverage</h3>
      <svg
        viewBox="0 0 100 75"
        className="coverage-map__svg"
        role="img"
        aria-label="World map with telecom operator counts by region"
      >
        {/* Simple world outline placeholder */}
        <rect x="0" y="0" width="100" height="75" fill="#1a2035" rx="4" />

        {(Object.keys(REGION_COORDS) as TelecomRegion[]).map((region) => {
          const { x, y, label } = REGION_COORDS[region];
          const count = countsByRegion[region];
          return (
            <g key={region} className="coverage-map__region">
              <circle
                cx={x}
                cy={y}
                r={3 + count * 0.8}
                fill="#3b82f6"
                opacity={0.75}
                aria-label={`${label}: ${count} operators`}
              />
              <text
                x={x}
                y={y - 4 - count * 0.8}
                fontSize="3.5"
                fill="#e2e8f0"
                textAnchor="middle"
                className="coverage-map__label"
              >
                {label} ({count})
              </text>
            </g>
          );
        })}
      </svg>

      <div className="coverage-map__legend">
        {(Object.keys(REGION_COORDS) as TelecomRegion[]).map((region) => (
          <div key={region} className="coverage-map__legend-item">
            <span className="coverage-map__legend-dot" />
            {REGION_COORDS[region].label}: <strong>{countsByRegion[region]}</strong> operators
          </div>
        ))}
      </div>
    </div>
  );
}
