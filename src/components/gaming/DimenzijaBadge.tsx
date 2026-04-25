'use client';

import type { DimenzijaNivo } from '@/lib/dimenzije';

const BOJA_KLASE: Record<DimenzijaNivo, string> = {
  '360D': 'bg-blue-900/40 text-blue-300 border-blue-600/50',
  '720D': 'bg-purple-900/40 text-purple-300 border-purple-600/50',
  '1440D': 'bg-yellow-900/40 text-yellow-300 border-yellow-600/50',
  '2880D': 'bg-orange-900/40 text-orange-300 border-orange-600/50',
  '5760D': 'bg-red-900/40 text-red-300 border-red-600/50',
};

interface Props {
  dimenzija: DimenzijaNivo;
  mali?: boolean;
}

export default function DimenzijaBadge({ dimenzija, mali = false }: Props) {
  const klase = BOJA_KLASE[dimenzija];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${klase} ${mali ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}`}
    >
      🌀 {dimenzija}
    </span>
  );
}
