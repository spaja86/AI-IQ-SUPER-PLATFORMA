import type { WalletReleaseLane } from './types';

export interface WalletReleaseLaneConfig {
  lane: WalletReleaseLane;
  signing: string;
  provisioning: string;
  storeTrack: string;
  notes: string;
}

export const walletReleaseLanes: WalletReleaseLaneConfig[] = [
  {
    lane: 'dev',
    signing: 'debug/dev keystore i iOS development certifikati',
    provisioning: 'lokalni provisioning profili',
    storeTrack: 'internal testing',
    notes: 'Brze iteracije, feature flag testiranje i QA simulacije.',
  },
  {
    lane: 'beta',
    signing: 'release candidate signing',
    provisioning: 'TestFlight + Play closed testing profili',
    storeTrack: 'beta',
    notes: 'Pilot regioni, staged rollout i KPI validacija pre produkcije.',
  },
  {
    lane: 'production',
    signing: 'production signing certifikati',
    provisioning: 'App Store/Play produkcioni provisioning',
    storeTrack: 'production',
    notes: 'Postepeni rollout po regionima uz fallback i incident runbook.',
  },
];
