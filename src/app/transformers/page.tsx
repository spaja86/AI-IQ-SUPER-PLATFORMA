import type { Metadata } from 'next';
import Link from 'next/link';
import TransformersRunner from '@/components/gaming/runners/TransformersRunner';

export const metadata: Metadata = {
  title: 'TRANSFORMERS 1350 — lokalni prototip',
  description: 'Robot ↔ vozilo, probni sektor Smedereva, četiri kamere i lokalni duel.',
};
export default function TransformersPage() {
  return <main className="min-h-screen bg-slate-950">
    <nav className="px-4 py-3 text-sm text-cyan-300"><Link href="/igrice">← Katalog igara</Link></nav>
    <div className="mx-auto max-w-6xl"><TransformersRunner/></div>
  </main>;
}
