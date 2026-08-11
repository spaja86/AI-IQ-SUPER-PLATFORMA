'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR SustainabilityWidget
// Kompanija SPAJA — Digitalna Industrija

import React from 'react';

interface SustainabilityWidgetProps {
  score: number;
  className?: string;
}

function getColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 50) return '#f59e0b'; // yellow
  return '#ef4444';                  // red
}

function getLabel(score: number): string {
  if (score >= 80) return 'Eco-Friendly';
  if (score >= 50) return 'Moderate';
  return 'Low Sustainability';
}

/** Color-coded sustainability score bar (0–100). */
export function SustainabilityWidget({ score, className = '' }: SustainabilityWidgetProps) {
  const color = getColor(score);
  const label = getLabel(score);
  const pct = Math.max(0, Math.min(100, score));

  return (
    <div className={`flex flex-col gap-1 ${className}`} aria-label={`Sustainability score: ${score}/100`}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Sustainability</span>
        <span style={{ color }} className="font-semibold">{score}/100</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-xs font-medium" style={{ color }}>{label}</div>
    </div>
  );
}
