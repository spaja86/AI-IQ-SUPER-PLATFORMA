import type { EntityStatus } from '@/lib/types';

const statusConfig: Record<EntityStatus, { label: string; color: string; dot: string }> = {
  active: { label: 'Aktivno', color: 'bg-emerald-900/35 text-emerald-300 border border-emerald-700/40', dot: 'bg-emerald-400' },
  development: { label: 'U razvoju', color: 'bg-amber-900/35 text-amber-300 border border-amber-700/40', dot: 'bg-amber-400' },
  planned: { label: 'Planirano', color: 'bg-blue-900/35 text-blue-300 border border-blue-700/40', dot: 'bg-blue-400' },
  archived: { label: 'Arhivirano', color: 'bg-slate-800/80 text-slate-300 border border-slate-700/50', dot: 'bg-slate-400' },
};

export function StatusBadge({ status }: { status: EntityStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="spaja-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export function EntityCard({
  icon,
  name,
  description,
  status,
  tags,
  children,
}: {
  icon: string;
  name: string;
  description: string;
  status: EntityStatus;
  tags?: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="spaja-card group p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">{description}</p>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-700/50 bg-slate-900/70 px-2 py-0.5 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
        <span className="text-4xl">{icon}</span>
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-lg text-[var(--text-muted)]">{subtitle}</p>}
    </div>
  );
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="spaja-shell mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
