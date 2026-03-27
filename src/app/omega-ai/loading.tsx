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
 * OMEGA AI stranica koristi 10 sekvenci — skeleton preslikava taj raspored
 * za elastičnu sinhronizaciju sa oktavnim sistemom dispečovanja,
 * matričnim jezgrom i neurološkom mrežom.
 */
export default function OmegaAILoading() {
  return (
    <main>
      <HeroSkeleton />
      <TekstSkeleton />
      <StatistikaSkeleton />
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
