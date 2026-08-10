'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom Components
// Kompanija SPAJA — Digitalna Industrija

import React from 'react';
import type { DiscountCalculationResult } from '@/lib/discount-telecom';

interface DiscountBreakdownCardProps {
  result: DiscountCalculationResult;
}

/** Shows applied discounts, stacking, and final net price. */
export function DiscountBreakdownCard({ result }: DiscountBreakdownCardProps) {
  const baseMajor = (result.basePriceCents / 100).toFixed(2);

  return (
    <div className="discount-card" aria-label="Discount breakdown">
      <div className="discount-card__header">
        <span className="discount-card__operator">{result.operatorId}</span>
        <span
          className={`discount-card__status discount-card__status--${result.valid ? 'valid' : 'invalid'}`}
        >
          {result.valid ? '✅ Valid' : '❌ Invalid'}
        </span>
      </div>

      <div className="discount-card__prices">
        <div className="discount-card__price-row">
          <span>Base price</span>
          <span>
            {baseMajor} {result.currency}
          </span>
        </div>

        {result.appliedDiscounts.length > 0 && (
          <div className="discount-card__discounts">
            {result.appliedDiscounts.map((d) => (
              <div key={d.discountId} className="discount-card__discount-item">
                <span className="discount-card__discount-type">[{d.type}]</span>
                <span className="discount-card__discount-desc">{d.description}</span>
                <span className="discount-card__discount-value">−{d.valuePercent}%</span>
              </div>
            ))}
            <div className="discount-card__total-discount">
              <span>Total discount</span>
              <span>−{result.totalDiscountPercent}%</span>
            </div>
          </div>
        )}

        <div className="discount-card__price-row discount-card__price-row--net">
          <span>Net price</span>
          <strong>
            {result.netPriceMajor.toFixed(2)} {result.currency}
          </strong>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <ul className="discount-card__warnings" aria-label="Warnings">
          {result.warnings.map((w, i) => (
            <li key={i} className="discount-card__warning">
              ⚠️ {w}
            </li>
          ))}
        </ul>
      )}

      <div className="discount-card__meta">
        Calculated in {result.durationMs}ms
      </div>
    </div>
  );
}
