import {
  HeroSkeleton,
  TekstSkeleton,
  StatistikaSkeleton,
  TabelaSkeleton,
  KarticeSkeleton,
  HijerarhijaSkeleton,
  ListaSkeleton,
  CTASkeleton,
} from '@/components/sekvence/SekvencaSkeleton';

/**
 * OMEGA AI stranica koristi 8 sekvenci — skeleton preslikava taj raspored
 * za elastičnu sinhronizaciju sa oktavnim sistemom dispečovanja.
 */
export default function OmegaAILoading() {
  return (
    <main>
      <HeroSkeleton />
      <TekstSkeleton />
      <StatistikaSkeleton />
      <TabelaSkeleton />
      <KarticeSkeleton />
      <HijerarhijaSkeleton />
      <ListaSkeleton />
      <CTASkeleton />
    </main>
  );
}
