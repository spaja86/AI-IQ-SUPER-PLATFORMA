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
import { runDiagnostics } from './auto-repair';
import { companies } from './companies';
import { organizations } from './organizations';
import { products } from './products';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_ROUTES, TOTAL_API_ROUTES } from './constants';
import {
  generisaniEngini,
  generatorKonfiguracije,
  getAktivniEngini,
  getRepoEngini,
  getRepoKonfiguracije,
  getProsecnaOptimizacija,
} from './spaja-generator-engine';
import { spajaBaza, getBazaStatistika } from './spaja-baza';
import { autentifikacijaSistem } from './autentifikacija';
import { profesionalniMejlSistem } from './spaja-profesionalni-mejl';
import { spajaPlatniSistem } from './spaja-platni-sistem';
import { spajaRealtimeSistem } from './spaja-realtime';
import { spajaPricingLogin } from './spaja-pricing-login';
import { spajaDigitalniTelevizor } from './spaja-digitalni-televizor';
import { spajaMonitoringLive } from './spaja-monitoring-live';
import { spajaAiIqMonitoring } from './spaja-ai-iq-monitoring';
import { spajaBlogFaq } from './spaja-blog-faq';
import { spajaUnitTestovi } from './spaja-unit-testovi';
import { omegaAiMaksimalniSuport } from './omega-ai-maksimalni-suport';
import { vizuelniIdentitetSistem } from './vizuelni-identitet';
import { getReklameMetrike } from './reklame-i-partnerstva';

export function getStatistike() {
  const dijagnostika = runDiagnostics();

  return {
    // Platforme
    ukupnoPlatformi: platforme.length,
    aktivnihPlatformi: getBrojAktivnih(),
    spremnihPlatformi: platforme.filter((p) => p.status === 'spremna').length,
    platformeURazvoju: platforme.filter((p) => p.status === 'razvoj').length,

    // IT proizvodi
    ukupnoProizvoda: itProizvodi.length,
    ukupniProgres: getUkupniProgres(),
    proizvodiVisokogUticaja: getProizvodiVisokogUticaja().length,
    kategorijePlatformi: 6,
    kategorijeProizvoda: 8,

    // SpajaPro
    spajaProVerzija: spajaProVerzije.length,
    spajaProAktivnih: getAktivneVerzije().length,

    // Prompt
    ukupnoPromptova: promptovi.length,
    promptKategorija: getPromptKategorije().length,

    // Igrice
    ukupnoIgrica: igrice.length,
    kategorijaIgrica: getSveKategorijeIgrica().length,

    // OMEGA AI
    ukupnoOmegaPersona: omegaPersone.length,
    aktivnihOmegaPersona: getAktivnePersone().length,

    // Infrastruktura
    ukupnoSajtova: sajtovi.length,
    ukupnoMobilnihCentrala: mobilneCentrale.length,
    ukupnoMobilnihServisa: mobilniServisi.length,
    ukupnoDimenzija: dimenzije.length,
    ukupnoProksiSignala: proksiSignali.length,
    ukupnoProksiCvorova: proksiCvorovi.length,

    // Navigacija i stranice
    ukupnoStranica: navigation.length,
    ukupnoRuta: TOTAL_ROUTES,
    ukupnoAPIRuta: TOTAL_API_ROUTES,

    // Zdravlje sistema
    zdravljeSistema: dijagnostika.zdravlje,
    ukupnoDijagnostika: dijagnostika.ukupnoProvera,
    uspesnihDijagnostika: dijagnostika.uspesnih,

    // Autofinish
    autofinishBroj: AUTOFINISH_COUNT,
    verzija: APP_VERSION,

    // EN Entities
    ukupnoKompanija: companies.length,
    ukupnoOrganizacija: organizations.length,
    ukupnoProducts: products.length,

    // SPAJA Generator za Endžine
    generatorEngina: generisaniEngini.length,
    generatorAktivnihEngina: getAktivniEngini().length,
    generatorRepoEngina: getRepoEngini().length,
    generatorKonfiguracija: generatorKonfiguracije.length,
    generatorRepoKonfiguracija: getRepoKonfiguracije().length,
    generatorOptimizacija: getProsecnaOptimizacija(),

    // Backend infrastruktura
    bazaKolekcija: spajaBaza.kolekcije.length,
    bazaDokumenata: getBazaStatistika().ukupnoDokumenata,
    bazaStatus: spajaBaza.status,
    authDozvola: autentifikacijaSistem.dozvole.length,
    authStatus: autentifikacijaSistem.status,
    mejlSablona: profesionalniMejlSistem.sabloni.length,
    mejlDomena: profesionalniMejlSistem.domeni.length,
    mejlStatus: profesionalniMejlSistem.status,
    platniProizvoda: spajaPlatniSistem.stripeProizvodi.length,
    platniStatus: spajaPlatniSistem.status,
    realtimeKanala: spajaRealtimeSistem.kanali.length,
    realtimeStatus: spajaRealtimeSistem.status,

    // Monetizacija & Mediji
    pricingPlanova: spajaPricingLogin.planovi.length,
    pricingLoginMetoda: spajaPricingLogin.loginMetode.length,
    pricingStatus: spajaPricingLogin.status,
    tvKanala: spajaDigitalniTelevizor.kanali.length,
    tvPrograma: spajaDigitalniTelevizor.programi.length,
    tvStatus: spajaDigitalniTelevizor.status,
    monitoringLiveStreamova: spajaMonitoringLive.streamovi.length,
    monitoringLiveStreamera: spajaMonitoringLive.streameri.length,
    monitoringLiveStatus: spajaMonitoringLive.status,
    aiIqMonitoringGresaka: spajaAiIqMonitoring.greske.length,
    aiIqMonitoringUptime: spajaAiIqMonitoring.statistika.uptimeProcenat,
    aiIqMonitoringStatus: spajaAiIqMonitoring.status,
    blogClanaka: spajaBlogFaq.clanci.length,
    blogFaqPitanja: spajaBlogFaq.faqPitanja.length,
    blogStatus: spajaBlogFaq.status,
    testSuita: spajaUnitTestovi.suite.length,
    testPokrivenost: spajaUnitTestovi.izvestaj.pokrivenost,
    testStatus: spajaUnitTestovi.status,

    // OMEGA AI Maksimalni Suport
    suportTelefona: omegaAiMaksimalniSuport.telefoni.length,
    suportTiketa: omegaAiMaksimalniSuport.statistika.ukupnoTiketa,
    suportSlaIspunjenost: omegaAiMaksimalniSuport.statistika.slaIspunjenost,
    suportZadovoljstvo: omegaAiMaksimalniSuport.statistika.zadovoljstvoKorisnika,
    suportStatus: omegaAiMaksimalniSuport.status,

    // Vizuelni Identitet
    vizuelniResursa: vizuelniIdentitetSistem.ukupnoResursa,
    vizuelniOsnivac: vizuelniIdentitetSistem.osnivac.punoIme,
    vizuelniStatus: vizuelniIdentitetSistem.status,

    // Reklame & Partnerstva
    ...(() => {
      const rm = getReklameMetrike();
      return {
        reklameUkupno: rm.ukupnoReklama,
        reklameAktivnih: rm.aktivnihReklama,
        partnerstvaUkupno: rm.ukupnoPartnerstava,
        partnerstvaPotpisanih: rm.aktivnihPartnerstava,
        monetizacijaKanala: rm.monetizacijaKanala,
        monetizacijaAktivnih: rm.aktivnihKanala,
      };
    })(),
  };
}
