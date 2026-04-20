import {
  HeroSkeleton,
  TekstSkeleton,
  StatistikaSkeleton,
  TabelaSkeleton,
  ProgresSkeleton,
  KarticeSkeleton,
  HijerarhijaSkeleton,
  ListaSkeleton,
  CTASkeleton,
} from '@/components/sekvence/SekvencaSkeleton';

/**
 * Oktavni GPU/RAM Sistem — 12 sekvenci skeleton
 */
export default function OktavniGPURAMLoading() {
  return (
    <main>
      <HeroSkeleton />
      <TekstSkeleton />
      <StatistikaSkeleton />
      <TabelaSkeleton />
      <ProgresSkeleton />
      <ProgresSkeleton />
      <KarticeSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <HijerarhijaSkeleton />
      <ListaSkeleton />
      <CTASkeleton />
    </main>
  );
}
