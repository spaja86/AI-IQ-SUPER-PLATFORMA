'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI: ZlatniTransakcijeTable
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniTransakcija, ZlatniTransakcijaType } from '@/lib/zlatni-racuni';

interface ZlatniTransakcijeTableProps {
  items: ZlatniTransakcija[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

const TYPE_STYLES: Record<ZlatniTransakcijaType, string> = {
  credit: 'text-green-600',
  bonus: 'text-blue-600',
  debit: 'text-red-600',
  penalty: 'text-orange-600',
};

const TYPE_SIGN: Record<ZlatniTransakcijaType, string> = {
  credit: '+',
  bonus: '+',
  debit: '-',
  penalty: '-',
};

export function ZlatniTransakcijeTable({
  items,
  total,
  page,
  pageSize,
  onPageChange,
}: ZlatniTransakcijeTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-amber-100 text-amber-800 text-left">
            <th className="px-4 py-2 font-semibold">Datum</th>
            <th className="px-4 py-2 font-semibold">Tip</th>
            <th className="px-4 py-2 font-semibold">Izvor</th>
            <th className="px-4 py-2 font-semibold text-right">Iznos</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-amber-500">
                Nema transakcija.
              </td>
            </tr>
          )}
          {items.map((tx) => (
            <tr key={tx.id} className="border-b border-amber-100 hover:bg-amber-50">
              <td className="px-4 py-2 text-gray-600">
                {new Date(tx.timestamp).toLocaleString('sr-RS')}
              </td>
              <td className={`px-4 py-2 font-medium capitalize ${TYPE_STYLES[tx.type]}`}>
                {tx.type}
              </td>
              <td className="px-4 py-2 text-gray-500">{tx.source}</td>
              <td className={`px-4 py-2 text-right font-bold ${TYPE_STYLES[tx.type]}`}>
                {TYPE_SIGN[tx.type]}{tx.amount.toLocaleString()} pts
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3 px-4 text-xs text-amber-700">
          <span>
            Prikazano {items.length} od {total} transakcija
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="px-2 py-1 rounded border border-amber-300 disabled:opacity-40"
            >
              ‹
            </button>
            <span className="px-2 py-1">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="px-2 py-1 rounded border border-amber-300 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
