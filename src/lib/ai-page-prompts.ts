/**
 * AI Page Prompts — Kontekstualni promptovi za svaku stranicu
 *
 * Svaka stranica ima preporucene promptove za AI i SpajaPro AI asistenta.
 * Korisnici mogu da ispituju šta se dešava na svakoj stranici
 * kroz AI i SpajaPro AI preporuke.
 */

export interface AiPagePrompt {
  pitanje: string;
  ikona: string;
  kategorija: 'ai' | 'spaja-pro-ai';
}

export interface PagePromptConfig {
  putanja: string;
  naslov: string;
  opis: string;
  kontekst: string;
  promptovi: AiPagePrompt[];
}

/**
 * Konfigurisani promptovi po stranicama — korisnici ih koriste da ispituju
 * AI i SpajaPro AI o tome šta se dešava na svakoj stranici.
 */
export const aiPagePrompts: PagePromptConfig[] = [
  {
    putanja: '/',
    naslov: 'Početna',
    opis: 'Glavna stranica Digitalne Industrije',
    kontekst: 'Ovo je početna stranica AI IQ SUPER PLATFORMA — Kompanije SPAJA. Prikazuje pregled celokupne Digitalne Industrije, statistiku ekosistema, login i navigaciju ka svim modulima.',
    promptovi: [
      { pitanje: 'Šta je AI IQ SUPER PLATFORMA i šta sve nudi?', ikona: '🏠', kategorija: 'ai' },
      { pitanje: 'Objasni mi ceo ekosistem Kompanije SPAJA', ikona: '🌐', kategorija: 'ai' },
      { pitanje: 'Koji su glavni moduli ove platforme?', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Kako da se prijavim i pristupim Dashboard-u?', ikona: '🔐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko platformi, proizvoda i igrica ima u ekosistemu?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta je SpajaPro engine i kako radi?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/dashboard',
    naslov: 'Dashboard',
    opis: 'Kontrolna tabla sa statistikom',
    kontekst: 'Dashboard prikazuje kompletnu statistiku ekosistema — broj platformi, API ruta, dijagnostika, igrica, OMEGA AI persona, zdravlje sistema i stanje deploy-a.',
    promptovi: [
      { pitanje: 'Šta prikazuje Dashboard i koje statistike su dostupne?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da tumačim zdravlje sistema na dashboard-u?', ikona: '💚', kategorija: 'ai' },
      { pitanje: 'Koliko API ruta i dijagnostika ima platforma?', ikona: '🔢', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su ključni pokazatelji performansi ekosistema?', ikona: '📈', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcionise auto-popravka sistema?', ikona: '🔧', kategorija: 'ai' },
      { pitanje: 'Objasni mi OMEGA AI statistiku na Dashboard-u', ikona: '🧠', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/industrija',
    naslov: 'Industrija',
    opis: 'O digitalnoj industriji',
    kontekst: 'Stranica Industrija opisuje celokupnu Digitalnu Industriju Kompanije SPAJA — sve platforme, ekosistem, organizacionu strukturu i viziju.',
    promptovi: [
      { pitanje: 'Šta je Digitalna Industrija i kako funkcioniše?', ikona: '🏭', kategorija: 'ai' },
      { pitanje: 'Koje platforme čine Digitalnu Industriju?', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Kako je organizovana Kompanija SPAJA?', ikona: '🏢', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su ciljevi i vizija Digitalne Industrije?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako OMEGA AI doprinosi industriji?', ikona: '🧠', kategorija: 'ai' },
      { pitanje: 'Objasni mi ekosistemski pristup platformi', ikona: '🌐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/platforme',
    naslov: 'Platforme',
    opis: 'Sve platforme u ekosistemu',
    kontekst: 'Stranica Platforme prikazuje sve platforme u ekosistemu — kategorisane po tipu (jezgro, finansije, AI, globalno, socijalno, alati) sa statusom, URL-ovima i deploy informacijama.',
    promptovi: [
      { pitanje: 'Koliko platformi ima u ekosistemu i koje su?', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Koje su kategorije platformi?', ikona: '📁', kategorija: 'ai' },
      { pitanje: 'Koja platforma je najvažnija i zašto?', ikona: '⭐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše deploy svake platforme?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje platforme su aktivne, a koje u razvoju?', ikona: '🔄', kategorija: 'ai' },
      { pitanje: 'Objasni mi razliku između jezgro i AI platformi', ikona: '💡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/omega-ai',
    naslov: 'OMEGA AI',
    opis: '21 OMEGA AI persona u 8 oktava',
    kontekst: 'OMEGA AI stranica prikazuje 21 AI personu organizovanu u 8 oktavnih nivoa. Svaka persona ima specijalizovanu ulogu — od temelj persone do evolucione persone. Ukupno 40.000.562 instanci.',
    promptovi: [
      { pitanje: 'Šta je OMEGA AI i koliko persona ima?', ikona: '🧠', kategorija: 'ai' },
      { pitanje: 'Objasni mi 8 oktavnih nivoa OMEGA AI sistema', ikona: '🎵', kategorija: 'ai' },
      { pitanje: 'Koja persona je zadužena za bezbednost?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše matricno jezgro 8x8?', ikona: '🔢', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta radi svaka od 21 OMEGA AI persona?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Kako OMEGA AI komunicira sa SpajaPro engine-om?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-pro',
    naslov: 'SpajaPro Engine',
    opis: 'SpajaPro Engine verzije 6-15',
    kontekst: 'SpajaPro stranica prikazuje SpajaPro Prompt Engine verzije 6-15 sa aktivnim Prompt UI-jem. Korisnici mogu da isprobaju promptove, komuniciraju sa AI chat interfejsom i koriste biblioteku promptova.',
    promptovi: [
      { pitanje: 'Šta je SpajaPro Engine i kako radi?', ikona: '🚀', kategorija: 'ai' },
      { pitanje: 'Koje su razlike između verzija 6-15?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da koristim Prompt Konzolu?', ikona: '💬', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji promptovi su dostupni u biblioteci?', ikona: '📚', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako SpajaPro obrađuje moje upite?', ikona: '⚙️', kategorija: 'ai' },
      { pitanje: 'Koja je razlika između SpajaPro AI Chata i Prompt Konzole?', ikona: '🤖', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/prompt',
    naslov: 'Prompt',
    opis: 'Prompt sistem sa promptovima',
    kontekst: 'Prompt stranica sadrži SpajaPro Prompt Konzolu sa aktivnim Prompt UI-jem i bibliotekom promptova. Korisnici mogu da biraju iz biblioteke ili pisu svoje promptove.',
    promptovi: [
      { pitanje: 'Kako funkcioniše Prompt sistem?', ikona: '💬', kategorija: 'ai' },
      { pitanje: 'Koji su najbolji promptovi za početnike?', ikona: '🌟', kategorija: 'ai' },
      { pitanje: 'Kako da napišem efikasan prompt?', ikona: '✍️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi kategorije promptova', ikona: '📁', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako parametri utiču na rezultat prompta?', ikona: '⚙️', kategorija: 'ai' },
      { pitanje: 'Koja SpajaPro verzija je najbolja za moj prompt?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/igrice',
    naslov: 'Igrice',
    opis: '95 igrica u 18 kategorija',
    kontekst: 'Stranica Igrice prikazuje 95 igrica u 18 kategorija — od logickih i edukativnih do akcionih i simulacija. Svaka igrica je deo SPAJA ekosistema.',
    promptovi: [
      { pitanje: 'Koliko igrica ima i koje su kategorije?', ikona: '🎮', kategorija: 'ai' },
      { pitanje: 'Koja igrica je najpopularnija?', ikona: '⭐', kategorija: 'ai' },
      { pitanje: 'Kako igrice funkcionišu unutar platforme?', ikona: '🕹️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi gaming ekosistem Kompanije SPAJA', ikona: '🎲', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje edukativne igrice su dostupne?', ikona: '📚', kategorija: 'ai' },
      { pitanje: 'Kako da pristupim igricama?', ikona: '🔓', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/ekosistem',
    naslov: 'Ekosistem',
    opis: 'Celokupan pregled ekosistema',
    kontekst: 'Ekosistem stranica prikazuje celokupan pregled svih platformi, servisa, sajtova i komponenti Kompanije SPAJA. Organizovano po kategorijama sa URL-ovima.',
    promptovi: [
      { pitanje: 'Šta čini celokupan ekosistem SPAJA?', ikona: '🌐', kategorija: 'ai' },
      { pitanje: 'Kako su platforme međusobno povezane?', ikona: '🔗', kategorija: 'ai' },
      { pitanje: 'Koji sajtovi su deo ekosistema?', ikona: '🌍', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše integracija između platformi?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su planovi za proširenje ekosistema?', ikona: '📈', kategorija: 'ai' },
      { pitanje: 'Objasni mi arhitekturu ekosistema', ikona: '🏗️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/eksosistzdacija',
    naslov: 'Eksosistzdacija',
    opis: 'Konsolidacija i mapiranje ekosistemskih tokova',
    kontekst: 'Eksosistzdacija je modul za povezivanje platformi, operativnih procesa i AI podsistema u jedan centralni pregled sa fokusom na stabilnost i usklađenost.',
    promptovi: [
      { pitanje: 'Šta je Eksosistzdacija i čemu služi?', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Kako se Eksosistzdacija razlikuje od stranice Ekosistem?', ikona: '⚖️', kategorija: 'ai' },
      { pitanje: 'Koji su ključni operativni tokovi koje ovaj modul povezuje?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da pratim stabilnost i usklađenost kroz ovaj modul?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje platforme i API rute su obuhvaćene u pregledu?', ikona: '🗺️', kategorija: 'ai' },
      { pitanje: 'Kako Eksosistzdacija pomaže za dalju evoluciju sistema?', ikona: '📈', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/banka',
    naslov: 'Banka',
    opis: 'SPAJA Banka platforma',
    kontekst: 'SPAJA Banka je finansijska platforma ekosistema sa bankarskim uslugama, upravljanjem sredstvima i finansijskim operacijama.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Banka i koje usluge nudi?', ikona: '🏦', kategorija: 'ai' },
      { pitanje: 'Kako funkcionišu finansijske operacije?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Koje valute su podržane?', ikona: '💱', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako je osigurana bezbednost transakcija?', ikona: '🔒', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji finansijski proizvodi su dostupni?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da otvorim račun u SPAJA Banci?', ikona: '📝', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/menjacnica',
    naslov: 'Menjačnica',
    opis: 'SPAJA Menjačnica platforma',
    kontekst: 'SPAJA Menjacnica je platforma za konverziju valuta unutar ekosistema sa podrškom za više valuta.',
    promptovi: [
      { pitanje: 'Kako funkcioniše SPAJA Menjačnica?', ikona: '💱', kategorija: 'ai' },
      { pitanje: 'Koje valute mogu da menjam?', ikona: '💵', kategorija: 'ai' },
      { pitanje: 'Kako se određuje kurs razmene?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje su prednosti menjačnice?', ikona: '⭐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Da li mogu da pratim istoriju kurseva?', ikona: '📈', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše automatska konverzija?', ikona: '🔄', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/proksi',
    naslov: 'Proksi',
    opis: 'Proksi mreža i signali',
    kontekst: 'Proksi stranica prikazuje SPAJA Proksi mrezu sa ogromnim kapacitetom, signalima i infrastrukturom za komunikaciju unutar ekosistema.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Proksi mreža?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Koliki je kapacitet proksi mreže?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako funkcionišu proksi signali?', ikona: '📶', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je uloga proksi mreže u ekosistemu?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se koristi WiFi antena proksi?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Objasni mi proksi GitHub deploy', ikona: '🐙', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/mobilna-mreza',
    naslov: 'Mobilna Mreža',
    opis: 'SPAJA Mobilna Mreža sa 4 centrale',
    kontekst: 'SPAJA Mobilna Mreža ima 4 centrale sa pozivnim brojevima +38177, +38188, +38178, +38187. Pruža mobilne komunikacione usluge.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Mobilna Mreža?', ikona: '📱', kategorija: 'ai' },
      { pitanje: 'Koliko centrala ima i gde su?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Koji su pozivni brojevi?', ikona: '📞', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše mobilna infrastruktura?', ikona: '🏗️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje usluge pruža mobilna mreža?', ikona: '💡', kategorija: 'ai' },
      { pitanje: 'Kako se povezuje mobilna mreža sa proksi mrežom?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/deploy',
    naslov: 'Deploy',
    opis: 'Status deploy-a platformi',
    kontekst: 'Deploy stranica prikazuje status deploy-a svih platformi na Vercel-u — koji su aktivni, koji su u pripremi, build komande i domeni.',
    promptovi: [
      { pitanje: 'Kako funkcioniše deploy platformi?', ikona: '🚀', kategorija: 'ai' },
      { pitanje: 'Koje platforme su deploy-ovane i gde?', ikona: '🌍', kategorija: 'ai' },
      { pitanje: 'Šta znači status deploy-a?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da proverim da li je deploy uspešan?', ikona: '✅', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su najčešći problemi pri deploy-u?', ikona: '⚠️', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše automatski deploy na Vercel?', ikona: '⚡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/auto-popravka',
    naslov: 'Auto-Popravka',
    opis: 'Autonomni sistem za popravku',
    kontekst: 'Auto-Popravka je autonomni dijagnostički sistem koji automatski detektuje i popravlja probleme u ekosistemu.',
    promptovi: [
      { pitanje: 'Kako funkcioniše Auto-Popravka?', ikona: '🔧', kategorija: 'ai' },
      { pitanje: 'Koje probleme može automatski da popravi?', ikona: '🛠️', kategorija: 'ai' },
      { pitanje: 'Koliko dijagnostika sistem proverava?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se izračunava zdravlje sistema?', ikona: '💚', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko brzo se automatski detektuju greške?', ikona: '⚡', kategorija: 'ai' },
      { pitanje: 'Šta ako auto-popravka ne može da reši problem?', ikona: '🆘', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/ai-platforma',
    naslov: 'AI Platforma',
    opis: 'AI platforma i modeli',
    kontekst: 'AI Platforma stranica prikazuje sve AI modele i servise u ekosistemu — OMEGA AI, SpajaPro, Claude, OpenAI integracije.',
    promptovi: [
      { pitanje: 'Koji AI modeli su dostupni na platformi?', ikona: '🤖', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše AI platforma?', ikona: '🧠', kategorija: 'ai' },
      { pitanje: 'Šta je razlika između OMEGA AI i SpajaPro?', ikona: '⚖️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da koristim AI asistenta?', ikona: '💬', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su AI planovi i cene?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Kako AI platforma obrađuje podatke?', ikona: '🔄', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/kompanija',
    naslov: 'Kompanija SPAJA',
    opis: 'O matičnoj kompaniji SPAJA',
    kontekst: 'Stranica o Kompaniji SPAJA — osnivac, istorija, vizija, misija i organizaciona struktura matične kompanije.',
    promptovi: [
      { pitanje: 'Ko je osnivač Kompanije SPAJA?', ikona: '👤', kategorija: 'ai' },
      { pitanje: 'Koja je misija i vizija kompanije?', ikona: '🎯', kategorija: 'ai' },
      { pitanje: 'Kako je kompanija organizovana?', ikona: '🏢', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su glavni proizvodi kompanije?', ikona: '📦', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko zaposlenih ima kompanija?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Koje su buduce inicijative kompanije?', ikona: '🔮', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/pricing',
    naslov: 'Pricing & Login',
    opis: 'Pricing planovi i registracija',
    kontekst: 'Pricing stranica prikazuje planove, cene i opcije registracije za platformu.',
    promptovi: [
      { pitanje: 'Koji planovi su dostupni i koliko koštaju?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Šta je uključeno u svaki plan?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Kako da se registrujem?', ikona: '📝', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je razlika između besplatnog i premium plana?', ikona: '⭐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Da li postoji probni period?', ikona: '🆓', kategorija: 'ai' },
      { pitanje: 'Kako da nadogradim plan?', ikona: '⬆️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/login',
    naslov: 'Prijava',
    opis: 'Prijava na platformu',
    kontekst: 'Login stranica omogućava prijavu na AI IQ SUPER PLATFORMA sa email-om i lozinkom. Sistem koristi Zero Trust arhitekturu sa JWT tokenima.',
    promptovi: [
      { pitanje: 'Kako da se prijavim na platformu?', ikona: '🔐', kategorija: 'ai' },
      { pitanje: 'Šta da radim ako sam zaboravio lozinku?', ikona: '🔑', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše bezbednost prijave?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta je Zero Trust arhitektura?', ikona: '🔒', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da napravim nalog?', ikona: '📝', kategorija: 'ai' },
      { pitanje: 'Koje uloge i nivoi pristupa postoje?', ikona: '👥', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/registracija',
    naslov: 'Registracija',
    opis: 'Kreiranje naloga',
    kontekst: 'Registracija stranica za kreiranje novog korisničkog naloga na platformi.',
    promptovi: [
      { pitanje: 'Kako da se registrujem?', ikona: '📝', kategorija: 'ai' },
      { pitanje: 'Koji podaci su potrebni za registraciju?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Šta dobijam registracijom?', ikona: '🎁', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko je sigurna registracija?', ikona: '🔒', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko traje proces registracije?', ikona: '⏱️', kategorija: 'ai' },
      { pitanje: 'Da li mogu da koristim Google/GitHub za registraciju?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/dimenzije',
    naslov: 'Dimenzije',
    opis: 'Dimenzionalni sistem 360D-5760D',
    kontekst: 'Dimenzije stranica prikazuje SPAJA dimenzionalni sistem od 360D do 5760D sa oktavnim nivoima.',
    promptovi: [
      { pitanje: 'Šta je dimenzionalni sistem SPAJA?', ikona: '🌀', kategorija: 'ai' },
      { pitanje: 'Koliko dimenzija sistem podržava?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako funkcionišu oktavni nivoi u dimenzijama?', ikona: '🎵', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Čemu služi dimenzionalni sistem?', ikona: '💡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se dimenzije koriste u AI?', ikona: '🤖', kategorija: 'ai' },
      { pitanje: 'Objasni mi 360D do 5760D raspon', ikona: '📈', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/it-proizvodi',
    naslov: 'IT Proizvodi',
    opis: 'Svi IT proizvodi digitalne industrije',
    kontekst: 'IT Proizvodi stranica prikazuje sve IT proizvode i alate Kompanije SPAJA.',
    promptovi: [
      { pitanje: 'Koji IT proizvodi su dostupni?', ikona: '⚙️', kategorija: 'ai' },
      { pitanje: 'Kako se IT proizvodi koriste u ekosistemu?', ikona: '🔗', kategorija: 'ai' },
      { pitanje: 'Koji proizvod je najkorisniji za developere?', ikona: '👨‍💻', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da koristim IT proizvode?', ikona: '📖', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su najnoviji IT proizvodi?', ikona: '🆕', kategorija: 'ai' },
      { pitanje: 'Kako da doprinesem razvoju proizvoda?', ikona: '🛠️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/blog',
    naslov: 'Blog & FAQ',
    opis: 'SPAJA Blog & FAQ',
    kontekst: 'Blog i FAQ stranica sa člancima, vodičima i odgovorima na često postavljana pitanja.',
    promptovi: [
      { pitanje: 'Koji članci su dostupni na blogu?', ikona: '📝', kategorija: 'ai' },
      { pitanje: 'Gde mogu da nađem odgovore na česta pitanja?', ikona: '❓', kategorija: 'ai' },
      { pitanje: 'Koji su najnoviji vodiči?', ikona: '📚', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da doprinesem blogu?', ikona: '✍️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje teme se obrađuju na blogu?', ikona: '🏷️', kategorija: 'ai' },
      { pitanje: 'Gde su uputstva za korišćenje platforme?', ikona: '📖', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/security',
    naslov: 'Bezbednost',
    opis: 'OMEGA Bezbednosni sistem',
    kontekst: 'Bezbednost stranica opisuje sigurnosne mehanizme — Zero Trust, AES-256-GCM enkripciju, PBKDF2-SHA512 i JWT tokene.',
    promptovi: [
      { pitanje: 'Kako je osigurana bezbednost platforme?', ikona: '🔒', kategorija: 'ai' },
      { pitanje: 'Šta je Zero Trust arhitektura?', ikona: '🛡️', kategorija: 'ai' },
      { pitanje: 'Koja enkripcija se koristi?', ikona: '🔐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se štite korisnički podaci?', ikona: '💾', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta je brute-force zaštita?', ikona: '🚫', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše 2FA?', ikona: '📱', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-univerzalni-prompt',
    naslov: 'SPAJA Univerzalni Prompt',
    opis: 'SpajaUltraOmegaCore programski jezik',
    kontekst: 'Univerzalni Prompt stranica opisuje SpajaUltraOmegaCore programski jezik sa paradigmama, tipovima podataka, operatorima i naredbama.',
    promptovi: [
      { pitanje: 'Šta je SpajaUltraOmegaCore?', ikona: '🧬', kategorija: 'ai' },
      { pitanje: 'Koje paradigme jezik podržava?', ikona: '🎵', kategorija: 'ai' },
      { pitanje: 'Kako da pišem kod u ovom jeziku?', ikona: '💻', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta znači -∞Ω+∞ spektar?', ikona: '♾️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su osnovni tipovi podataka?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako funkcionišu operatori jezika?', ikona: '⚡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-platforma',
    naslov: 'Digitalna Platforma',
    opis: 'Kompletan digitalni ekosistem',
    kontekst: 'Digitalna Platforma stranica prikazuje kompletni digitalni ekosistem sa svim komponentama — AI, finansije, igrice, deploy.',
    promptovi: [
      { pitanje: 'Šta je Digitalna Platforma SPAJA?', ikona: '🌐', kategorija: 'ai' },
      { pitanje: 'Koje komponente čine digitalnu platformu?', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Kako pristupiti svim funkcijama platforme?', ikona: '🔑', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je razlika između ove i glavne platforme?', ikona: '⚖️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su najvažniji moduli platforme?', ikona: '🏗️', kategorija: 'ai' },
      { pitanje: 'Kako da integrisem sa digitalnom platformom?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/omega-ai-suport',
    naslov: 'OMEGA AI Suport',
    opis: 'Maksimalni AI suport',
    kontekst: 'OMEGA AI Suport stranica sa informacijama o podrsci — 21 persona, telefonski brojevi, emailovi i AI dispatch.',
    promptovi: [
      { pitanje: 'Kako da kontaktiram podršku?', ikona: '📞', kategorija: 'ai' },
      { pitanje: 'Koji kanali podrške su dostupni?', ikona: '📨', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše AI dispatch podrška?', ikona: '🤖', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko AI persona pruža podršku?', ikona: '👥', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko brzo dobijam odgovor?', ikona: '⏱️', kategorija: 'ai' },
      { pitanje: 'Da li podrška radi 24/7?', ikona: '🕐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/monitoring-live',
    naslov: 'Monitoring Live',
    opis: 'SPAJA streaming platforma',
    kontekst: 'Monitoring Live je streaming platforma nalik Twitch-u za live praćenje i emitovanje sadržaja.',
    promptovi: [
      { pitanje: 'Šta je Monitoring Live?', ikona: '🎥', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše live streaming?', ikona: '📡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje kanale mogu da gledam?', ikona: '📺', kategorija: 'ai' },
      { pitanje: 'Kako da pokrenem sopstveni stream?', ikona: '🎬', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko istovremenih gledalaca podržava?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Koji kvalitet videa je dostupan?', ikona: '📊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalni-televizor',
    naslov: 'Digitalni Televizor',
    opis: 'SPAJA Univerzalni Digitalni Televizor',
    kontekst: 'Digitalni Televizor sa 12 kanala i live TV mogućnostima.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Digitalni Televizor?', ikona: '📺', kategorija: 'ai' },
      { pitanje: 'Koliko kanala je dostupno?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Kako da gledam live TV?', ikona: '🎬', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji sadržaj emituju kanali?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Da li je televizor besplatan?', ikona: '🆓', kategorija: 'ai' },
      { pitanje: 'Kako da pristupim programskom vodiču?', ikona: '📖', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-digitalni-brouvzer',
    naslov: 'Digitalni Brouvzer',
    opis: 'SPAJA sopstveni browser',
    kontekst: 'SPAJA Digitalni Brouvzer — sopstveni web browser sa motorom, backend-om, providnim frontendom, deploy, import i export.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Digitalni Brouvzer?', ikona: '🌐', kategorija: 'ai' },
      { pitanje: 'Koje su prednosti sopstvenog browsera?', ikona: '⭐', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše engine browsera?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako importovati/exportovati podatke?', ikona: '📂', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su bezbednosni mehanizmi browsera?', ikona: '🛡️', kategorija: 'ai' },
      { pitanje: 'Kako da instaliram SPAJA browser?', ikona: '📥', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-digitalni-kompjuter',
    naslov: 'Digitalni Kompjuter',
    opis: 'SPAJA Digitalni Kompjuter',
    kontekst: 'SPAJA Digitalni Kompjuter sa GPU 8.700.000, RAM 276.000 GB — zakup kao usluga.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Digitalni Kompjuter?', ikona: '🖥️', kategorija: 'ai' },
      { pitanje: 'Koliki su hardverski resursi?', ikona: '💾', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše zakup kompjutera?', ikona: '🔑', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Za šta se koristi ovaj kompjuter?', ikona: '💡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko GPU jedinica ima?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da pristupim remote kompjuteru?', ikona: '🌐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-generator-engine',
    naslov: 'Generator Endžina',
    opis: 'SPAJA Generator za engine-e',
    kontekst: 'SPAJA Generator Engine — generator za kreiranje novih engine-a u ekosistemu.',
    promptovi: [
      { pitanje: 'Šta je Generator Endžina?', ikona: '🔧', kategorija: 'ai' },
      { pitanje: 'Kako da generišem novi engine?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji engine-i su vec generisani?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše proces generisanja?', ikona: '🔄', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje parametre mogu da podesim?', ikona: '🎛️', kategorija: 'ai' },
      { pitanje: 'Kako se engine testira posle generisanja?', ikona: '🧪', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-render-medija',
    naslov: 'Render Medija',
    opis: 'SPAJA Render za slike i video',
    kontekst: 'SPAJA Render Medija — rendering engine za slike i video sadržaj.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Render Medija?', ikona: '🎬', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše rendering?', ikona: '🖼️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje formate podržava render?', ikona: '📁', kategorija: 'ai' },
      { pitanje: 'Kako da renderujem slike i video?', ikona: '🎨', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko vremena treba za rendering?', ikona: '⏱️', kategorija: 'ai' },
      { pitanje: 'Koja je maksimalna rezolucija?', ikona: '📊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/unit-testovi',
    naslov: 'Unit Testovi',
    opis: 'SPAJA Unit Testovi',
    kontekst: 'Unit Testovi stranica sa 12 test suita i 94.8% pokrivenost koda.',
    promptovi: [
      { pitanje: 'Koliko unit testova ima platforma?', ikona: '🧪', kategorija: 'ai' },
      { pitanje: 'Kolika je pokrivenost koda testovima?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše test sistem?', ikona: '✅', kategorija: 'ai' },
      { pitanje: 'Koje test suite postoje?', ikona: '📁', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da pokrenem testove lokalno?', ikona: '💻', kategorija: 'ai' },
      { pitanje: 'Koji testovi su najvažniji za bezbednost?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/ai-iq-monitoring',
    naslov: 'AI IQ Monitoring',
    opis: 'Praćenje grešaka',
    kontekst: 'AI IQ Monitoring — Sentry-like sistem za praćenje i analizu grešaka u celom ekosistemu.',
    promptovi: [
      { pitanje: 'Kako funkcioniše AI IQ Monitoring?', ikona: '🔍', kategorija: 'ai' },
      { pitanje: 'Koje greške sistem prati?', ikona: '🐛', kategorija: 'ai' },
      { pitanje: 'Kako tumačiti monitoring podatke?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se automatski rešavaju greške?', ikona: '🔧', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko alerta sistem može da obradi?', ikona: '🔔', kategorija: 'ai' },
      { pitanje: 'Kako da konfigurisem notifikacije?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/io-openui-ao-gaming-platforma',
    naslov: 'Gaming Platforma',
    opis: 'IO/OPENUI/AO Gaming',
    kontekst: 'Gaming platforma sa 95+ igrica — SPAJA Univerzalni Engine nad igricama.',
    promptovi: [
      { pitanje: 'Šta je IO/OPENUI/AO Gaming Platforma?', ikona: '🎮', kategorija: 'ai' },
      { pitanje: 'Koje igrice su dostupne?', ikona: '🕹️', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše gaming engine?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da igram igrice na platformi?', ikona: '🎲', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su multiplayer režimi?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Kako da napravim sopstvenu igricu?', ikona: '🛠️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/io-openui-ao-laboratorija',
    naslov: 'Laboratorija',
    opis: 'Laboratorija za simulacije',
    kontekst: 'IOOpenUIAO Laboratorija za Simulacije — eksperimentalna laboratorija za testiranje i simulacije.',
    promptovi: [
      { pitanje: 'Šta je Laboratorija za Simulacije?', ikona: '🔬', kategorija: 'ai' },
      { pitanje: 'Koje simulacije su dostupne?', ikona: '🧪', kategorija: 'ai' },
      { pitanje: 'Kako da pokrenem simulaciju?', ikona: '▶️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Čemu služi laboratorija?', ikona: '💡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su rezultati dosadašnjih simulacija?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da sačuvam rezultate eksperimenta?', ikona: '💾', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/omega-projekat-plasiranje',
    naslov: 'OMEGA Plasiranje',
    opis: 'Automatsko plasiranje u opticaj',
    kontekst: 'OMEGA PROJEKAT — automatsko plasiranje u opticaj sa 10 faza i 10 sistema.',
    promptovi: [
      { pitanje: 'Šta je OMEGA projekat plasiranja?', ikona: '🚀', kategorija: 'ai' },
      { pitanje: 'Koje su faze plasiranja?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše automatsko plasiranje?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji sistemi su uključeni u plasiranje?', ikona: '🏗️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko traje kompletno plasiranje?', ikona: '⏱️', kategorija: 'ai' },
      { pitanje: 'Kako da pratim napredak plasiranja?', ikona: '📈', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/omega-projekat-zvanično-otvaranje',
    naslov: 'Zvanično Otvaranje',
    opis: 'OMEGA projekat zvanično otvaranje',
    kontekst: 'OMEGA PROJEKAT zvanično otvaranje — verifikacija, saglasnost osnivača i pokretanje.',
    promptovi: [
      { pitanje: 'Šta je zvanično otvaranje OMEGA projekta?', ikona: '🎉', kategorija: 'ai' },
      { pitanje: 'Koji su koraci za otvaranje?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše verifikacija?', ikona: '✅', kategorija: 'ai' },
      { pitanje: 'Ko daje saglasnost za otvaranje?', ikona: '👤', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji su preduvslovi za zvanično otvaranje?', ikona: '📌', kategorija: 'ai' },
      { pitanje: 'Kako izgleda ceremonija otvaranja?', ikona: '🎊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/proksi-github-deploy',
    naslov: 'Proksi GitHub Deploy',
    opis: 'GitHub deploy sistem',
    kontekst: 'Proksi GitHub Deploy sistem za automatski deploy platformi sa GitHub-a.',
    promptovi: [
      { pitanje: 'Kako funkcioniše Proksi GitHub Deploy?', ikona: '🐙', kategorija: 'ai' },
      { pitanje: 'Kako da deploy-ujem sa GitHub-a?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji repozitorijumi se deploy-uju automatski?', ikona: '📦', kategorija: 'ai' },
      { pitanje: 'Kako da proverim status deploy-a na GitHub-u?', ikona: '✅', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je razlika između Vercel i GitHub deploy-a?', ikona: '⚖️', kategorija: 'ai' },
      { pitanje: 'Kako da konfigurisem CI/CD pipeline?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/proksi-wifi-antena',
    naslov: 'WiFi Antena',
    opis: 'Proksi WiFi Antena',
    kontekst: 'Proksi WiFi Antena sistem za bežičnu komunikaciju u ekosistemu.',
    promptovi: [
      { pitanje: 'Šta je Proksi WiFi Antena?', ikona: '📶', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše WiFi antena?', ikona: '📡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji je domet WiFi antene?', ikona: '🌐', kategorija: 'ai' },
      { pitanje: 'Kako se WiFi antena integriše sa proksi mrežom?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje frekvencije podržava antena?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako da optimizujem WiFi signal?', ikona: '⚡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/organizacija',
    naslov: 'Organizacija SPAJA',
    opis: 'Interna organizacija',
    kontekst: 'Interna organizaciona struktura Kompanije SPAJA.',
    promptovi: [
      { pitanje: 'Kako je organizovana Kompanija SPAJA?', ikona: '🏛️', kategorija: 'ai' },
      { pitanje: 'Koji sektori postoje u organizaciji?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Ko su ključni članovi organizacije?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše donošenje odluka?', ikona: '⚖️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je hijerarhija u organizaciji?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako se organizacija razvija?', ikona: '📈', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/organizacije',
    naslov: 'Organizacije',
    opis: 'Organizacije u ekosistemu',
    kontekst: 'Sve organizacije koje su deo SPAJA ekosistema.',
    promptovi: [
      { pitanje: 'Koje organizacije su deo ekosistema?', ikona: '🏢', kategorija: 'ai' },
      { pitanje: 'Kako su organizacije međusobno povezane?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko organizacija čini ekosistem?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koja organizacija upravlja kojim sektorom?', ikona: '🏗️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da saradjujem sa organizacijama?', ikona: '🤝', kategorija: 'ai' },
      { pitanje: 'Koje su uloge organizacija u digitalnoj industriji?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/kompanije',
    naslov: 'Kompanije',
    opis: 'Kompanije u ekosistemu',
    kontekst: 'Sve kompanije koje su deo SPAJA ekosistema.',
    promptovi: [
      { pitanje: 'Koje kompanije čine ekosistem?', ikona: '🏛️', kategorija: 'ai' },
      { pitanje: 'Kako su kompanije povezane sa SPAJA?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko kompanija je u ekosistemu?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koja kompanija je zadužena za AI?', ikona: '🤖', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako kompanije sarađuju međusobno?', ikona: '🤝', kategorija: 'ai' },
      { pitanje: 'Koji su proizvodi svake kompanije?', ikona: '📦', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/proizvodi',
    naslov: 'Proizvodi (EN)',
    opis: 'IT proizvodi — engleski prikaz',
    kontekst: 'IT proizvodi i alati u engleskom prikazu.',
    promptovi: [
      { pitanje: 'What IT products are available?', ikona: '📦', kategorija: 'ai' },
      { pitanje: 'How do the products integrate?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Which products are most popular?', ikona: '⭐', kategorija: 'ai' },
      { pitanje: 'How to get started with products?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'What are the pricing options?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'How does product support work?', ikona: '🛠️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/oktavne-eksponencijalne-funkcije',
    naslov: 'Eksponencijalne Funkcije',
    opis: 'Oktavni monolog',
    kontekst: 'Oktavni monolog eksponencijalnog ekvivalenta — figuracioni centar i matricno jedinjenje.',
    promptovi: [
      { pitanje: 'Šta su oktavne eksponencijalne funkcije?', ikona: '📈', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše matricno jedinjenje?', ikona: '🔢', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi figuracioni centar', ikona: '🌀', kategorija: 'ai' },
      { pitanje: 'Kako se koriste eksponencijalne funkcije?', ikona: '💡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koja je veza oktava i eksponencijala?', ikona: '🎵', kategorija: 'ai' },
      { pitanje: 'Kako se primenjuje u OMEGA AI sistemu?', ikona: '🧠', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/zaboravljena-lozinka',
    naslov: 'Zaboravljena Lozinka',
    opis: 'Reset lozinke',
    kontekst: 'Stranica za resetovanje zaboravljene lozinke.',
    promptovi: [
      { pitanje: 'Kako da resetujem lozinku?', ikona: '🔑', kategorija: 'ai' },
      { pitanje: 'Koliko traje proces resetovanja?', ikona: '⏱️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Šta ako nemam pristup email-u?', ikona: '📧', kategorija: 'ai' },
      { pitanje: 'Kako da napravim jaču lozinku?', ikona: '💪', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Da li je resetovanje bezbedno?', ikona: '🛡️', kategorija: 'ai' },
      { pitanje: 'Koliko puta mogu da resetujem lozinku?', ikona: '🔄', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/eksponat-glavnog-jezgra',
    naslov: 'EKSPONAT GLAVNOG JEZGRA',
    opis: 'Ilustrovani oktavni sistem — cinemetričan oblik jedinjenja',
    kontekst: 'Eksponat glavnog jezgra u ilustrovanom oktavnom sistemu — eksponicionalni oblik cinemetričnog jedinjenja u srazmernom centimentarnom sjedinjavanju.',
    promptovi: [
      { pitanje: 'Šta je eksponat glavnog jezgra?', ikona: '🔬', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše cinemetričan oblik jedinjenja?', ikona: '🧪', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi ilustrovani oktavni sistem', ikona: '🎵', kategorija: 'ai' },
      { pitanje: 'Šta je oktodomolni kuzmetrijski paravan?', ikona: '🌐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se računa eksponat koeficijent?', ikona: '📐', kategorija: 'ai' },
      { pitanje: 'Kako se eksponat jezgra uklapa u OMEGA AI sistem?', ikona: '🧠', kategorija: 'spaja-pro-ai' },
    ],
  },
  // ── Digitalna Industrija — rizici i finansije ────────────────────────────
  {
    putanja: '/digitalna-industrija-valutni-rizik',
    naslov: 'Digitalna Industrija — Valutni Rizik',
    opis: 'Centralni registar valutne izloženosti i limita',
    kontekst: 'Stranica prikazuje FX portfolije, valutnu izloženost i limite Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Koji su ključni valutni rizici Digitalne Industrije?', ikona: '💱', kategorija: 'ai' },
      { pitanje: 'Kako se upravlja FX izloženošću?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koji su limiti valutnih pozicija?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi valutni rizik u kontekstu Srbije', ikona: '🇷🇸', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-hedzing',
    naslov: 'Digitalna Industrija — Hedzing',
    opis: 'Centralni registar hedzing ugovora',
    kontekst: 'Registar hedzing instrumenata za zaštitu od valutnog i kamatnog rizika Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji hedzing instrumenti su u upotrebi?', ikona: '🛡️', kategorija: 'ai' },
      { pitanje: 'Kako hedzing štiti od valutnog rizika?', ikona: '💱', kategorija: 'ai' },
      { pitanje: 'Koji su troškovi hedzing programa?', ikona: '💰', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi hedzing strategiju platforme', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-kreditni-rizik',
    naslov: 'Digitalna Industrija — Kreditni Rizik',
    opis: 'Centralni registar kreditne izloženosti, PD/LGD i kolaterala',
    kontekst: 'Kreditna izloženost, verovatnoća neplaćanja (PD), gubitak pri neplaćanju (LGD) i kolateralna pokrivenost.',
    promptovi: [
      { pitanje: 'Koji je trenutni nivo kreditne izloženosti?', ikona: '🏦', kategorija: 'ai' },
      { pitanje: 'Šta su PD i LGD i kako se računaju?', ikona: '📐', kategorija: 'ai' },
      { pitanje: 'Kako je pokrivenost kolateralom?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje mere za smanjenje kreditnog rizika su aktivne?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-kamatni-rizik',
    naslov: 'Digitalna Industrija — Kamatni Rizik',
    opis: 'Centralni registar kamatnog rizika',
    kontekst: 'Fiksne, varijabilne i mešovite kamatne pozicije Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Koji je odnos fiksnih i varijabilnih kamatnih pozicija?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako kamatni rizik utiče na platformu?', ikona: '📈', kategorija: 'ai' },
      { pitanje: 'Koji su kamatni limiti i pragovi?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje kamatnim rizikom', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-likvidnosni-rizik',
    naslov: 'Digitalna Industrija — Likvidnosni Rizik',
    opis: 'Centralni registar likvidnosnog rizika i neto tokova',
    kontekst: 'Pokriće obaveza, neto likvidnosni tokovi i LCR (Liquidity Coverage Ratio) Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji je trenutni nivo pokrića likvidnosnih obaveza?', ikona: '💧', kategorija: 'ai' },
      { pitanje: 'Šta je LCR i koliki je kod nas?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koji su neto likvidnosni tokovi?', ikona: '🌊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se upravlja likvidnosnim rizikom?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-operativni-rizik',
    naslov: 'Digitalna Industrija — Operativni Rizik',
    opis: 'Centralni registar operativnog rizika',
    kontekst: 'Procesni, tehnološki, ljudski faktor i usklađenost kao operativni rizici Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni operativni rizici platforme?', ikona: '🧭', kategorija: 'ai' },
      { pitanje: 'Kako se prati tehnološki rizik?', ikona: '💻', kategorija: 'ai' },
      { pitanje: 'Koji su kontrolni mehanizmi za operativni rizik?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi usklađenost sa regulatornim zahtevima', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-reputacioni-rizik',
    naslov: 'Digitalna Industrija — Reputacioni Rizik',
    opis: 'Centralni registar reputacionog rizika',
    kontekst: 'Medijski, socijalni, regulatorni i partnerski reputacioni rizici Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni reputacioni rizici?', ikona: '🏛️', kategorija: 'ai' },
      { pitanje: 'Kako se prati medijski rizik?', ikona: '📰', kategorija: 'ai' },
      { pitanje: 'Koje mere za zaštitu reputacije su aktivne?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje reputacionim rizikom', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-strateski-rizik',
    naslov: 'Digitalna Industrija — Strateški Rizik',
    opis: 'Centralni registar strateškog rizika',
    kontekst: 'Strateški rizici vezani za poslovne odluke, tržišnu poziciju i dugoročne ciljeve Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni strateški rizici platforme?', ikona: '🎯', kategorija: 'ai' },
      { pitanje: 'Kako se donose strateške odluke uz upravljanje rizikom?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koji su dugoročni strateški ciljevi?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi strateški rizik u kontekstu ekosistema', ikona: '🌐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-pravni-rizik',
    naslov: 'Digitalna Industrija — Pravni Rizik',
    opis: 'Centralni registar pravnog rizika',
    kontekst: 'Pravna izloženost, sudski sporovi, ugovorni rizici i regulatorna usklađenost Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni pravni rizici platforme?', ikona: '⚖️', kategorija: 'ai' },
      { pitanje: 'Kako se upravlja ugovornim rizicima?', ikona: '📜', kategorija: 'ai' },
      { pitanje: 'Koji su aktivni pravni postupci?', ikona: '🏛️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi regulatorne zahteve', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-poreski-rizik',
    naslov: 'Digitalna Industrija — Poreski Rizik',
    opis: 'Centralni registar poreskog rizika',
    kontekst: 'Porezne obaveze, transferne cene, PDV i porez na dobit Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Koji su ključni poreski rizici?', ikona: '🧾', kategorija: 'ai' },
      { pitanje: 'Kako se prati porezna usklađenost?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Koji su transferne cene i kako utiču?', ikona: '💱', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi poreske obaveze platforme', ikona: '💰', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-compliance-rizik',
    naslov: 'Digitalna Industrija — Compliance Rizik',
    opis: 'Centralni registar compliance rizika',
    kontekst: 'Usklađenost sa regulatornim zahtevima, AML/KYC, GDPR i sektorskim propisima Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni compliance rizici?', ikona: '✅', kategorija: 'ai' },
      { pitanje: 'Kako se prati AML/KYC usklađenost?', ikona: '🔍', kategorija: 'ai' },
      { pitanje: 'Koji su GDPR zahtevi i kako se ispunjavaju?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi compliance okvir platforme', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-esg-rizik',
    naslov: 'Digitalna Industrija — ESG Rizik',
    opis: 'Centralni registar ESG rizika',
    kontekst: 'Ekološki (E), socijalni (S) i upravljački (G) rizici Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Koji su ključni ESG rizici platforme?', ikona: '🌱', kategorija: 'ai' },
      { pitanje: 'Kako se prati ekološki uticaj?', ikona: '♻️', kategorija: 'ai' },
      { pitanje: 'Koji su socijalni rizici i mere?', ikona: '👥', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi ESG strategiju Digitalne Industrije', ikona: '📊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-diskriminacija',
    naslov: 'Digitalna Industrija — Diskriminacija',
    opis: 'Centralni registar rizika diskriminacije',
    kontekst: 'Rizici diskriminacije u zapošljavanju, uslugama i pristupačnosti platforme Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni rizici diskriminacije?', ikona: '⚖️', kategorija: 'ai' },
      { pitanje: 'Kako se osigurava jednak pristup svim korisnicima?', ikona: '👥', kategorija: 'ai' },
      { pitanje: 'Koji su zakonski okviri za nediskriminaciju?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi politiku jednakih mogućnosti', ikona: '🤝', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-sajber-rizik',
    naslov: 'Digitalna Industrija — Sajber Rizik',
    opis: 'Centralni registar sajber rizika',
    kontekst: 'Sajber pretnje, incidenti, ranjivosti i zaštitne mere Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji su ključni sajber rizici platforme?', ikona: '🔒', kategorija: 'ai' },
      { pitanje: 'Kako se prate sajber incidenti?', ikona: '🚨', kategorija: 'ai' },
      { pitanje: 'Koji su zaštitni mehanizmi od sajber napada?', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi sajber bezbednosni okvir', ikona: '🔐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-kapitalni-rizik',
    naslov: 'Digitalna Industrija — Kapitalni Rizik',
    opis: 'Centralni registar kapitalnog rizika',
    kontekst: 'Kapitalna adekvatnost, CET1, ukupni kapital i kapitalni zahtevi Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji je nivo kapitalne adekvatnosti?', ikona: '🏦', kategorija: 'ai' },
      { pitanje: 'Šta je CET1 i koliki je kod nas?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koji su kapitalni zahtevi regulatora?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje kapitalnim rizikom', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-beneficije',
    naslov: 'Digitalna Industrija — Beneficije',
    opis: 'Centralni registar beneficija Digitalne Industrije',
    kontekst: 'Beneficije za zaposlene, plate, nagrade i socijalne doprinose Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Koje beneficije nudi Digitalna Industrija?', ikona: '🎁', kategorija: 'ai' },
      { pitanje: 'Kako je struktura naknada i beneficija?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Koji su socijalni doprinosi i kako se obračunavaju?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi program nagrade za zaposlene', ikona: '🏆', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-nagrade',
    naslov: 'Digitalna Industrija — Nagrade',
    opis: 'Centralni registar nagrada Digitalne Industrije',
    kontekst: 'Program nagrada, bonusi, incentivi i prepoznavanja za zaposlene i partnere.',
    promptovi: [
      { pitanje: 'Koji program nagrada postoji?', ikona: '🏆', kategorija: 'ai' },
      { pitanje: 'Kako se dobijaju bonusi i incentivi?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Koji su kriterijumi za nagrađivanje?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi sistem nagrađivanja platforme', ikona: '⭐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-plate',
    naslov: 'Digitalna Industrija — Plate',
    opis: 'Centralni registar plata Digitalne Industrije',
    kontekst: 'Platni razredi, struktura plata i isplate zaposlenih Digitalne Industrije Srbije.',
    promptovi: [
      { pitanje: 'Kako je struktura platnih razreda?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Koji su prosečni prihodi po pozicijama?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako se obračunavaju plate i doprinosi?', ikona: '🧮', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi sistem plata Digitalne Industrije', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-pozicije',
    naslov: 'Digitalna Industrija — Pozicije',
    opis: 'Centralni registar pozicija Digitalne Industrije',
    kontekst: 'Organizacione pozicije, uloge, odgovornosti i hijerarhija Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koje pozicije postoje u Digitalnoj Industriji?', ikona: '👔', kategorija: 'ai' },
      { pitanje: 'Kako je hijerarhija organizovana?', ikona: '🏢', kategorija: 'ai' },
      { pitanje: 'Koje su ključne uloge i odgovornosti?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi organizacionu strukturu', ikona: '📋', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-licencni-portfolio',
    naslov: 'Digitalna Industrija — Licencni Portfolio',
    opis: 'Centralni registar licencnog portfolija',
    kontekst: 'Sve licence, softverska prava, patenti i intelektualna svojina Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koje licence čine portfolio Digitalne Industrije?', ikona: '📜', kategorija: 'ai' },
      { pitanje: 'Koji su troškovi i rokovi licenci?', ikona: '💰', kategorija: 'ai' },
      { pitanje: 'Kako se prati usklađenost licencnog portfolija?', ikona: '✅', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje licencnim portfolijem', ikona: '📊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/digitalna-industrija-devizni-saldo',
    naslov: 'Digitalna Industrija — Devizni Saldo',
    opis: 'Centralni registar neto deviznog salda',
    kontekst: 'Neto devizni saldo — razlika između deviznih priliva i odliva Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji je trenutni neto devizni saldo?', ikona: '⚖️', kategorija: 'ai' },
      { pitanje: 'Kako se računa devizni saldo?', ikona: '🧮', kategorija: 'ai' },
      { pitanje: 'Koji su trendovi deviznog salda?', ikona: '📈', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje deviznim saldom', ikona: '💱', kategorija: 'spaja-pro-ai' },
    ],
  },
  // ── Laureatski signal processing ────────────────────────────────────────────
  {
    putanja: '/laureatski-kodek',
    naslov: 'Laureatski Kodek',
    opis: 'Kodek sistem za signal procesiranje',
    kontekst: 'Laureatski kodek je sistem za kodovanje i dekodovanje signala u platformi.',
    promptovi: [
      { pitanje: 'Šta je laureatski kodek i kako radi?', ikona: '🎵', kategorija: 'ai' },
      { pitanje: 'Koji algoritmi kodiranja se koriste?', ikona: '⚙️', kategorija: 'ai' },
      { pitanje: 'Objasni mi sistem signal procesiranja', ikona: '📡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako kodek utiče na performanse sistema?', ikona: '📊', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/laureatski-kodeks',
    naslov: 'Laureatski Kodeks',
    opis: 'Skup pravila i protokola signal procesiranja',
    kontekst: 'Laureatski kodeks definiše pravila, protokole i standarde za signal procesiranje u platformi.',
    promptovi: [
      { pitanje: 'Šta je laureatski kodeks?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Koja pravila signal procesiranja su u kodeksu?', ikona: '📜', kategorija: 'ai' },
      { pitanje: 'Kako se primenjuje kodeks u praksi?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi standarde signal procesiranja', ikona: '📡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/laureatski-koder',
    naslov: 'Laureatski Koder',
    opis: 'Sistem za kodovanje signala',
    kontekst: 'Laureatski koder transformiše ulazne podatke u standardizovane signal formate platforme.',
    promptovi: [
      { pitanje: 'Šta radi laureatski koder?', ikona: '🔧', kategorija: 'ai' },
      { pitanje: 'Koji su ulazni i izlazni formati kodera?', ikona: '🔄', kategorija: 'ai' },
      { pitanje: 'Kako se optimizuje performansa kodera?', ikona: '⚡', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi proces kodiranja signala', ikona: '📡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/laureatski-rekoder',
    naslov: 'Laureatski Rekoder',
    opis: 'Sistem za rekodovanje signala',
    kontekst: 'Laureatski rekoder prevodi signal iz jednog formata u drugi unutar platforme.',
    promptovi: [
      { pitanje: 'Šta radi laureatski rekoder?', ikona: '🔄', kategorija: 'ai' },
      { pitanje: 'Koje konverzije signala podržava rekoder?', ikona: '🔀', kategorija: 'ai' },
      { pitanje: 'Kako se pokreće rekodovanje?', ikona: '▶️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi razliku između kodera i rekodera', ikona: '💡', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/laureatski-transkoder',
    naslov: 'Laureatski Transkoder',
    opis: 'Sistem za transkodovanje signala',
    kontekst: 'Laureatski transkoder obavlja kompleksne transformacije i prevođenje između signal protokola.',
    promptovi: [
      { pitanje: 'Šta radi laureatski transkoder?', ikona: '🔀', kategorija: 'ai' },
      { pitanje: 'Koji su podržani protokoli transkodiranja?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Kako se transkoder koristi u ekosistemu?', ikona: '🌐', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi proces transkodiranja signala', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  // ── Autofinish ───────────────────────────────────────────────────────────────
  {
    putanja: '/autofinish',
    naslov: 'Autofinish',
    opis: 'Autofinish Dashboard — iteracije i metrike',
    kontekst: 'Autofinish Dashboard prikazuje napredak autonomnog dovršavanja sistema, iteracije, kategorije, SLA metrike i trend analizu.',
    promptovi: [
      { pitanje: 'Šta je Autofinish sistem i kako radi?', ikona: '🤖', kategorija: 'ai' },
      { pitanje: 'Koliko iteracija je završeno i koje su kategorije?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Koji su SLA pragovi i kako se prati performansa?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi Autofinish trend i health score', ikona: '💚', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/autofinish-nexus',
    naslov: 'Autofinish Nexus',
    opis: 'Operativni centar autofinish sistema',
    kontekst: 'Autofinish Nexus je kontrolni centar koji prikazuje health score, release readiness, error budget i DORA metrike sistema.',
    promptovi: [
      { pitanje: 'Koji je trenutni Autofinish health score?', ikona: '💚', kategorija: 'ai' },
      { pitanje: 'Šta znači release readiness i kako se meri?', ikona: '🚀', kategorija: 'ai' },
      { pitanje: 'Objasni mi DORA metrike u Nexusu', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji je error budget i kako ga koristimo?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
    ],
  },
  // ── Ostale stranice ──────────────────────────────────────────────────────────
  {
    putanja: '/moze-sve',
    naslov: 'MOŽE SVE — Super Hub',
    opis: 'Svih 6 core modula u jednom pogledu',
    kontekst: 'MOŽE SVE je Super Hub koji prikazuje svih 6 core modula platforme: SpajaPro, OMEGA AI, Proksi, Mobilna 1873G, Auto-Popravka i Autonomna Evolucija.',
    promptovi: [
      { pitanje: 'Šta sve može SPAJA platforma?', ikona: '💥', kategorija: 'ai' },
      { pitanje: 'Objasni mi svih 6 core modula', ikona: '🧩', kategorija: 'ai' },
      { pitanje: 'Koji su ključni kapaciteti platforme?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se ovi moduli međusobno integrišu?', ikona: '🌐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/sve-od-svega',
    naslov: 'SVE OD SVEGA',
    opis: 'Ultimativni mega-signal svih domena',
    kontekst: 'SVE OD SVEGA agregira sve domene: analiza, potencijal, procesuiranje i autofinish orkestracija u jedinstven mega-signal.',
    promptovi: [
      { pitanje: 'Šta je SVE OD SVEGA i šta agregira?', ikona: '🌌', kategorija: 'ai' },
      { pitanje: 'Koji su domeni obuhvaćeni mega-signalom?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako se koristi SVE OD SVEGA za donošenje odluka?', ikona: '🎯', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi orkestraciju između domena', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/protokoli',
    naslov: 'Protokoli',
    opis: 'Centralni registar protokola i procedura',
    kontekst: 'Operativni protokoli, procedure, verifikacija i audit trail Digitalne Industrije.',
    promptovi: [
      { pitanje: 'Koji protokoli su registrovani u sistemu?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Kako se verifikuju protokoli?', ikona: '✅', kategorija: 'ai' },
      { pitanje: 'Koji su audit trail zahtevi?', ikona: '🔍', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi upravljanje protokolima', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/pametni-ugovori',
    naslov: 'Pametni Ugovori',
    opis: 'Pametni ugovori i blockchain integracija',
    kontekst: 'Pametni ugovori na blockchain platformi — automatizovano izvršavanje ugovornih obaveza.',
    promptovi: [
      { pitanje: 'Šta su pametni ugovori i kako rade?', ikona: '📜', kategorija: 'ai' },
      { pitanje: 'Koji su pametni ugovori aktivni?', ikona: '⚡', kategorija: 'ai' },
      { pitanje: 'Kako se verifikuju pametni ugovori na blockchain-u?', ikona: '🔗', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi bezbednost pametnih ugovora', ikona: '🛡️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/spaja-baza-control',
    naslov: 'Spaja Baza Control',
    opis: 'Kontrolni centar Spaja baze znanja',
    kontekst: 'Kontrolni centar za upravljanje Spaja bazom znanja — status indeksiranja, zdravlje i monitoring chunk-ova.',
    promptovi: [
      { pitanje: 'Koji je status Spaja baze znanja?', ikona: '🗄️', kategorija: 'ai' },
      { pitanje: 'Koliko dokumenata i chunk-ova je indeksirano?', ikona: '📊', kategorija: 'ai' },
      { pitanje: 'Kako se pokreće re-indeksiranje?', ikona: '🔄', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi zdravlje i performanse baze', ikona: '💚', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/vercel-priklucenje',
    naslov: 'Vercel Priključenje',
    opis: 'Vercel priključenje i deploy konfiguracija',
    kontekst: 'Konfiguracija Vercel priključenja za deploy i hosting platforme na Vercel infrastrukturi.',
    promptovi: [
      { pitanje: 'Kako se platforma priključuje na Vercel?', ikona: '▲', kategorija: 'ai' },
      { pitanje: 'Koji su deploy parametri i konfiguracija?', ikona: '⚙️', kategorija: 'ai' },
      { pitanje: 'Kako se prati Vercel deploy status?', ikona: '🚀', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi Vercel hosting arhitekturu', ikona: '🌐', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/ekstrimli-ekstrem',
    naslov: 'Ekstrimli Ekstrem',
    opis: 'Ekstremno procesuiranje i operativna spremnost',
    kontekst: 'Ekstremni procesuiranje signal koji preseca sve limite sistema i pokazuje operativnu spremnost.',
    promptovi: [
      { pitanje: 'Šta je ekstrimli ekstrem signal?', ikona: '⚡', kategorija: 'ai' },
      { pitanje: 'Koji su limiti sistema i kako ih presecamo?', ikona: '🔥', kategorija: 'ai' },
      { pitanje: 'Koja je operativna spremnost sistema?', ikona: '✅', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi ekstremno procesuiranje', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/pentracija',
    naslov: 'Pentracija',
    opis: 'Dubinska analiza i probe test ekosistema',
    kontekst: 'Pentracija je modul za dubinsko testiranje, probe analizu i dijagnostiku ekosistema platforme.',
    promptovi: [
      { pitanje: 'Šta je pentracija i kako se koristi?', ikona: '🔍', kategorija: 'ai' },
      { pitanje: 'Koji su probe testovi i kako se pokreću?', ikona: '🧪', kategorija: 'ai' },
      { pitanje: 'Kakvi su rezultati dubinske analize?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi dijagnostiku ekosistema', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  },
  {
    putanja: '/panetracija-2',
    naslov: 'Panetracija 2',
    opis: 'V2 proširena dijagnostika sa SLA i trend praćenjem',
    kontekst: 'Panetracija V2 proširuje dijagnostičke mogućnosti sa SLA praćenjem, trend analizom i istorijom.',
    promptovi: [
      { pitanje: 'Šta novo nosi Panetracija V2?', ikona: '🔬', kategorija: 'ai' },
      { pitanje: 'Kako SLA praćenje funkcioniše u V2?', ikona: '🎯', kategorija: 'ai' },
      { pitanje: 'Koji su trendovi u dijagnostici?', ikona: '📈', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Objasni mi razliku između V1 i V2 panetracije', ikona: '💡', kategorija: 'spaja-pro-ai' },
    ],
  },
];

/**
 * Dohvata promptove za specificnu stranicu.
 * Ako stranica nema konfigurisane promptove, vraca genericke.
 */
export function getPagePrompts(putanja: string): PagePromptConfig {
  const found = aiPagePrompts.find((p) => p.putanja === putanja);
  if (found) return found;

  // Genericki fallback za stranice bez specificne konfiguracije
  // Generise naslov iz URL putanje (npr. '/digitalna-industrija-sajber' → 'Digitalna Industrija Sajber')
  const generisanNaslov = putanja
    .replace(/^\//, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const jeRizik = putanja.includes('rizik');
  const jeFinansije = putanja.includes('devizn') || putanja.includes('kursn') || putanja.includes('valut');
  const jeIndustrija = putanja.includes('digitalna-industrija');
  const jeLaureatski = putanja.includes('laureatski');

  return {
    putanja,
    naslov: generisanNaslov,
    opis: `AI IQ SUPER PLATFORMA — ${generisanNaslov}`,
    kontekst: `Stranica ${generisanNaslov} na putanji ${putanja} u AI IQ SUPER PLATFORMA — Kompanija SPAJA.`,
    promptovi: [
      ...(jeIndustrija && jeRizik ? [
        { pitanje: `Koji su ključni rizici na ovoj stranici?`, ikona: '⚠️', kategorija: 'ai' as const },
        { pitanje: `Koje mere upravljanja rizikom su aktivne?`, ikona: '🛡️', kategorija: 'spaja-pro-ai' as const },
      ] : []),
      ...(jeFinansije ? [
        { pitanje: `Objasni mi devizne tokove na ovoj stranici`, ikona: '💱', kategorija: 'ai' as const },
        { pitanje: `Koji su trendovi finansijskih pokazatelja?`, ikona: '📈', kategorija: 'spaja-pro-ai' as const },
      ] : []),
      ...(jeLaureatski ? [
        { pitanje: `Kako funkcioniše ${generisanNaslov}?`, ikona: '📡', kategorija: 'ai' as const },
        { pitanje: `Koji su parametri signal procesiranja?`, ikona: '⚙️', kategorija: 'spaja-pro-ai' as const },
      ] : []),
      { pitanje: `Šta se dešava na stranici ${generisanNaslov}?`, ikona: '❓', kategorija: 'ai' },
      { pitanje: 'Kako da koristim ovu funkciju?', ikona: '💡', kategorija: 'ai' },
      { pitanje: 'Objasni mi sadržaj ove stranice', ikona: '📖', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje opcije imam na ovoj stranici?', ikona: '⚙️', kategorija: 'spaja-pro-ai' },
    ],
  };
}

/** Pre-computed ukupan broj konfigurisanih promptova */
const _ukupnoPromptova = aiPagePrompts.reduce((sum, p) => sum + p.promptovi.length, 0);

/** Ukupan broj konfigurisanih promptova */
export function getUkupnoAiPagePrompts(): number {
  return _ukupnoPromptova;
}

/** Ukupan broj stranica sa AI promptovima */
export function getUkupnoStranica(): number {
  return aiPagePrompts.length;
}
