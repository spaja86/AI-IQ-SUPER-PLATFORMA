import type { Metadata } from 'next';
import Link from 'next/link';
import PrImportPanel from './pr-import-panel';

export const metadata: Metadata = { title: 'GitHub PR uvoz — SUPEROMEGATRAJEKTORIJUM' };
export default function PrImportPage() {
  return <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
    <Link href="/omegatrojektorijum" className="text-cyan-300 underline">← OMEGATROJEKTORIJUM</Link>
    <header className="space-y-3">
      <p className="break-words text-sm tracking-widest text-cyan-300">SUPEROMEGATRAJEKTORIJUM · razvojni pregled</p>
      <h1 className="text-3xl font-bold sm:text-5xl">GitHub PR uvoz</h1>
      <p className="text-slate-300">Pretraži PR opise, statuse i grane iz sačuvanog SPAJA paketa.</p>
    </header>
    <PrImportPanel />
  </div>;
}
