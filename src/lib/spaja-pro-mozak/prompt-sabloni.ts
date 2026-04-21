// SpajaUltraOmegaCore -∞Ω+∞ — Prompt Template Engine
// Kompanija SPAJA — Digitalna Industrija
// Predefinisani šabloni za česte scenarije sa automatskim popunjavanjem parametara

// ─── Tipovi ──────────────────────────────────────────────────────────

export type SablonId =
  | 'bug-report'
  | 'code-review'
  | 'email-klijentu'
  | 'api-dokumentacija'
  | 'unit-test'
  | 'git-commit'
  | 'pull-request'
  | 'regex-generator'
  | 'sql-upit'
  | 'poslovni-plan'
  | 'swot-analiza'
  | 'meeting-agenda'
  | 'refactoring'
  | 'security-audit';

export type SablonKategorija = 'razvoj' | 'qa' | 'komunikacija' | 'analiza' | 'dokumentacija';

export interface SablonParametar {
  ime: string;
  opis: string;
  obavezan: boolean;
  primer: string;
}

export interface PromptSablon {
  id: SablonId;
  naziv: string;
  opis: string;
  kategorija: SablonKategorija;
  ikona: string;
  parametri: SablonParametar[];
  promptSablon: string; // Sablon sa {parametar} placeholderima
  tagsPrepoznavanja: RegExp[];
}

export interface SablonDetekcijaRezultat {
  pronadjen: boolean;
  sablon: PromptSablon | null;
  popunjenPrompt: string;
  nedostajuciParametri: SablonParametar[];
}

// ─── Definicije šablona ───────────────────────────────────────────────

export const PROMPT_SABLONI: PromptSablon[] = [
  {
    id: 'bug-report',
    naziv: 'Bug Report',
    opis: 'Profesionalni bug report za ticket sistem',
    kategorija: 'qa',
    ikona: '🐛',
    parametri: [
      { ime: 'opis', opis: 'Kratki opis buga', obavezan: true, primer: 'Login forma ne prihvata specijalne karaktere' },
      { ime: 'koraci', opis: 'Koraci za reprodukovanje', obavezan: true, primer: '1. Idi na login stranicu\n2. Unesi email sa + karakterom\n3. Klikni "Prijavi se"' },
      { ime: 'ocekivano', opis: 'Očekivano ponašanje', obavezan: true, primer: 'Korisnik se uspešno prijavljuje' },
      { ime: 'stvarno', opis: 'Stvarno ponašanje', obavezan: true, primer: 'Prikazuje grešku: "Invalid email format"' },
      { ime: 'okruzenje', opis: 'Okruženje (browser, OS, verzija)', obavezan: false, primer: 'Chrome 120, Windows 11, produkcija' },
    ],
    promptSablon: `Napiši profesionalni bug report za sledeći problem:

**Opis problema:** {opis}

**Koraci za reprodukciju:**
{koraci}

**Očekivano ponašanje:** {ocekivano}

**Stvarno ponašanje:** {stvarno}

**Okruženje:** {okruzenje}

Format: GitHub/Jira-ready Markdown sa prioritetom, labelama i predlogom za fix.`,
    tagsPrepoznavanja: [
      /\b(bug\s+report|napiši\s+bug|prijavi\s+grešku|create\s+ticket)\b/i,
    ],
  },
  {
    id: 'code-review',
    naziv: 'Code Review',
    opis: 'Sveobuhvatni code review sa specifičnim fokusom',
    kategorija: 'razvoj',
    ikona: '🔍',
    parametri: [
      { ime: 'kod', opis: 'Kod za review', obavezan: true, primer: 'function fetchUser(id) { ... }' },
      { ime: 'jezik', opis: 'Programski jezik', obavezan: false, primer: 'TypeScript' },
      { ime: 'fokus', opis: 'Oblast fokusa (sigurnost, performance, čitljivost)', obavezan: false, primer: 'Sigurnost i performance' },
    ],
    promptSablon: `Uradi detaljni code review sledećeg {jezik} koda sa fokusom na {fokus}:

\`\`\`{jezik}
{kod}
\`\`\`

Analiziraj:
1. **Bugovi** — logičke greške i edge cases
2. **Sigurnost** — potencijalne ranjivosti (injection, auth, data exposure)
3. **Performance** — bottlenecks, N+1, nepotrebni rerender
4. **Čitljivost** — imenovanje, kompleksnost, dokumentacija
5. **Best practices** — SOLID, DRY, specifično za {jezik} ekosistem

Za svaki problem: navedi liniju, ozbiljnost (🔴/🟡/🟢) i konkretan predlog.`,
    tagsPrepoznavanja: [
      /\b(code\s+review|pregledaj\s+(?:moj\s+)?kod|review\s+this|uradi\s+review)\b/i,
    ],
  },
  {
    id: 'email-klijentu',
    naziv: 'Email klijentu',
    opis: 'Profesionalni email za različite scenarije komunikacije sa klijentom',
    kategorija: 'komunikacija',
    ikona: '📧',
    parametri: [
      { ime: 'scenario', opis: 'Scenario (kašnjenje, update, zahtev, odbijanje)', obavezan: true, primer: 'Obaveštenje o kašnjenju projekta za 2 nedelje' },
      { ime: 'ton', opis: 'Ton (formalan, prijateljski, izvinjavajući)', obavezan: false, primer: 'Formalan i profesionalan' },
      { ime: 'detalji', opis: 'Ključni detalji koji treba da se pomenu', obavezan: false, primer: 'Razlog: bolovanje ključnog developera; Novo vreme: 15. jun' },
    ],
    promptSablon: `Napiši profesionalni email klijentu za sledeći scenario:

**Scenario:** {scenario}
**Ton:** {ton}
**Ključni detalji:** {detalji}

Format: Predmet + telo emaila sa srpskim i eventualnom verzijom na engleskom ako je potrebno.`,
    tagsPrepoznavanja: [
      /\b(email\s+klijentu|napiši\s+email|write\s+email|poruka\s+klijentu)\b/i,
    ],
  },
  {
    id: 'api-dokumentacija',
    naziv: 'API Dokumentacija',
    opis: 'OpenAPI/Swagger-stil dokumentacija za API endpoint',
    kategorija: 'dokumentacija',
    ikona: '📋',
    parametri: [
      { ime: 'endpoint', opis: 'Endpoint (metod + putanja)', obavezan: true, primer: 'POST /api/users' },
      { ime: 'opis', opis: 'Šta endpoint radi', obavezan: true, primer: 'Kreira novog korisnika u sistemu' },
      { ime: 'parametri', opis: 'Request body ili query parametri', obavezan: false, primer: 'email (string, required), name (string, optional)' },
      { ime: 'odgovor', opis: 'Response format', obavezan: false, primer: 'User objekat sa id, email, created_at' },
    ],
    promptSablon: `Napiši kompletnu API dokumentaciju za:

**Endpoint:** {endpoint}
**Opis:** {opis}
**Parametri:** {parametri}
**Response:** {odgovor}

Format: OpenAPI-kompatibilni Markdown sa sekcijama: Opis, Request, Response (200/400/401/404/500), Primeri curl komandi, Napomene o auth.`,
    tagsPrepoznavanja: [
      /\b(api\s+dokumentacija|document\s+(?:this\s+)?api|write\s+docs|napiši\s+dokumentaciju\s+za\s+api)\b/i,
    ],
  },
  {
    id: 'unit-test',
    naziv: 'Unit Test Generator',
    opis: 'Generiše unit testove za funkciju ili komponentu',
    kategorija: 'qa',
    ikona: '🧪',
    parametri: [
      { ime: 'kod', opis: 'Kod koji treba testirati', obavezan: true, primer: 'function validateEmail(email) { ... }' },
      { ime: 'framework', opis: 'Test framework', obavezan: false, primer: 'Jest, Vitest, Pytest' },
    ],
    promptSablon: `Napiši sveobuhvatne unit testove za sledeći kod koristeći {framework}:

\`\`\`
{kod}
\`\`\`

Pokrij:
- Happy path (normalno ponašanje)
- Edge cases (prazan input, null, undefined, max/min vrednosti)
- Greške (validacija, izuzeci)
- Boundary testing

Koristi describe/it/test strukturu. Dodaj komentare koji objašnjavaju šta svaki test proverava.`,
    tagsPrepoznavanja: [
      /\b(unit\s+test|napiši\s+testove|write\s+tests|generiši\s+testove|test\s+coverage)\b/i,
    ],
  },
  {
    id: 'git-commit',
    naziv: 'Git Commit Poruka',
    opis: 'Conventional Commits format poruka za git commit',
    kategorija: 'razvoj',
    ikona: '💾',
    parametri: [
      { ime: 'promene', opis: 'Šta je promenjeno (diff ili opis)', obavezan: true, primer: 'Dodata JWT autentifikacija za API rute, nova tabela sessions u bazi' },
      { ime: 'tip', opis: 'Tip promene (feat/fix/refactor/docs/chore)', obavezan: false, primer: 'feat' },
    ],
    promptSablon: `Napiši git commit poruku po Conventional Commits standardu za sledeće promene:

**Promene:** {promene}
**Tip:** {tip}

Format:
\`{tip}(scope): kratki opis (max 72 karaktera)\`

\`Detaljan opis promena u bullet listama.\`

\`BREAKING CHANGE: (ako postoji)\`
\`Closes #123 (ako rešava issue)\``,
    tagsPrepoznavanja: [
      /\b(git\s+commit|commit\s+poruka|write\s+commit|napiši\s+commit)\b/i,
    ],
  },
  {
    id: 'sql-upit',
    naziv: 'SQL Upit Generator',
    opis: 'Optimizovani SQL upit sa objašnjenjem i indeksima',
    kategorija: 'razvoj',
    ikona: '🗄️',
    parametri: [
      { ime: 'opis', opis: 'Šta upit treba da uradi', obavezan: true, primer: 'Pronađi sve korisnike koji su se prijavili u poslednjih 7 dana i imaju bar jednu narudžbinu' },
      { ime: 'shema', opis: 'Relevantne tabele i kolone', obavezan: false, primer: 'users(id, email, created_at), orders(id, user_id, amount, created_at)' },
      { ime: 'baza', opis: 'Tip baze podataka', obavezan: false, primer: 'PostgreSQL 16' },
    ],
    promptSablon: `Napiši optimizovani {baza} SQL upit koji:

**Zahtev:** {opis}
**Shema:** {shema}

Uključi:
1. Glavni upit (čitljiv, sa aliasima)
2. Objašnjenje logike
3. Predlog indeksa za optimizaciju
4. EXPLAIN ANALYZE analiza (teoretska)
5. Alternativni pristup ako postoji`,
    tagsPrepoznavanja: [
      /\b(sql\s+upit|napiši\s+sql|write\s+sql|database\s+query|upit\s+za\s+bazu)\b/i,
    ],
  },
  {
    id: 'swot-analiza',
    naziv: 'SWOT Analiza',
    opis: 'Kompletna SWOT analiza za biznis, projekat ili ideju',
    kategorija: 'analiza',
    ikona: '📊',
    parametri: [
      { ime: 'subjekat', opis: 'Šta se analizira', obavezan: true, primer: 'Startup za AI-powered prevod dokumenata u Srbiji' },
      { ime: 'kontekst', opis: 'Dodatni kontekst (tržište, budzet, tim)', obavezan: false, primer: 'Tim od 3 developera, budzet 50k EUR, B2B fokus' },
    ],
    promptSablon: `Uradi kompletnu SWOT analizu za:

**Subjekat:** {subjekat}
**Kontekst:** {kontekst}

Format:
## 💪 Snage (Strengths)
[3-5 konkretnih snaga]

## 📉 Slabosti (Weaknesses)  
[3-5 konkretnih slabosti]

## 🚀 Prilike (Opportunities)
[3-5 konkretnih prilika na tržištu]

## ⚠️ Pretnje (Threats)
[3-5 konkretnih pretnji]

## Strateški zaključak
[Preporučena strategija bazirana na SWOT-u]`,
    tagsPrepoznavanja: [
      /\b(swot|swot\s+analiza|strengths\s+weaknesses|snage\s+i\s+slabosti)\b/i,
    ],
  },
  {
    id: 'poslovni-plan',
    naziv: 'Poslovni Plan',
    opis: 'Strukturirani poslovni plan za startup ili projekat',
    kategorija: 'analiza',
    ikona: '📈',
    parametri: [
      { ime: 'ideja', opis: 'Poslovna ideja u jednoj rečenici', obavezan: true, primer: 'SaaS platforma za automatizovano fakturisanje za srpske preduzetnike' },
      { ime: 'trziste', opis: 'Ciljno tržište', obavezan: false, primer: 'Mali i srednji preduzetnici u Srbiji (50-500k godišnji prihod)' },
    ],
    promptSablon: `Napiši strukturirani poslovni plan za:

**Ideja:** {ideja}
**Tržište:** {trziste}

Sekcije:
1. Izvršni sažetak
2. Problem i rešenje
3. Analiza tržišta i konkurencije
4. Poslovni model i prihodi
5. Go-to-market strategija
6. Tim i resursi
7. Finansijske projekcije (3 scenarija: pesimistički/realni/optimistički)
8. Ključni rizici i mitigacija`,
    tagsPrepoznavanja: [
      /\b(poslovni\s+plan|business\s+plan|napiši\s+plan\s+za\s+biznis|biznis\s+plan)\b/i,
    ],
  },
  {
    id: 'meeting-agenda',
    naziv: 'Meeting Agenda',
    opis: 'Strukturirana agenda za efikasan sastanak',
    kategorija: 'komunikacija',
    ikona: '📅',
    parametri: [
      { ime: 'tema', opis: 'Glavna tema sastanka', obavezan: true, primer: 'Q1 sprint retrospektiva i planiranje Q2' },
      { ime: 'ucesnici', opis: 'Ko učestvuje', obavezan: false, primer: 'Tim: 5 developera, 1 PM, 1 dizajner' },
      { ime: 'trajanje', opis: 'Trajanje sastanka', obavezan: false, primer: '90 minuta' },
    ],
    promptSablon: `Napiši efikasnu meeting agendu za:

**Tema:** {tema}
**Učesnici:** {ucesnici}
**Trajanje:** {trajanje}

Format:
- Naziv, datum i vreme (placeholder)
- Lista učesnika i uloge
- Vremenski raspoređene tačke dnevnog reda (time-boxed)
- Pre-reading i priprema za učesnike
- Action items template na kraju`,
    tagsPrepoznavanja: [
      /\b(meeting\s+agenda|agenda\s+za\s+sastanak|napiši\s+agendu|plan\s+sastanka)\b/i,
    ],
  },
  {
    id: 'refactoring',
    naziv: 'Refactoring Plan',
    opis: 'Plan za refaktorisanje legacy koda sa prioritetima',
    kategorija: 'razvoj',
    ikona: '♻️',
    parametri: [
      { ime: 'kod', opis: 'Kod ili opis koda za refaktorisanje', obavezan: true, primer: 'Express.js monolith 5000 LOC, bez testova, callback hell' },
      { ime: 'cilj', opis: 'Cilj refaktorisanja', obavezan: false, primer: 'Migracija na TypeScript i modularnu arhitekturu' },
    ],
    promptSablon: `Napravi plan refaktorisanja za:

**Kod/Sistem:** {kod}
**Cilj:** {cilj}

Plan treba da sadrži:
1. **Analiza trenutnog stanja** — problemi, tehničke dugove, rizici
2. **Prioritizovane faze** — od kritičnog ka manje kritičnom
3. **Faza 1 (Quick wins)** — bez rušenja funkcionalnosti
4. **Strategija testiranja** — kako osigurati da ništa ne puca
5. **Migracija korak po korak** — konkretne PR veličine
6. **Definition of Done** za svaku fazu`,
    tagsPrepoznavanja: [
      /\b(refactor|refaktorisanje|refaktorisi|refactor\s+this|cleanup\s+code|očisti\s+kod)\b/i,
    ],
  },
  {
    id: 'security-audit',
    naziv: 'Security Audit',
    opis: 'Bezbednosni audit koda sa OWASP Top 10 proverom',
    kategorija: 'qa',
    ikona: '🔐',
    parametri: [
      { ime: 'kod', opis: 'Kod za audit', obavezan: true, primer: 'Node.js Express API sa JWT auth' },
      { ime: 'kontekst', opis: 'Kontekst primene', obavezan: false, primer: 'Produkciona API sa 10k dnevnih korisnika, fintech domen' },
    ],
    promptSablon: `Uradi sveobuhvatni security audit za:

**Kod/Sistem:** {kod}
**Kontekst:** {kontekst}

Proveri OWASP Top 10:
1. A01 - Broken Access Control
2. A02 - Cryptographic Failures
3. A03 - Injection (SQL, NoSQL, Command)
4. A04 - Insecure Design
5. A05 - Security Misconfiguration
6. A06 - Vulnerable Components
7. A07 - Auth failures
8. A08 - Software Integrity Failures
9. A09 - Logging failures
10. A10 - SSRF

Za svaku ranjivost: Severity (Critical/High/Medium/Low), PoC, ispravka.`,
    tagsPrepoznavanja: [
      /\b(security\s+audit|bezbednosni\s+pregled|security\s+review|proveri\s+sigurnost|penetration)\b/i,
    ],
  },
  {
    id: 'pull-request',
    naziv: 'Pull Request Opis',
    opis: 'Profesionalni PR opis za code review',
    kategorija: 'dokumentacija',
    ikona: '🔀',
    parametri: [
      { ime: 'promene', opis: 'Šta je promenjeno', obavezan: true, primer: 'Implementiran JWT refresh token mehanizam i dodato rate limiting' },
      { ime: 'razlog', opis: 'Zašto su promene napravljene', obavezan: false, primer: 'Rešen security issue #234, poboljšana UX za duže sesije' },
      { ime: 'testiranje', opis: 'Kako je testirano', obavezan: false, primer: 'Unit testovi za token generisanje, manual test u dev' },
    ],
    promptSablon: `Napiši profesionalni Pull Request opis za:

**Promene:** {promene}
**Razlog:** {razlog}
**Testiranje:** {testiranje}

Format:
## 📝 Opis promena
## 🎯 Motivacija i kontekst
## 🧪 Kako je testirano
## 📸 Screenshots (ako relevantno)
## ✅ Checklist
## ⚠️ Breaking changes (ako postoje)
## 🔗 Reference (issues, tickets)`,
    tagsPrepoznavanja: [
      /\b(pull\s+request|PR\s+description|napiši\s+PR|opis\s+za\s+PR)\b/i,
    ],
  },
];

// ─── Javne funkcije ───────────────────────────────────────────────────

/**
 * Vraća sve dostupne šablone.
 */
export function getSviSabloni(): PromptSablon[] {
  return PROMPT_SABLONI;
}

/**
 * Vraća šablon po ID-u.
 */
export function getSablonPoId(id: SablonId): PromptSablon | null {
  return PROMPT_SABLONI.find((s) => s.id === id) ?? null;
}

/**
 * Vraća šablone po kategoriji.
 */
export function getSabloniPoKategoriji(kategorija: SablonKategorija): PromptSablon[] {
  return PROMPT_SABLONI.filter((s) => s.kategorija === kategorija);
}

/**
 * Detektuje koji šablon odgovara korisničkoj poruci.
 */
export function detektujSablon(poruka: string): SablonDetekcijaRezultat {
  for (const sablon of PROMPT_SABLONI) {
    const match = sablon.tagsPrepoznavanja.some((tag) => tag.test(poruka));
    if (match) {
      const nedostajuciParametri = sablon.parametri.filter(
        (p) => p.obavezan && !poruka.toLowerCase().includes(p.ime.toLowerCase()),
      );

      return {
        pronadjen: true,
        sablon,
        popunjenPrompt: popuniSablon(sablon, { opis: poruka }),
        nedostajuciParametri,
      };
    }
  }

  return { pronadjen: false, sablon: null, popunjenPrompt: '', nedostajuciParametri: [] };
}

/**
 * Popunjava šablon sa datim parametrima.
 * Neuneti opcioni parametri se zamenjuju praznom stringom ili primerom.
 */
export function popuniSablon(
  sablon: PromptSablon,
  parametri: Record<string, string>,
): string {
  let prompt = sablon.promptSablon;

  for (const param of sablon.parametri) {
    const vrednost = parametri[param.ime] ?? (param.obavezan ? `[${param.opis}]` : param.primer);
    const regex = new RegExp(`\\{${param.ime}\\}`, 'g');
    prompt = prompt.replace(regex, vrednost);
  }

  return prompt;
}
