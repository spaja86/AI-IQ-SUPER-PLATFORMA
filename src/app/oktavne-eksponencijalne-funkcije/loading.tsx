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
 * Eksponencijalne Funkcije Oktavnog Sistema — 14 sekvenci skeleton
 */
export default function OktavneEksponencijalneFunkcijeLoading() {
  return (
    <main>
      <HeroSkeleton />
      <TekstSkeleton />
      <StatistikaSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <ProgresSkeleton />
      <KarticeSkeleton />
      <HijerarhijaSkeleton />
      <ListaSkeleton />
      <CTASkeleton />
    </main>
  );
}
