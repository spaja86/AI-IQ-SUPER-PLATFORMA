import LocalEvidencePanel from '@/components/LocalEvidencePanel';
import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaDigitalniKompjuterSekvence } from '@/lib/sekvence/spaja-digitalni-kompjuter-page';

import { getDigitalniKompjuterToolchain } from '@/lib/digitalni-kompjuter-toolchain';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Kompjuter — AI IQ SUPER PLATFORMA',
  description: 'Kompletni digitalni kompjuter sa svim SPAJA komponentama — Maticna Ploca, Server, Procesor, GPU, Graficka, RAM, Hard Disk, BIOS, konzole i dzojstici — sve pokretano od SPAJA Generator za Endzine',
};

export default function SpajaDigitalniKompjuter() {
  const toolchain = getDigitalniKompjuterToolchain();
  return <><section className="mx-auto max-w-5xl p-6" aria-labelledby="toolchain-title">
    <h1 id="toolchain-title">Procedure i analize — povezani moduli</h1>
    <p>Read-only katalog. Živi dokazi nisu priloženi; Java/Next build nisu potvrđeni. Ovaj prikaz ne pokreće provere.</p>
    <ul>{toolchain.modules.map(module => <li key={module.id}><strong>{module.name}</strong>: {module.role} — {module.status}</li>)}</ul>
    <p>CLI pregled: npm run digitalni-kompjuter -- toolchain</p>
    <p>Odvojena, eksplicitna lokalna provera: node scripts/local-verification.mjs --execute reference-tests</p>
  </section><LocalEvidencePanel /><StranicaRenderer sekvence={spajaDigitalniKompjuterSekvence} /></>;

}
