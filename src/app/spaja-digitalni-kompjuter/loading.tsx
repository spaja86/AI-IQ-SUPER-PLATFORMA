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
 * SPAJA Digitalni Kompjuter — 13 sekvenci skeleton
 */
export default function SpajaDigitalniKompjuterLoading() {
  return (
    <main>
      <HeroSkeleton />
      <TekstSkeleton />
      <StatistikaSkeleton />
      <TabelaSkeleton />
      <KarticeSkeleton />
      <KarticeSkeleton />
      <TabelaSkeleton />
      <TabelaSkeleton />
      <HijerarhijaSkeleton />
      <TabelaSkeleton />
      <KarticeSkeleton />
      <ListaSkeleton />
      <CTASkeleton />
    </main>
  );
}
