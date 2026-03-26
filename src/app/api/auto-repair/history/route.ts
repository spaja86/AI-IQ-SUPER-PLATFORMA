import { NextResponse } from 'next/server';
import { createHistoryEntry } from '@/lib/auto-repair/upgrade-engine';

/**
 * GET /api/auto-repair/history — Istorija auto-popravki
 */
export async function GET() {
  // In a production system this would read from a database.
  // Here we generate a demonstration history showing the system's evolution.
  const history = [
    createHistoryEntry('diagnostic', 0, 85, 11, 3, 0),
    createHistoryEntry('repair', 85, 95, 11, 3, 3),
    createHistoryEntry('upgrade', 95, 100, 11, 1, 1),
  ];

  // Override timestamps for demo purposes
  const now = Date.now();
  history[0] = { ...history[0], timestamp: new Date(now - 86400000).toISOString() };
  history[1] = { ...history[1], timestamp: new Date(now - 43200000).toISOString() };
  history[2] = { ...history[2], timestamp: new Date(now).toISOString() };

  return NextResponse.json({
    status: 'ok',
    history,
    total: history.length,
    timestamp: new Date().toISOString(),
  });
}
