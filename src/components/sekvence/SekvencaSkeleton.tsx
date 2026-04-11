import type { SekvencaTip } from '@/lib/types';

/** Reusable pulse bar used across all skeletons. */
function Puls({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-700/60 ${className ?? ''}`} />;
}

/* ─── Individual skeleton layouts ──────────────────────── */

function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-20 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <Puls className="mx-auto h-16 w-16 rounded-full" />
        <Puls className="mx-auto h-10 w-72" />
        <Puls className="mx-auto h-6 w-96" />
        <Puls className="mx-auto h-4 w-80" />
        <div className="flex justify-center gap-4 pt-4">
          <Puls className="h-12 w-32 rounded-lg" />
          <Puls className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function StatistikaSkeleton() {
  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Puls className="mx-auto mb-8 h-8 w-64" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 text-center">
              <Puls className="mx-auto mb-2 h-8 w-8 rounded-full" />
              <Puls className="mx-auto mb-1 h-8 w-16" />
              <Puls className="mx-auto h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgresSkeleton() {
  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8">
          <Puls className="mb-2 h-6 w-48" />
          <Puls className="mb-4 h-4 w-32" />
          <Puls className="h-4 w-full rounded-full" />
          <Puls className="mt-4 h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

function KarticeSkeleton() {
  return (
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Puls className="mb-2 h-8 w-48" />
        <Puls className="mb-8 h-4 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6">
              <Puls className="mb-3 h-8 w-8 rounded" />
              <Puls className="mb-2 h-6 w-32" />
              <Puls className="mb-4 h-4 w-full" />
              <div className="flex gap-1">
                <Puls className="h-5 w-14 rounded-full" />
                <Puls className="h-5 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabelaSkeleton() {
  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Puls className="mb-6 h-8 w-56" />
        <div className="overflow-hidden rounded-2xl border border-gray-700/50">
          <div className="bg-gray-800/80 px-6 py-4">
            <div className="flex gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Puls key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-gray-700/50 bg-gray-800/30 px-6 py-4">
              <div className="flex gap-8">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Puls key={j} className="h-4 w-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTASkeleton() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <Puls className="mx-auto mb-4 h-10 w-64" />
        <Puls className="mx-auto mb-8 h-4 w-80" />
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 p-4">
              <Puls className="mx-auto mb-1 h-6 w-6 rounded" />
              <Puls className="mx-auto mb-1 h-6 w-12" />
              <Puls className="mx-auto h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <Puls className="h-12 w-32 rounded-lg" />
          <Puls className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function BanerSkeleton() {
  return (
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gray-800/50 p-8 md:p-12">
          <Puls className="mb-4 h-6 w-24 rounded-full" />
          <Puls className="mb-4 h-8 w-64" />
          <Puls className="mb-6 h-4 w-96" />
          <Puls className="h-12 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ListaSkeleton() {
  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Puls className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
              <Puls className="h-8 w-8 shrink-0 rounded" />
              <div className="flex-1 space-y-2">
                <Puls className="h-5 w-40" />
                <Puls className="h-4 w-72" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HijerarhijaSkeleton() {
  return (
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Puls className="mb-8 h-8 w-56" />
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
                <Puls className="h-8 w-8 rounded" />
                <Puls className="h-6 w-48" />
              </div>
              <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-700 pl-6">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Puls key={j} className="h-8 w-40 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TekstSkeleton() {
  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-4">
        <Puls className="h-8 w-56" />
        <Puls className="h-4 w-full" />
        <Puls className="h-4 w-5/6" />
        <Puls className="h-4 w-4/6" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <Puls className="mt-1 h-3 w-3 shrink-0 rounded-full" />
              <Puls className="h-4 w-72" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlikaSkeleton() {
  return (
    <div className="bg-gray-900/50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-4">
        <Puls className="mx-auto h-8 w-64" />
        <Puls className="mx-auto h-4 w-96" />
        <div className="mt-6 flex justify-center gap-6">
          <Puls className="h-64 w-64 rounded-xl" />
          <Puls className="h-64 w-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
      <div className="mx-auto max-w-md space-y-4">
        <Puls className="mx-auto h-8 w-48" />
        <Puls className="mx-auto h-4 w-64" />
        <div className="mt-6 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 space-y-5">
          <Puls className="h-4 w-24" />
          <Puls className="h-12 w-full rounded-lg" />
          <Puls className="h-4 w-20" />
          <Puls className="h-12 w-full rounded-lg" />
          <Puls className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton lookup ──────────────────────────────────── */

const SKELETONI: Record<SekvencaTip, React.ComponentType> = {
  hero: HeroSkeleton,
  statistika: StatistikaSkeleton,
  progres: ProgresSkeleton,
  kartice: KarticeSkeleton,
  tabela: TabelaSkeleton,
  cta: CTASkeleton,
  baner: BanerSkeleton,
  lista: ListaSkeleton,
  hijerarhija: HijerarhijaSkeleton,
  tekst: TekstSkeleton,
  slika: SlikaSkeleton,
  login: LoginSkeleton,
};

/**
 * Renders a skeleton placeholder that matches the layout of a specific sequence type.
 */
export default function SekvencaSkeleton({ tip }: { tip: SekvencaTip }) {
  const Skeleton = SKELETONI[tip];
  return <Skeleton />;
}

export {
  HeroSkeleton,
  StatistikaSkeleton,
  ProgresSkeleton,
  KarticeSkeleton,
  TabelaSkeleton,
  CTASkeleton,
  BanerSkeleton,
  ListaSkeleton,
  HijerarhijaSkeleton,
  TekstSkeleton,
};
