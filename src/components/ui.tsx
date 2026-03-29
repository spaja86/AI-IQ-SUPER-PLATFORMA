import type { EntityStatus } from '@/lib/types';

const statusConfig: Record<EntityStatus, { label: string; color: string; dot: string }> = {
  active: { label: 'Aktivno', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  development: { label: 'U razvoju', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
  planned: { label: 'Planirano', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  archived: { label: 'Arhivirano', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400', dot: 'bg-zinc-400' },
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
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
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
    <div className="group rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{name}</h3>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
      <h1 className="flex items-center gap-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        <span className="text-4xl">{icon}</span>
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
