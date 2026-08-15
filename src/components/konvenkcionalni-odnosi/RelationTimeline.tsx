import type { RelationEvent, RelationEventType } from '@/lib/konvenkcionalni-odnosi';

interface RelationTimelineProps {
  events: RelationEvent[];
  emptyMessage?: string;
}

const EVENT_STYLES: Record<RelationEventType, string> = {
  created: 'bg-blue-600',
  activated: 'bg-green-600',
  suspended: 'bg-yellow-500',
  archived: 'bg-zinc-500',
  terminated: 'bg-red-600',
  interaction: 'bg-indigo-500',
  status_changed: 'bg-orange-500',
  note_added: 'bg-teal-500',
};

const EVENT_LABELS: Record<RelationEventType, string> = {
  created: 'Kreiran',
  activated: 'Aktiviran',
  suspended: 'Suspendovan',
  archived: 'Arhiviran',
  terminated: 'Raskinut',
  interaction: 'Interakcija',
  status_changed: 'Promena statusa',
  note_added: 'Beleška',
};

export function RelationTimeline({
  events,
  emptyMessage = 'Nema zabeleženih interakcija.',
}: RelationTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-center text-xs text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <section className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-700" aria-hidden />
      <ol className="space-y-4 pl-8">
        {sorted.map((event) => (
          <li key={event.eventId} className="relative">
            <span
              className={`absolute -left-5 top-1 h-3 w-3 rounded-full ${EVENT_STYLES[event.type] ?? 'bg-slate-600'}`}
              aria-hidden
            />
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">
                  {EVENT_LABELS[event.type] ?? event.type}
                </span>
                <time className="text-[10px] text-slate-500" dateTime={event.timestamp}>
                  {new Date(event.timestamp).toLocaleString('sr-RS')}
                </time>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Actor: {event.actorId}
              </p>
              {event.payload && Object.keys(event.payload).length > 0 && (
                <pre className="mt-1 text-[9px] text-slate-500 overflow-x-auto">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
