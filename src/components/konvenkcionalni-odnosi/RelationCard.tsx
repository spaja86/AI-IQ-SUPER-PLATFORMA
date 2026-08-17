import type { Relation, RelationStatus, RelationType } from '@/lib/konvenkcionalni-odnosi';

interface RelationCardProps {
  relation: Relation;
}

const STATUS_STYLES: Record<RelationStatus, string> = {
  DRAFT: 'border-slate-500 bg-slate-900/40 text-slate-200',
  ACTIVE: 'border-green-600 bg-green-950/40 text-green-100',
  SUSPENDED: 'border-yellow-500 bg-yellow-950/40 text-yellow-100',
  ARCHIVED: 'border-zinc-500 bg-zinc-900/40 text-zinc-300',
  TERMINATED: 'border-red-600 bg-red-950/40 text-red-200',
};

const STATUS_BADGE: Record<RelationStatus, string> = {
  DRAFT: 'bg-slate-600 text-white',
  ACTIVE: 'bg-green-600 text-white',
  SUSPENDED: 'bg-yellow-500 text-black',
  ARCHIVED: 'bg-zinc-600 text-white',
  TERMINATED: 'bg-red-600 text-white',
};

const TYPE_LABELS: Record<RelationType, string> = {
  hierarchical: 'Hijerarhijski',
  peer: 'Peer',
  mentorship: 'Mentorstvo',
  sponsorship: 'Sponzorstvo',
  collaboration: 'Saradnja',
  contractual: 'Ugovorni',
  affiliation: 'Afilijacija',
};

export function RelationCard({ relation }: RelationCardProps) {
  const [initiator, recipient] = relation.parties;

  return (
    <article className={`rounded-xl border p-4 ${STATUS_STYLES[relation.status]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold tracking-wide">
          {TYPE_LABELS[relation.type]} — KO v1
        </h3>
        <span className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[relation.status]}`}>
          {relation.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        <div className="rounded bg-black/20 px-3 py-2">
          <p className="font-semibold uppercase tracking-wide text-[10px] opacity-60 mb-1">
            {initiator.role}
          </p>
          <p className="font-mono truncate">{initiator.entityId}</p>
          <p className="opacity-60">{initiator.entityType}</p>
        </div>
        <div className="rounded bg-black/20 px-3 py-2">
          <p className="font-semibold uppercase tracking-wide text-[10px] opacity-60 mb-1">
            {recipient.role}
          </p>
          <p className="font-mono truncate">{recipient.entityId}</p>
          <p className="opacity-60">{recipient.entityType}</p>
        </div>
      </div>

      {relation.description && (
        <p className="mt-3 text-xs opacity-75">{relation.description}</p>
      )}

      {relation.tags && relation.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {relation.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-between text-[10px] opacity-50">
        <span>ID: {relation.id}</span>
        <span>{new Date(relation.createdAt).toLocaleDateString('sr-RS')}</span>
      </div>
    </article>
  );
}
