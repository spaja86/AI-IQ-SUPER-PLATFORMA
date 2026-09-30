import { B2B_PLATFORM_CATALOG } from './b2b-platform-catalog';

export type PlatformMonitoringState = 'not-configured' | 'read-only';

export interface PlatformMonitoringRecord {
  id: string;
  naziv: string;
  state: PlatformMonitoringState;
  source: 'catalog';
  alert: string;
}

/**
 * Safe monitoring baseline. It deliberately reports unconfigured instead of
 * inferring availability from static catalog entries.
 */
export function getPlatformMonitoringSnapshot(): PlatformMonitoringRecord[] {
  const monitoringConfigured = Boolean(process.env.VERCEL_MONITORING_TOKEN);

  return B2B_PLATFORM_CATALOG.map((platforma) => ({
    id: platforma.id,
    naziv: platforma.naziv,
    state: monitoringConfigured ? 'read-only' : 'not-configured',
    source: 'catalog' as const,
    alert: monitoringConfigured
      ? 'Monitoring token je prisutan, ali live deployment upit još nije implementiran.'
      : 'Live monitoring nije povezan; prikazan je samo katalog platformi.',
  }));
}
