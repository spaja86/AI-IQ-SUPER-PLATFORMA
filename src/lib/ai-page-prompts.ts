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
    kontekst: 'Ovo je pocetna stranica AI IQ SUPER PLATFORMA — Kompanije SPAJA. Prikazuje pregled celokupne Digitalne Industrije, statistiku ekosistema, login i navigaciju ka svim modulima.',
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
    kontekst: 'SPAJA Menjacnica je platforma za konverziju valuta unutar ekosistema sa podrskom za vise valuta.',
    promptovi: [
      { pitanje: 'Kako funkcioniše SPAJA Menjačnica?', ikona: '💱', kategorija: 'ai' },
      { pitanje: 'Koje valute mogu da menjam?', ikona: '💵', kategorija: 'ai' },
      { pitanje: 'Kako se određuje kurs razmene?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje su prednosti menjačnice?', ikona: '⭐', kategorija: 'spaja-pro-ai' },
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
    kontekst: 'SPAJA Mobilna Mreza ima 4 centrale sa pozivnim brojevima +38177, +38188, +38178, +38187. Pruza mobilne komunikacione usluge.',
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
    ],
  },
  {
    putanja: '/auto-popravka',
    naslov: 'Auto-Popravka',
    opis: 'Autonomni sistem za popravku',
    kontekst: 'Auto-Popravka je autonomni dijagnosticki sistem koji automatski detektuje i popravlja probleme u ekosistemu.',
    promptovi: [
      { pitanje: 'Kako funkcioniše Auto-Popravka?', ikona: '🔧', kategorija: 'ai' },
      { pitanje: 'Koje probleme može automatski da popravi?', ikona: '🛠️', kategorija: 'ai' },
      { pitanje: 'Koliko dijagnostika sistem proverava?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se izračunava zdravlje sistema?', ikona: '💚', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/login',
    naslov: 'Prijava',
    opis: 'Prijava na platformu',
    kontekst: 'Login stranica omogucava prijavu na AI IQ SUPER PLATFORMA sa email-om i lozinkom. Sistem koristi Zero Trust arhitekturu sa JWT tokenima.',
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
    kontekst: 'Registracija stranica za kreiranje novog korisnickog naloga na platformi.',
    promptovi: [
      { pitanje: 'Kako da se registrujem?', ikona: '📝', kategorija: 'ai' },
      { pitanje: 'Koji podaci su potrebni za registraciju?', ikona: '📋', kategorija: 'ai' },
      { pitanje: 'Šta dobijam registracijom?', ikona: '🎁', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koliko je sigurna registracija?', ikona: '🔒', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/blog',
    naslov: 'Blog & FAQ',
    opis: 'SPAJA Blog & FAQ',
    kontekst: 'Blog i FAQ stranica sa clancima, vodicima i odgovorima na cesto postavljana pitanja.',
    promptovi: [
      { pitanje: 'Koji članci su dostupni na blogu?', ikona: '📝', kategorija: 'ai' },
      { pitanje: 'Gde mogu da nađem odgovore na česta pitanja?', ikona: '❓', kategorija: 'ai' },
      { pitanje: 'Koji su najnoviji vodiči?', ikona: '📚', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako da doprinesem blogu?', ikona: '✍️', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/digitalni-televizor',
    naslov: 'Digitalni Televizor',
    opis: 'SPAJA Univerzalni Digitalni Televizor',
    kontekst: 'Digitalni Televizor sa 12 kanala i live TV mogucnostima.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Digitalni Televizor?', ikona: '📺', kategorija: 'ai' },
      { pitanje: 'Koliko kanala je dostupno?', ikona: '📡', kategorija: 'ai' },
      { pitanje: 'Kako da gledam live TV?', ikona: '🎬', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koji sadržaj emituju kanali?', ikona: '📋', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/spaja-render-medija',
    naslov: 'Render Medija',
    opis: 'SPAJA Render za slike i video',
    kontekst: 'SPAJA Render Medija — rendering engine za slike i video sadrzaj.',
    promptovi: [
      { pitanje: 'Šta je SPAJA Render Medija?', ikona: '🎬', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše rendering?', ikona: '🖼️', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Koje formate podržava render?', ikona: '📁', kategorija: 'ai' },
      { pitanje: 'Kako da renderujem slike i video?', ikona: '🎨', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/ai-iq-monitoring',
    naslov: 'AI IQ Monitoring',
    opis: 'Praćenje grešaka',
    kontekst: 'AI IQ Monitoring — Sentry-like sistem za pracenje i analizu gresaka u celom ekosistemu.',
    promptovi: [
      { pitanje: 'Kako funkcioniše AI IQ Monitoring?', ikona: '🔍', kategorija: 'ai' },
      { pitanje: 'Koje greške sistem prati?', ikona: '🐛', kategorija: 'ai' },
      { pitanje: 'Kako tumačiti monitoring podatke?', ikona: '📊', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako se automatski rešavaju greške?', ikona: '🔧', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/omega-projekat-zvanicno-otvaranje',
    naslov: 'Zvanično Otvaranje',
    opis: 'OMEGA projekat zvanično otvaranje',
    kontekst: 'OMEGA PROJEKAT zvanicno otvaranje — verifikacija, saglasnost osnivaca i pokretanje.',
    promptovi: [
      { pitanje: 'Šta je zvanično otvaranje OMEGA projekta?', ikona: '🎉', kategorija: 'ai' },
      { pitanje: 'Koji su koraci za otvaranje?', ikona: '📋', kategorija: 'spaja-pro-ai' },
      { pitanje: 'Kako funkcioniše verifikacija?', ikona: '✅', kategorija: 'ai' },
      { pitanje: 'Ko daje saglasnost za otvaranje?', ikona: '👤', kategorija: 'spaja-pro-ai' },
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
    ],
  },
  {
    putanja: '/proksi-wifi-antena',
    naslov: 'WiFi Antena',
    opis: 'Proksi WiFi Antena',
    kontekst: 'Proksi WiFi Antena sistem za bezicnu komunikaciju u ekosistemu.',
    promptovi: [
      { pitanje: 'Šta je Proksi WiFi Antena?', ikona: '📶', kategorija: 'ai' },
      { pitanje: 'Kako funkcioniše WiFi antena?', ikona: '📡', kategorija: 'spaja-pro-ai' },
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

  // Genericki promptovi za stranice bez specificne konfiguracije
  return {
    putanja,
    naslov: 'Stranica',
    opis: 'AI IQ SUPER PLATFORMA',
    kontekst: `Stranica na putanji ${pathname} u AI IQ SUPER PLATFORMA.`,
    promptovi: [
      { pitanje: 'Šta se dešava na ovoj stranici?', ikona: '❓', kategorija: 'ai' },
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
