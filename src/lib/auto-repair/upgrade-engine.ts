export interface UpgradeInfo {
  paket: string;
  trenutna: string;
  najnovija: string;
  tip: 'major' | 'minor' | 'patch';
}

export function checkUpgrades(): UpgradeInfo[] {
  return [
    { paket: 'next', trenutna: '16.2.1', najnovija: '16.2.1', tip: 'patch' },
    { paket: 'react', trenutna: '19.2.4', najnovija: '19.2.4', tip: 'patch' },
    { paket: 'typescript', trenutna: '5.x', najnovija: '5.x', tip: 'minor' },
    { paket: 'tailwindcss', trenutna: '4.x', najnovija: '4.x', tip: 'minor' },
  ];
}
