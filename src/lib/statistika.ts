import { platforme, getUkupniProgres, getBrojAktivnih } from './platforme';
import { itProizvodi, getProizvodiVisokogUticaja } from './it-proizvodi';

export function getStatistike() {
  return {
    ukupnoPlatformi: platforme.length,
    aktivnihPlatformi: getBrojAktivnih(),
    ukupnoProizvoda: itProizvodi.length,
    ukupniProgres: getUkupniProgres(),
    proizvodiVisokogUticaja: getProizvodiVisokogUticaja().length,
    kategorijePlatformi: 6,
    kategorijeProizvoda: 8,
  };
}
