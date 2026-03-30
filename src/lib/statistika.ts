import { platforme, getUkupniProgres, getBrojAktivnih } from './platforme';
import { itProizvodi, getProizvodiVisokogUticaja } from './it-proizvodi';
import { spajaProVerzije, getAktivneVerzije } from './spaja-pro';
import { promptovi, getPromptKategorije } from './prompt';

export function getStatistike() {
  return {
    ukupnoPlatformi: platforme.length,
    aktivnihPlatformi: getBrojAktivnih(),
    ukupnoProizvoda: itProizvodi.length,
    ukupniProgres: getUkupniProgres(),
    proizvodiVisokogUticaja: getProizvodiVisokogUticaja().length,
    kategorijePlatformi: 6,
    kategorijeProizvoda: 8,
    spajaProVerzija: spajaProVerzije.length,
    spajaProAktivnih: getAktivneVerzije().length,
    ukupnoPromptova: promptovi.length,
    promptKategorija: getPromptKategorije().length,
  };
}
