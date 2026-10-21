import type { OmegaModuleId } from './omega';
import {
  omegaRelationId,
  type OmegaKind,
  type OmegaRelation,
} from './omega-model';

type Link = OmegaRelation<OmegaModuleId>;
const pilotTests = [
  'src/tests/spaja-ultra/pilot.test.ts',
  'src/tests/spaja-ultra/pilot-browser.test.mjs',
];
const server = 'src/lib/suoc-pilot/server.ts';
const store = 'src/lib/suoc-pilot/store.ts';
const worker = 'src/lib/suoc-pilot/worker.ts';
const panel = 'pilot/suoc/pilot.js';

function local(
  from: OmegaModuleId,
  to: OmegaModuleId,
  kind: OmegaKind,
  purpose: string,
  trigger: string,
  payload: string,
  result: string,
  code: string[],
  acceptance: string
): Link {
  return {
    id: omegaRelationId(from, to, kind),
    from,
    to,
    kind,
    state: 'implemented',
    purpose,
    contract: {
      trigger,
      payload,
      result,
      failure:
        'Greška ostaje vidljiva; nema pretpostavke o uspehu ni automatskog pokretanja novog zadatka.',
    },
    evidence: {
      code,
      tests: pilotTests,
      scope: 'Samo postojeći lokalni, numerički SUOC pilot na loopback adresi.',
    },
    activation: { missing: [], acceptance },
  };
}
function partial(
  from: OmegaModuleId,
  to: OmegaModuleId,
  kind: OmegaKind,
  purpose: string,
  payload: string,
  scope: string,
  code: string[],
  missing: string,
  acceptance: string
): Link {
  return {
    id: omegaRelationId(from, to, kind),
    from,
    to,
    kind,
    state: 'partial',
    purpose,
    contract: {
      trigger: purpose,
      payload,
      result: scope,
      failure:
        'Prekinuti operaciju i prikazati nepotvrđeno stanje; za nastavak tražiti izričitu lokalnu komandu.',
    },
    evidence: { code, tests: pilotTests, scope },
    activation: { missing: [missing], acceptance },
  };
}
function planned(
  from: OmegaModuleId,
  to: OmegaModuleId,
  kind: OmegaKind,
  purpose: string,
  payload: string,
  result: string,
  missing: string,
  acceptance: string
): Link {
  return {
    id: omegaRelationId(from, to, kind),
    from,
    to,
    kind,
    state: 'planned',
    purpose,
    contract: {
      trigger: `Predlog: ${purpose}`,
      payload,
      result,
      failure:
        kind === 'monitoring'
          ? 'Označiti podatak kao zastareo/nepoznat; odsustvo podatka nije uspeh.'
          : 'Odbiti nevažeći ulaz; sačuvati grešku uz ID zahteva; bez automatskog ponavljanja spoljnih efekata.',
    },
    evidence: {
      code: [],
      tests: [],
      scope: 'Arhitektonski predlog; adapter između ovih modula nije potvrđen.',
    },
    activation: {
      missing: [
        missing,
        'Pregled ugovora i ovlašćenja, implementacija adaptera i integracioni test uspeha/greške.',
      ],
      acceptance,
    },
  };
}

/** Curated directional relationships. No Cartesian expansion or padding to the target of 270. */
export const OMEGA_LINKS: readonly Link[] = [
  local(
    'scp',
    'suoc',
    'control',
    'Priprema i ručno pokretanje numeričkog plana',
    'IZGRADI / POKRENI u postojećem panelu',
    'Validiran plan ili ID zadatka i resume',
    'Sačuvan pauziran plan ili potvrđeno stanje zadatka',
    [panel, server, store],
    'IZGRADI ostavlja pokušaje na 0; POKRENI završava A=6 i B=21.'
  ),
  local(
    'suoc',
    'vrh',
    'control',
    'Izvršavanje dozvoljene numeričke operacije',
    'Radnik preuzme spreman korak',
    'Ponovo validiran VRH zahtev sa vezanim izlazom prethodnika',
    'Ograničen numerički rezultat ili greška',
    [worker, 'src/lib/spaja-ultra-core/vrh.ts'],
    'Nedozvoljena operacija se odbija; zavisni korak koristi sačuvan rezultat 6.'
  ),
  local(
    'vrh',
    'storage',
    'data',
    'Trajno čuvanje rezultata koraka preko pilot radnika',
    'Radnik završi VRH poziv',
    'ID zadatka/koraka, rezultat ili greška',
    'SQLite stanje i revizijski događaj',
    [worker, store],
    'Rezultati 6/21 i redosled događaja opstaju nakon ponovnog otvaranja baze.'
  ),
  local(
    'storage',
    'monitoring',
    'monitoring',
    'Čitanje lokalnog statusa i revizijskih događaja',
    'Panel učita ili osveži zadatak',
    'Sačuvani zadatak, koraci i događaji preko pilot API-ja',
    'Prikaz potvrđenog rezultata i audita',
    [store, server, panel],
    'Ponovno učitavanje prikazuje iste rezultate; nedostupan servis uklanja potvrdu trenutnog stanja.'
  ),

  planned(
    'snoe',
    'openui',
    'data',
    'Predaja vizuelnog scenarija interfejsu',
    'Verzija scenarija, čvorovi i veze',
    'Pregled scenarija bez izvršavanja',
    'Šema scenarija i adapter SNOE → OpenUI.',
    'Nepoznata verzija se odbija; pregled ne kreira zadatak.'
  ),
  planned(
    'openui',
    'scp',
    'control',
    'Predlog komande iz multimodalnog interfejsa',
    'Namera, ID plana i potvrda operatera',
    'Komanda spremna za ručni pregled',
    'Mapiranje namere u dozvoljene SCP komande.',
    'Nejasna namera ne šalje resume niti zaobilazi potvrdu.'
  ),
  planned(
    'bank',
    'backend',
    'data',
    'Pregled simuliranog finansijskog izveštaja',
    'Anonimizovan simulacioni izveštaj i valuta',
    'Validiran izveštaj bez plaćanja',
    'Izolovan finansijski sandbox i šema izveštaja.',
    'Test koristi sintetičke iznose; nema platnog naloga.'
  ),
  planned(
    'company',
    'creative',
    'data',
    'Predaja kreativnog briefa',
    'Tema, format, prava korišćenja i rok',
    'Nacrt kreativnog zadatka',
    'Ugovor briefa i ograničenja sadržaja.',
    'Nepotpun brief vraća listu nedostajućih polja.'
  ),
  planned(
    'games',
    'backend',
    'data',
    'Prijem završenog MOBA meča',
    'Verzija pravila, anonimizovan rezultat i ID meča',
    'Validiran zapis meča',
    'MOBA adapter sa deduplikacijom mečeva.',
    'Ponovljen ID meča ne pravi drugi zapis.'
  ),
  planned(
    'poker',
    'backend',
    'data',
    'Prijem rezultata turnirske ruke',
    'ID ruke, verzija špila i dozvoljeni potezi',
    'Proveren zapis bez keš operacija',
    'Adapter pravila SPAJA Poker turnira.',
    'Nevažeća karta/potez se odbija, nema prenosa novca.'
  ),
  planned(
    'transformers',
    'backend',
    'data',
    'Prijem rezultata lokalnog duela',
    'ID sesije, sektor, transformacije i rezultat',
    'Normalizovan zapis duela',
    'Adapter postojećeg prototipa u Omega ugovor.',
    'Dupla sesija se odbija; zapis ne tvrdi postojanje globalnog PvP-a.'
  ),
  planned(
    'scp',
    'agents',
    'control',
    'Delegiranje odobrenog analitičkog zadatka',
    'Cilj, budžet i dozvoljeni alati',
    'Zadatak agenta na čekanju',
    'Registar agenata, izolacija i ograničenje alata.',
    'Prekoračen budžet blokira zadatak pre izvršavanja.'
  ),
  planned(
    'agents',
    'backend',
    'control',
    'Zahtev agenta za dozvoljeni alat',
    'Identitet agenta, alat i validirani argumenti',
    'Odobren ili odbijen poziv alata',
    'Posrednik za pozive alata sa allowlist proverom.',
    'Alat van allowlist-e se odbija i beleži.'
  ),
  planned(
    'backend',
    'vrh',
    'control',
    'Prevođenje API zahteva u numerički VRH plan',
    'Verzionisan numerički zahtev i ograničenja',
    'Validiran pauziran plan',
    'Backend adapter; postojeći pilot nije opšti API gateway.',
    'Nevažeći plan ne stiže do radnika.'
  ),
  planned(
    'backend',
    'automation',
    'control',
    'Predaja ugovora na automatsku proveru',
    'Verzija ugovora i deterministički test primeri',
    'Izveštaj provera sa statusom',
    'Adapter pokretanja izolovanih provera.',
    'Nedostajući test daje nepotvrđen rezultat.'
  ),
  planned(
    'ovsm',
    'backend',
    'data',
    'Registracija autorske formule',
    'Formula, jedinice i verzija konvencije',
    'Verzionisan zapis formule',
    'Šema jedinica i porekla OVSM formule.',
    'Autorska konvencija ostaje označena, bez tvrdnje o naučnoj potvrdi.'
  ),
  planned(
    'creative',
    'backend',
    'data',
    'Registracija kreativnog artefakta',
    'Metapodaci, format, hash i prava korišćenja',
    'Zapis artefakta i porekla',
    'Ugovor artefakta i validacija hash-a.',
    'Neispravan hash ili nedostajuća prava blokiraju registraciju.'
  ),
  planned(
    'nbs',
    'bank',
    'data',
    'Ručno unošenje pregledanog institucionalnog dokumenta',
    'Izvor dokumenta, datum i oznaka ručnog pregleda',
    'Referenca dokumenta u sandbox izveštaju',
    'Parser javnih dokumenata i potvrda izvora.',
    'Dokument ne daje automatsko odobrenje niti status regulisane banke.'
  ),
  planned(
    'gpu',
    'agents',
    'data',
    'Povratak rezultata izračunavanja agentu',
    'ID posla, hash rezultata i potrošeni budžet',
    'Rezultat za proveru agenta',
    'GPU izvršni servis i ugovor rezultata.',
    'Rezultat pogrešnog posla/hash-a se odbija.'
  ),
  planned(
    'backend',
    'storage',
    'data',
    'Čuvanje verzionisanih aplikacionih zapisa',
    'Tip entiteta, ID i očekivana verzija',
    'Trajan zapis ili konflikt verzije',
    'Adapter šireg skladišta; pilot SQLite čuva samo pilot zadatke.',
    'Konkurentna izmena prijavljuje konflikt umesto tihog prepisivanja.'
  ),
  planned(
    'cloud',
    'backend',
    'control',
    'Priprema izvršnog okruženja za backend',
    'Odobren manifest, resursi i health ugovor',
    'Pripremljeno izolovano okruženje',
    'Izvršni SPAJA deployment adapter i odvojeno odobrenje infrastrukture.',
    'Nema startovanja bez odobrenog manifesta i ograničenja resursa.'
  ),
  planned(
    'security',
    'backend',
    'control',
    'Odluka politike za pristup API-ju',
    'Identitet, tražena radnja i opseg',
    'Allow/deny sa razlogom',
    'RBAC i politika opšteg backend-a.',
    'Nepoznat identitet/radnja završava deny odlukom.'
  ),
  planned(
    'pipeline',
    'cloud',
    'control',
    'Predaja pregledanog artefakta za buduće izdanje',
    'Hash artefakta, provere i ljudsko odobrenje',
    'Plan promocije, bez automatske objave',
    'Potvrđeni CI rezultati i zaseban release adapter.',
    'Bez prolaznih provera i pregleda nema promocije.'
  ),
  partial(
    'recovery',
    'storage',
    'control',
    'Oporavak prekinutog zadatka i planirani backup',
    'Sačuvano SQLite stanje i ID prekinutog koraka',
    'Postoji lokalni oporavak u blocked stanje i izričit retry; backup/restore nije implementiran.',
    [store],
    'Verzionisan backup, provera integriteta kopije i probni restore na odvojenoj bazi.',
    'Lokalni prekid čuva uspešan korak; budući restore mora dokazati isti rezultat/audit bez gubitka podataka.'
  ),
  planned(
    'automation',
    'monitoring',
    'monitoring',
    'Prikaz rezultata automatskih provera',
    'ID provere, revizija, rezultat i vreme',
    'Prikaz poslednje potvrđene provere',
    'Adapter izveštaja testova u monitoring.',
    'Izostala ili zastarela provera ostaje nepoznata, ne zelena.'
  ),

  partial(
    'security',
    'scp',
    'control',
    'Ograničavanje pristupa kontrolnom panelu',
    'Host, Origin i X-SUOC-Pilot zaglavlje',
    'Postoje loopback/Host/Origin provere; nema višekorisničke autentifikacije ili RBAC-a.',
    [server],
    'Identitet operatera, RBAC i revokacija sesije pre udaljenog ili višekorisničkog pristupa.',
    'Lokalni strani Origin se odbija; budući RBAC mora odbiti korisnika bez prava resume.'
  ),
  partial(
    'monitoring',
    'scp',
    'monitoring',
    'Pregled stanja zadatka i planiranih upozorenja',
    'Pilot status, koraci, audit i greška pristupa',
    'Postoji lokalno osvežavanje statusa; nema spoljnih alarma ili potvrde dostave.',
    [server, panel],
    'Ugovor alarma, pragovi, deduplikacija i odobren kanal obaveštavanja.',
    'Prekid lokalnog servisa sklanja potvrđeno stanje; budući alarm se evidentira najviše jednom po događaju.'
  ),

  planned(
    'snoe',
    'suoc',
    'data',
    'Prevod vizuelnog plana u SUOC program',
    'Graf operacija sa tipovima ulaza/izlaza',
    'Program za validaciju bez izvršavanja',
    'Kompajler vizuelnog plana i mapa dozvoljenih operacija.',
    'Nerešena referenca blokira prevod, nema automatskog POKRENI.'
  ),
  planned(
    'snoe',
    'creative',
    'data',
    'Predaja storyboarda za kreativni nacrt',
    'Scene, redosled i vizuelne smernice',
    'Verzionisan storyboard',
    'Šema storyboarda i povezivanje scena sa artefaktima.',
    'Nedostajući artefakt je vidljiv kao nedostajuća referenca.'
  ),
  planned(
    'openui',
    'monitoring',
    'monitoring',
    'Praćenje kvaliteta sesije interfejsa',
    'Latencija, prekidi i anonimni ID sesije',
    'Sažetak kvaliteta bez sadržaja poruka',
    'Adapter lokalne telemetrije i pravila zadržavanja.',
    'Test prekida prikazuje gubitak veze bez curenja sadržaja.'
  ),
  planned(
    'openui',
    'storage',
    'data',
    'Čuvanje verzije radnog prostora',
    'ID prostora, dokument i očekivana verzija',
    'Sačuvan dokument ili konflikt',
    'Adapter dokumenata i strategija konflikata/CRDT.',
    'Dve konkurentne izmene ne brišu tiho jedna drugu.'
  ),
  planned(
    'company',
    'bank',
    'data',
    'Simulacija budžeta projekta',
    'Sintetički troškovi, period i valuta',
    'Simulacioni pregled budžeta',
    'Ugovor budžeta i razdvajanje simulacije od stvarne naplate.',
    'Sve stavke ostaju obeležene kao simulacija.'
  ),
  planned(
    'company',
    'pipeline',
    'control',
    'Predlog izdanja projekta',
    'Obim izdanja i kriterijumi prihvatanja',
    'Zahtev za pregled izdanja',
    'Veza projekta i verzije izvornog koda.',
    'Zahtev ne preskače CI niti ljudski pregled.'
  ),
  planned(
    'games',
    'agents',
    'control',
    'Analiza MOBA drafta',
    'Verzija pravila, izbor heroja i ograničenje trajanja',
    'Objašnjeni predlog izbora',
    'Analitički adapter drafta i proverljiv skup pravila.',
    'Predlog ne menja meč i poštuje zabranjene heroje.'
  ),
  planned(
    'games',
    'storage',
    'data',
    'Arhiviranje MOBA replay-a',
    'ID meča, format i hash replay-a',
    'Verzionisan replay zapis',
    'Replay šema, kvote i prava pristupa.',
    'Prevelik ili oštećen replay se odbija.'
  ),
  planned(
    'poker',
    'agents',
    'control',
    'Provera turnirske ruke',
    'Javno stanje ruke i verzija pravila',
    'Izveštaj legalnosti poteza',
    'Deterministički validator posebnog špila.',
    'Skrivena ruka protivnika nije dostupna analitičkom agentu.'
  ),
  planned(
    'poker',
    'storage',
    'data',
    'Arhiviranje turnirskog toka',
    'ID turnira, ruke i redosled poteza',
    'Replay turnira bez finansijskih uplata',
    'Verzionisan format poteza i kontrola pristupa.',
    'Replay rekonstruiše isti redosled i rezultat.'
  ),
  planned(
    'transformers',
    'agents',
    'control',
    'Analiza ponašanja protivničkog bota',
    'Replay duela i verzija bota',
    'Izveštaj ponašanja',
    'Adapter prototipa za offline analizu.',
    'Analiza ne menja aktivnu igru i daje ponovljiv rezultat.'
  ),
  planned(
    'transformers',
    'storage',
    'data',
    'Čuvanje podešavanja i replay-a duela',
    'ID sesije, kamera, transformacije i hash',
    'Verzionisan lokalni zapis',
    'Serijalizacija stanja prototipa.',
    'Učitavanje vraća iste validne postavke bez proizvoljnog koda.'
  ),
  planned(
    'ovsm',
    'vrh',
    'data',
    'Numerička evaluacija odobrene formule',
    'Formula prevedena u dozvoljene numeričke operacije',
    'Rezultat sa jedinicama i konvencijom',
    'Adapter formula bez eval i proizvoljnog koda.',
    'Nepodržana formula se odbija; jedinice su eksplicitne.'
  ),
  planned(
    'ovsm',
    'storage',
    'data',
    'Verzionisanje formula i konvencija',
    'Formula, autor, jedinice i istorija izmena',
    'Pretraživ zapis porekla',
    'Šema naučnih/autorskih zapisa.',
    'Izmena čuva prethodnu verziju i poreklo.'
  ),
  planned(
    'creative',
    'gpu',
    'control',
    'Predlog ograničenog render zadatka',
    'Scena, format, rezolucija i limit resursa',
    'Render posao na čekanju',
    'GPU radnik, kvote i odvojeno odobrenje troška.',
    'Nedostatak resursa odbija posao bez troška ili automatske kupovine.'
  ),
  planned(
    'creative',
    'storage',
    'data',
    'Čuvanje kreativnih verzija',
    'Artefakt, hash, format i licenca',
    'Verzionisana referenca artefakta',
    'Adapter binarnog skladišta sa kvotama.',
    'Integritet i dozvoljeni format se proveravaju pre upisa.'
  ),
  planned(
    'creative',
    'company',
    'data',
    'Predaja nacrta na odobrenje',
    'Pregled artefakta, verzija i prava korišćenja',
    'Evidentiran pregled kreativnog nacrta',
    'Tok pregleda sa identitetom odobravaoca.',
    'Nacrt ostaje neobjavljen do izričitog odobrenja.'
  ),
  planned(
    'nbs',
    'storage',
    'data',
    'Arhiviranje institucionalnog nacrta',
    'Dokument, izvor, datum i verzija',
    'Lokalni arhivski zapis',
    'Klasifikacija dokumenata i kontrola pristupa.',
    'Arhiviranje ne šalje poruku instituciji.'
  ),
  planned(
    'bank',
    'nbs',
    'data',
    'Priprema dokumenta za ručni pregled',
    'Simulacioni izveštaj i prilozi',
    'Nacrt bez slanja ili tvrdnje o odobrenju',
    'Mapiranje polja formulara i ručni pregled.',
    'Test potvrđuje odsustvo mrežnog slanja i platne operacije.'
  ),
  planned(
    'bank',
    'storage',
    'data',
    'Čuvanje finansijske simulacije',
    'Sintetički scenario, valuta i verzija',
    'Izolovan zapis simulacije',
    'Poseban sandbox prostor i brisanje test podataka.',
    'Simulacija ne sadrži kredencijale ili stvarne račune.'
  ),
  planned(
    'bank',
    'security',
    'control',
    'Provera granice finansijskog sandboxa',
    'Tražena radnja i sandbox identitet',
    'Odluka dozvoljeno/odbijeno',
    'Politika koja zabranjuje stvarne platne efekte.',
    'Stvarna uplata ili pristup tajnom ključu se odbija.'
  ),
  planned(
    'agents',
    'vrh',
    'control',
    'Ograničen numerički poziv agenta',
    'Numerički zahtev, budžet i agent ID',
    'Proveren rezultat za analizu',
    'Adapter agenta na postojeći VRH allowlist.',
    'Agent ne može da pozove shell, mrežu ili neograničenu petlju.'
  ),
  planned(
    'agents',
    'storage',
    'data',
    'Čuvanje dokaza izvršenog zadatka agenta',
    'ID zadatka, izvori i rezultat',
    'Verzionisan zapis porekla',
    'Šema dokaza i izolacija podataka po zadatku.',
    'Neproveren zaključak ostaje označen i nema tuđih podataka.'
  ),
  planned(
    'agents',
    'monitoring',
    'monitoring',
    'Praćenje budžeta agenta',
    'ID zadatka, potrošnja i završni razlog',
    'Sažetak potrošnje i prekoračenja',
    'Merenje budžeta i adapter događaja.',
    'Prekoračenje je vidljivo, izostanak metrike nije nula.'
  ),
  planned(
    'backend',
    'agents',
    'control',
    'Dodela odobrenog posla agentu',
    'Verzionisan posao, capability i rok',
    'Potvrda prihvatanja ili odbijanje',
    'Red poslova i identifikacija capability-ja.',
    'Posao bez odgovarajuće sposobnosti ostaje nedodeljen.'
  ),
  planned(
    'backend',
    'monitoring',
    'monitoring',
    'Praćenje API grešaka',
    'Ruta, status, trajanje i correlation ID',
    'Agregiran pregled grešaka',
    'Redakcija osetljivih podataka i adapter metrika.',
    'Log ne sadrži telo zahteva, tokene ili lozinke.'
  ),
  planned(
    'automation',
    'vrh',
    'control',
    'Pokretanje numeričkih regresionih primera',
    'Verzija koda i poznati ulazi/očekivani izlazi',
    'Izveštaj upoređenih rezultata',
    'Izolovan runner sa ograničenjem vremena.',
    'Neizvršen ili istekao test ne može dobiti pass.'
  ),
  planned(
    'automation',
    'pipeline',
    'data',
    'Predaja rezultata validacije izdanju',
    'Revizija, naziv testa i rezultat',
    'Dokaz provere za tačnu reviziju',
    'Format dokaza i veza sa commit SHA.',
    'Rezultat druge revizije ne otključava izdanje.'
  ),
  planned(
    'pipeline',
    'automation',
    'control',
    'Zahtev za proveru kandidata izdanja',
    'Commit SHA i obavezne provere',
    'Izolovan posao validacije',
    'Adapter CI zahteva i potpun spisak obaveznih provera.',
    'Preskočena obavezna provera blokira kandidata.'
  ),
  planned(
    'pipeline',
    'security',
    'control',
    'Zahtev za bezbednosni pregled artefakta',
    'Hash artefakta i izveštaj zavisnosti',
    'Nalazi vezani za isti artefakt',
    'Adapter skenera i pravila prihvatanja.',
    'Nalaz ili nedostajući sken ostaje blokada.'
  ),
  planned(
    'pipeline',
    'monitoring',
    'monitoring',
    'Prikaz stanja procesa izdanja',
    'Commit SHA, faza i potvrđeni ishod',
    'Status poslednjeg potvrđenog izdanja',
    'Read-only CI adapter bez deploy hook-a.',
    'Startup failure se prikazuje kao neizvršena validacija.'
  ),
  planned(
    'cloud',
    'monitoring',
    'monitoring',
    'Praćenje zdravlja izvršnog čvora',
    'Identitet čvora, vreme i health odgovor',
    'Svež ili nepoznat status čvora',
    'Autentifikovan read-only health adapter.',
    'Istek roka označava status zastarelim.'
  ),
  planned(
    'gpu',
    'monitoring',
    'monitoring',
    'Praćenje zauzetosti GPU radnika',
    'ID radnika, memorija, red i vreme',
    'Pregled kapaciteta sa starošću podatka',
    'GPU exporter i ograničenje pristupa.',
    'Isključen exporter ne prijavljuje slobodan kapacitet.'
  ),
  planned(
    'gpu',
    'storage',
    'data',
    'Čuvanje rezultata render posla',
    'ID posla, artefakt i hash',
    'Trajna referenca rezultata',
    'Izolovan upis artefakata i kvota prostora.',
    'Nepotpun artefakt nije označen kao gotov.'
  ),
  planned(
    'storage',
    'recovery',
    'data',
    'Predaja kopije na proveru oporavka',
    'Manifest kopije, verzija i checksum',
    'Izveštaj integriteta kopije',
    'Bezbedno pravljenje kopije i izdvojena restore okolina.',
    'Oštećena kopija ne može postati kandidat za restore.'
  ),
  planned(
    'recovery',
    'monitoring',
    'monitoring',
    'Izveštaj probe oporavka',
    'ID kopije, rezultat i vreme probe',
    'Dokaz uspešnog ili neuspešnog restore-a',
    'Adapter rezultata restore probe.',
    'Bez probe nema potvrde da je backup upotrebljiv.'
  ),
  planned(
    'scp',
    'automation',
    'control',
    'Ručni zahtev za izolovanu proveru',
    'Izabrani skup provera i revizija',
    'Posao validacije na čekanju',
    'SCP kontrola za test runner bez deploy mogućnosti.',
    'Izbor provere ne pokreće servis ili produkciono izdanje.'
  ),
];
