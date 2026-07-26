// Reads package versions at build time via resolveJsonModule (already enabled in tsconfig.json).
import packageJson from '../../../package.json';

export interface UpgradeInfo {
  paket: string;
  trenutna: string;
  najnovija: string;
  tip: 'major' | 'minor' | 'patch';
}

/** Packages we track for upgrade recommendations. */
const TRACKED_PACKAGES = ['next', 'react', 'typescript', 'tailwindcss', 'openai', '@supabase/supabase-js', 'stripe', 'viem'] as const;

type AllDeps = Record<string, string>;

function getInstalledVersion(paket: string): string {
  const allDeps: AllDeps = {
    ...(packageJson.dependencies as AllDeps),
    ...(packageJson.devDependencies as AllDeps),
  };
  const raw = allDeps[paket] ?? 'nepoznata';
  // Strip leading range operators (^, ~, >=, <=, >). Handles common semver range prefixes.
  return raw.replace(/^[~^]|^[<>]=?/, '');
}

export function checkUpgrades(): UpgradeInfo[] {
  return TRACKED_PACKAGES.map((paket) => {
    const trenutna = getInstalledVersion(paket);
    return {
      paket,
      trenutna,
      najnovija: trenutna, // Without a live npm registry call, najnovija = trenutna (no pending upgrades known)
      tip: 'patch' as const,
    };
  });
}
