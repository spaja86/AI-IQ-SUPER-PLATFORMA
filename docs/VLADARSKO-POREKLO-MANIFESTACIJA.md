# REKLAMNI MATERIJAL — Manifestacija „Vladarskog porekla“

**Naziv manifestacije:** Vladarskog porekla  
**Verzija dokumenta:** 1.0  
**Status:** Ready for production  
**Datum:** 2026-09-05  
**Kreativni referentni vizual:**  
`https://github.com/user-attachments/assets/033566f0-581b-452d-bf4d-abf86bb59caa`

**Planirani kanonski landing URL (registracija):** `https://spaja.nivo-spaja/vladarskog-porekla`  
**Planirani rezervni URL (fallback):** `https://spaja.nivo-spaja/prijava/vladarskog-porekla`  
**Owner landing stranice:** `@spaja86` + IO-OPENUI-AO Web Experience tim

### Downstream implementacija i audit reference
- **Linked repo (execution):** `spaja86/IO-OPENUI-AO`
- **Predviđena landing putanja:** `src/app/vladarskog-porekla/page.tsx`
- **Predviđena registraciona API putanja:** `src/app/api/vladarskog-porekla/register/route.ts`
- **Cross-repo evidencija:** `docs/MULTI-REPO-LINKS.md`
- **Handoff/Audit ID:** `VPOREKLO-2026-09`

#### Minimalni downstream kontrakt (za IO-OPENUI-AO implementaciju)

**Landing kontrakt (`/vladarskog-porekla`)**
- Hero naslov: „Vladarskog porekla“
- CTA dugme: „Prijava“
- Sekcija „Program manifestacije“ (agenda po terminima)
- Sekcija „Govornici i učesnici“ (ime, titula/uloga, kratki opis)
- Sekcija „Kontakt i informacije“ (email, telefon, lokacija)

**API kontrakt (`POST /api/vladarskog-porekla/register`)**
- Request polja: `fullName`, `email`, `phone`, `city`, `tickets`, `consent`
- Validacija: sva polja obavezna osim `city`; `email` validan format; `tickets >= 1`; `consent = true`
- Success response: `{ "ok": true, "registrationId": "...", "message": "Prijava uspešno zabeležena." }`
- Error response: `{ "ok": false, "error": "VALIDATION_ERROR|DUPLICATE|SERVER_ERROR", "message": "..." }`

---

## 1) Identitet manifestacije

### Svrha
Manifestacija „Vladarskog porekla“ predstavlja kulturno-svečani događaj koji spaja istorijsko nasleđe, savremeni vizuelni izraz i simboliku liderstva.

### Ciljna publika
- Posetioci zainteresovani za istoriju, tradiciju i kulturne događaje
- Mladi (18–35) koji prate vizuelno snažne, modernizovane kulturne formate
- Mediji, kulturne institucije, partneri i sponzori

### Ton komunikacije
- Dostojanstven i inspirativan
- Samouveren i reprezentativan
- Emotivan, ali jasan i direktan

### Ključna poruka
„Nasleđe koje nosimo danas oblikuje veličinu koju ostavljamo sutra.“

---

## 2) Kreativni pravac (usklađen sa dostavljenim vizualom)

### Vizuelni stil
- Kraljevska ikonografija: kruna, tron, žezlo, heraldički detalji
- Neon/futuristički ambijent: svetlosni oreol, digitalna pozadina, luminous efekti
- Kontrast tradicije i budućnosti kao osnovna estetska osovina

### Paleta boja
- Dominantna plava: autoritet, dubina, stabilnost
- Dominantna zlatna: prestiž, vladarski identitet, svečanost
- Akcenti bele/svetlo-cijan za tipografiju i fokalne tačke

### Centralna persona
Centralna figura je zaštitno lice kampanje i glavni narativni nosač poruke „vladarskog porekla“. Svi materijali moraju zadržati istu hijerarhiju: lice → simboli → slogan → događajni podaci.

---

## 3) Osnovni set reklamnih materijala

### 3.1 Glavni plakat (digital + štampa)

**Format (digital):** 1080x1350, 1080x1920  
**Format (štampa):** A3, B2  
**Naslov:** VLADARSKOG POREKLA  
**Podnaslov:** Manifestacija kulturnog nasleđa i savremene simbolike  
**CTA:** Rezervišite svoje mesto  
**Obavezni podaci:** Datum, lokacija, vreme, organizator, web/adresa prijave (planirano: `https://spaja.nivo-spaja/vladarskog-porekla`)

**Predlog copy-ja (plakat):**
„Vladarskog porekla — večer nasleđa, časti i budućnosti.  
Pridružite nam se na manifestaciji koja spaja istorijsku snagu i savremeni izraz.“

### 3.2 Društvene mreže (feed, story, cover)

**Feed post (1:1 / 4:5):**
„Nasleđe nije prošlost — nasleđe je odgovornost.  
Manifestacija ‘Vladarskog porekla’ okuplja one koji poštuju korene i grade budućnost.  
📍 [Lokacija] | 📅 [Datum] | 🕒 [Vreme]  
#VladarskogPorekla #KulturnaManifestacija #Nasledje #Spaja“

**Story (9:16):**
„VLADARSKOG POREKLA  
Istorijsko-kulturni spektakl  
[Datum] • [Vreme] • [Lokacija]  
Swipe / Link u bio za prijavu“

**Cover (event banner):**
„Vladarskog porekla  
Svečana manifestacija tradicije i vizije“

### 3.3 Promo baneri za web/portale

**Formati:** 728x90, 300x250, 160x600, 1080x1080  
**Kratki tekstovi:**
- „Vladarskog porekla — rezervišite mesto“
- „Manifestacija nasleđa i savremenog prestiža“
- „Datum: [xx.xx.2026] • Lokacija: [grad/sala]“

### 3.4 Kratki video teaser

**Trajanje:** 20–30 sekundi  
**Struktura:**
1. Otvaranje: kruna, svetlosni efekti, naziv manifestacije  
2. Sredina: kadrovi centralne persone + simboli moći i nasleđa  
3. Završnica: datum, lokacija, poziv na prijavu

**Voiceover predlog:**
„Kada se nasleđe i vizija susretnu, nastaje događaj koji se pamti.  
Manifestacija ‘Vladarskog porekla’.  
Budite deo trenutka.“

### 3.5 PR najava i medijski tekst

**PR naslov:**
„Najavljena manifestacija ‘Vladarskog porekla’: spoj istorijskog prestiža i savremenog izraza“

**PR lead:**
„Manifestacija ‘Vladarskog porekla’ donosi jedinstven kulturni format koji kroz snažnu simboliku i moderan vizuelni jezik promoviše autentičnost, zajedništvo i poštovanje nasleđa.“

**Kratki medijski tekst:**
„U [grad] uskoro stiže manifestacija ‘Vladarskog porekla’, događaj posvećen istorijsko-kulturnim vrednostima predstavljen kroz savremeni umetničko-scenski koncept. Posetioci će imati priliku da dožive spoj tradicije i moderne estetike, uz pažljivo osmišljen program i simboliku vladarskog identiteta.“

---

## 4) Poruke po kanalima

### Društvene mreže (emocija + prepoznatljivost)
„Snaga porekla. Vizija budućnosti.  
Vidimo se na manifestaciji ‘Vladarskog porekla’.“

### Mediji / PR (kulturna i događajna vrednost)
„Događaj afirmiše istorijsko nasleđe kroz savremene forme i otvara prostor za novo tumačenje kulturnog identiteta.“

### Outdoor (kratki slogan + datum/lokacija)
„VLADARSKOG POREKLA — [Datum] — [Lokacija]“

### Web landing (program, prijava, kontakt)
Landing mora sadržati:
- Hero sekciju sa ključnim vizualom i CTA dugmetom „Prijava“
- Kompletan program po segmentima
- Sekcija „Govornici i učesnici“ sa listom imena, titula i kratkih biografija
- Kontakt formu i info sekciju

**Putanja/slug:** `/vladarskog-porekla`  
**Primarni domen:** `spaja.nivo-spaja`  
**Odgovornost za objavu:** IO-OPENUI-AO Web Experience tim (tehnička objava) + @spaja86/organizator (sadržajno odobrenje)  
**Objava se prati kroz:** `VPOREKLO-2026-09` u `docs/MULTI-REPO-LINKS.md` i kroz downstream PR u `spaja86/IO-OPENUI-AO`

---

## 5) Sadržajni okvir kampanje

1. **Teaser najava (T-21 do T-14):** prvi vizuali + poruka manifestacije  
2. **Program reveal (T-14 do T-7):** objava glavnih tačaka programa  
3. **Predstavljanje govornika/učesnika (T-10 do T-3):** serija fokusiranih objava  
4. **Finalni poziv (T-3 do T-0):** poslednji poziv za prijavu i dolazak  
5. **Dan događaja (T):** live pokrivanje, stories, kratki video isečci

---

## 6) Produkcija i odobrenja

### Brending smernice
- Jedinstvena upotreba boja (plavo-zlatna osnova)
- Dosledna tipografija na svim formatima
- Obavezna upotreba centralne persone i ključnih simbola

### Kontrolna lista odobrenja
- [ ] Proverena tačnost svih imena, titula i institucionalnih naziva
- [ ] Potvrđeni datum, vreme i lokacija na svim kanalima
- [ ] Pravna i etička usklađenost copy-ja i vizuala
- [ ] Završno odobrenje organizatora za finalne verzije

---

## 7) Aktivacija na dan događaja

- Brendirana bina/pozadina sa centralnim sloganom
- Foto i video punkt za medije i posetioce
- Štampani materijali: program, akreditacije, roll-up
- Live objave: ulazak gostiju, ključni momenti, završna poruka
- Medijsko pokrivanje: koordinacija izjava i press zone

---

## 8) Post-event paket

### Obavezni outputi
- Aftermovie (30–90 sekundi + duža verzija)
- Foto galerija za medije i društvene mreže
- Saopštenje o uspehu manifestacije
- Repost najjačih trenutaka (48h i 7 dana nakon događaja)
- Interni izveštaj: domet, engagement, broj posetilaca, preporuke

### Predlog završne poruke
„Hvala svima koji su bili deo manifestacije ‘Vladarskog porekla’.  
Zajedno smo potvrdili da nasleđe živi kroz ljude koji ga stvaraju.“
