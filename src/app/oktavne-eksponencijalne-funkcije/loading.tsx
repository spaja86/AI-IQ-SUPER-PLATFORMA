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
 * Eksponencijalne Funkcije Oktavnog Sistema — 18 sekvenci skeleton
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
      <TekstSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <StatistikaSkeleton />
      <CTASkeleton />
    </main>
  );
}
