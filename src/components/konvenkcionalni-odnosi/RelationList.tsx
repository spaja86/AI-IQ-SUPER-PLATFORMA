import type { Relation } from '@/lib/konvenkcionalni-odnosi';
import { RelationCard } from './RelationCard';

interface RelationListProps {
  relations: Relation[];
  emptyMessage?: string;
}

export function RelationList({
  relations,
  emptyMessage = 'Nema registrovanih odnosa.',
}: RelationListProps) {
  if (relations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide">
          KONVENKCIONALNI ODNOSI
        </h2>
        <span className="text-xs text-slate-500">{relations.length} odnos(a)</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relations.map((relation) => (
          <RelationCard key={relation.id} relation={relation} />
        ))}
      </div>
    </section>
  );
}

export { TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from './filter-options';

