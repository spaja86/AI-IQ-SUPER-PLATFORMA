import type { Sekvenca } from '@/lib/types';
import HeroSekvenca from './HeroSekvenca';
import StatistikaSekvenca from './StatistikaSekvenca';
import ProgresSekvenca from './ProgresSekvenca';
import KarticeSekvenca from './KarticeSekvenca';
import TabelaSekvenca from './TabelaSekvenca';
import CTASekvenca from './CTASekvenca';
import BanerSekvenca from './BanerSekvenca';
import ListaSekvenca from './ListaSekvenca';
import HijerarhijaSekvenca from './HijerarhijaSekvenca';
import TekstSekvenca from './TekstSekvenca';

const KOMPONENTE: Record<string, React.ComponentType<{ sekvenca: Sekvenca }>> = {
  hero: HeroSekvenca,
  statistika: StatistikaSekvenca,
  progres: ProgresSekvenca,
  kartice: KarticeSekvenca,
  tabela: TabelaSekvenca,
  cta: CTASekvenca,
  baner: BanerSekvenca,
  lista: ListaSekvenca,
  hijerarhija: HijerarhijaSekvenca,
  tekst: TekstSekvenca,
};

export default function SekvencaRenderer({ sekvenca }: { sekvenca: Sekvenca }) {
  const Komponenta = KOMPONENTE[sekvenca.tip];

  if (!Komponenta) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <section id={sekvenca.id} className="bg-red-900/20 px-6 py-8 text-center text-red-400">
          Nepoznat tip sekvence: <code>{sekvenca.tip}</code>
        </section>
      );
    }
    return null;
  }

  return (
    <section id={sekvenca.id} aria-label={sekvenca.naslov ?? sekvenca.tip}>
      <Komponenta sekvenca={sekvenca} />
    </section>
  );
}
