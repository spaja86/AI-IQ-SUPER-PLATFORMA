import { platforme, getUkupniProgres, getBrojAktivnih } from './platforme';
import { itProizvodi, getProizvodiVisokogUticaja } from './it-proizvodi';
import { spajaProVerzije, getAktivneVerzije } from './spaja-pro';
import { promptovi, getPromptKategorije } from './prompt';
import { igrice, getSveKategorijeIgrica } from './igrice';
import { omegaPersone, getAktivnePersone } from './omega-ai';
import { sajtovi } from './sajtovi';
import { mobilneCentrale, mobilniServisi } from './mobilna-mreza';
import { dimenzije } from './dimenzije';
import { proksiSignali, proksiCvorovi } from './proksi';
import { navigation } from './navigation';

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
    ukupnoIgrica: igrice.length,
    kategorijaIgrica: getSveKategorijeIgrica().length,
    ukupnoOmegaPersona: omegaPersone.length,
    aktivnihOmegaPersona: getAktivnePersone().length,
    ukupnoSajtova: sajtovi.length,
    ukupnoMobilnihCentrala: mobilneCentrale.length,
    ukupnoMobilnihServisa: mobilniServisi.length,
    ukupnoDimenzija: dimenzije.length,
    ukupnoProksiSignala: proksiSignali.length,
    ukupnoProksiCvorova: proksiCvorovi.length,
    ukupnoStranica: navigation.length,
  };
}
