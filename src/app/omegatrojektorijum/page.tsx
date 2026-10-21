import type { Metadata } from 'next';
import Link from 'next/link';
import OmegaCatalog from './catalog';
import OmegaProjects from './projects';

export const metadata: Metadata = {
  title: 'OMEGATROJEKTORIJUM',
  description: 'SPAJA GitHub projekti i statusi povezivanja, katalog ideja i lokalni filmski studio.',
};

export default function OmegaPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-cyan-300">SPAJA · prvo izdanje</p>
        <h1 className="break-words text-3xl font-bold sm:text-5xl">OMEGATROJEKTORIJUM</h1>
        <p className="text-slate-300">Poveži ideju sa sledećim konkretnim korakom.</p>
      </header>
      <Link className="inline-block text-cyan-300 underline focus-visible:outline-2" href="/superomegatrajektorijum">SUPEROMEGATRAJEKTORIJUM — zajednički registar platformi i aplikacija</Link>
      <nav aria-label="Radni prostori" className="grid gap-4 sm:grid-cols-3">
        <Link className="rounded-xl border border-slate-600 p-5 hover:border-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-300" href="/bank-prototype">
          <strong>Bankarski prototip</strong><p className="mt-2 text-sm text-slate-300">Proveri sesiju. Stvarna plaćanja i izdavanje kartica su isključeni.</p>
        </Link>
        <Link className="rounded-xl border border-slate-600 p-5 hover:border-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-300" href="/login?redirect=%2Fomegatrojektorijum">
          <strong>Prijava na platformu</strong><p className="mt-2 text-sm text-slate-300">Postojeća prijava; vlasnička prava određuje sistem ovlašćenja.</p>
        </Link>
        <Link className="rounded-xl border border-cyan-700 bg-cyan-950 p-5 hover:border-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-300" href="/omegatrojektorijum/studio">
          <strong>Snimi prvi film</strong><p className="mt-2 text-sm text-slate-300">Kamera i mikrofon uz dozvolu. Preuzmi snimak na svoj uređaj.</p>
        </Link>
      </nav>
      <a className="inline-block text-cyan-300 underline focus-visible:outline-2" href="#povezani-projekti">Pregled povezanih GitHub projekata</a>
      <OmegaProjects />
      <OmegaCatalog />
    </div>
  );
}
