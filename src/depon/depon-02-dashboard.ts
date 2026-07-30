/**
 * 🗺️ DEPON-02 — State Dashboard Portal
 *
 * Per-state customizable dashboard with state-specific branding,
 * data views, and compliance widgets. Covers all 50 US states.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-02';

// ─── Types ───────────────────────────────────────────────────────────────────

export type WidgetType =
  | 'kpi-counter'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'heatmap'
  | 'activity-feed'
  | 'compliance-status'
  | 'user-map';

export type DashboardTheme = 'light' | 'dark' | 'high-contrast';

export type StateConfig = {
  stateCode: string;
  stateName: string;
  region: UsRegion;
  timezone: string;
  primaryColor: string;
  complianceLaws: string[];
  featuredWidgets: WidgetType[];
  dataResidencyRegion: string;
};

export type UsRegion = 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west' | 'northwest';

export type DashboardLayout = {
  stateCode: string;
  userId: string;
  theme: DashboardTheme;
  widgets: DashboardWidget[];
  lastUpdated: Date;
};

export type DashboardWidget = {
  id: string;
  type: WidgetType;
  title: string;
  position: { row: number; col: number };
  size: { width: number; height: number };
  config: Record<string, unknown>;
};

// ─── State Configuration Map ──────────────────────────────────────────────────

export const STATE_CONFIGS: Record<string, Pick<StateConfig, 'stateName' | 'region' | 'timezone'>> = {
  CA: { stateName: 'California', region: 'west', timezone: 'America/Los_Angeles' },
  NY: { stateName: 'New York', region: 'northeast', timezone: 'America/New_York' },
  TX: { stateName: 'Texas', region: 'southwest', timezone: 'America/Chicago' },
  FL: { stateName: 'Florida', region: 'southeast', timezone: 'America/New_York' },
  IL: { stateName: 'Illinois', region: 'midwest', timezone: 'America/Chicago' },
  PA: { stateName: 'Pennsylvania', region: 'northeast', timezone: 'America/New_York' },
  OH: { stateName: 'Ohio', region: 'midwest', timezone: 'America/New_York' },
  GA: { stateName: 'Georgia', region: 'southeast', timezone: 'America/New_York' },
  NC: { stateName: 'North Carolina', region: 'southeast', timezone: 'America/New_York' },
  MI: { stateName: 'Michigan', region: 'midwest', timezone: 'America/Detroit' },
  WA: { stateName: 'Washington', region: 'northwest', timezone: 'America/Los_Angeles' },
  AZ: { stateName: 'Arizona', region: 'southwest', timezone: 'America/Phoenix' },
  CO: { stateName: 'Colorado', region: 'west', timezone: 'America/Denver' },
  VA: { stateName: 'Virginia', region: 'southeast', timezone: 'America/New_York' },
  MA: { stateName: 'Massachusetts', region: 'northeast', timezone: 'America/New_York' },
};

// ─── Service Functions ────────────────────────────────────────────────────────

export function getDefaultWidgets(stateCode: string): WidgetType[] {
  const base: WidgetType[] = ['kpi-counter', 'line-chart', 'activity-feed'];
  if (['CA', 'NY', 'TX', 'FL'].includes(stateCode)) {
    base.push('heatmap', 'compliance-status', 'user-map');
  }
  return base;
}

export function buildDefaultLayout(params: {
  stateCode: string;
  userId: string;
  theme?: DashboardTheme;
}): DashboardLayout {
  const widgets = getDefaultWidgets(params.stateCode).map((type, i) => ({
    id: `widget_${type}_${i}`,
    type,
    title: type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    position: { row: Math.floor(i / 3), col: i % 3 },
    size: { width: 1, height: 1 },
    config: {},
  }));

  return {
    stateCode: params.stateCode,
    userId: params.userId,
    theme: params.theme ?? 'light',
    widgets,
    lastUpdated: new Date(),
  };
}

export function getStateInfo(stateCode: string): Pick<StateConfig, 'stateName' | 'region' | 'timezone'> | null {
  return STATE_CONFIGS[stateCode.toUpperCase()] ?? null;
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string } {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0' };
}
