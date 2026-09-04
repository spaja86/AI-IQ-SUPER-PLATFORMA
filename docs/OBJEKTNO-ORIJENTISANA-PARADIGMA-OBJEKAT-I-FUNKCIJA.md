# OBJEKTNO ORIJENTISANA PARADIGMA U FUNKCIJI "OBJEKTA I FUNKCIJE"

## 1) Cilj teme

Cilj je da se objedini razumevanje **objekta** kao nosioca stanja i ponašanja, i **funkcije/metode** kao mehanizma koji menja ili koristi to stanje.  
U objektno orijentisanom modelu, objekat nije samo skladište podataka, već aktivni učesnik koji kroz metode izvršava poslovna pravila.

## 2) Osnovni pojmovi

- **Klasa**: šablon koji definiše strukturu i ponašanje budućih objekata.
- **Objekat**: konkretna instanca klase sa sopstvenim stanjem.
- **Atribut**: podatak koji pripada objektu (stanje objekta).
- **Metoda**: funkcija definisana unutar klase, vezana za objekat.
- **Instanca**: pojedinačan objekat kreiran iz klase.
- **Poruka / metodski poziv**: zahtev jednom objektu da izvrši određenu metodu.

## 3) Odnos "objekat–funkcija"

U OOP-u su funkcije najčešće modelovane kao metode jer:

- logika pripada domenskom entitetu koji poseduje podatke;
- smanjuje se rasipanje poslovnih pravila po sistemu;
- čuva se integritet stanja kroz kontrolisane ulaze i izlaze.

Umesto da se podaci i funkcije razdvoje na više mesta, OOP ih približava u jedinstvenu celinu: objekat zna **šta jeste** i **šta može da uradi**.

## 4) Ključni principi OOP-a kroz odnos objekta i funkcije

- **Enkapsulacija**: stanje objekta se štiti, a pristup ide kroz metode.
- **Apstrakcija**: izlaže se ono što je bitno za korisnika objekta, detalji implementacije se skrivaju.
- **Nasleđivanje**: izvedene klase preuzimaju i proširuju postojeće ponašanje.
- **Polimorfizam**: ista poruka (poziv metode) daje različito ponašanje u zavisnosti od konkretnog tipa objekta.

## 5) Obrasci saradnje objekata

Tipični način rada u OOP sistemu:

1. Jedan objekat prima zahtev.
2. Deo posla delegira drugom objektu specijalizovanom za tu odgovornost.
3. Rezultat se vraća kroz jasno definisan interfejs.

Najčešći obrasci:

- **Delegacija**: objekat prosleđuje izvršenje drugom objektu.
- **Kompozicija**: složen objekat se gradi od više manjih objekata.
- **Podela odgovornosti**: svaki objekat rešava usko definisan deo domene.

## 6) Poređenje sa proceduralnim pristupom

U proceduralnom pristupu:

- funkcije su primarne;
- podaci se često prosleđuju kroz veliki broj funkcija;
- pravila mogu biti rasuta kroz module.

U OOP pristupu:

- objekti su primarni nosioci odgovornosti;
- funkcije postaju metode vezane za stanje objekta;
- logika se organizuje oko domenskih pojmova, što olakšava održavanje i evoluciju sistema.

## 7) Praktične smernice: metoda ili utility funkcija

Funkciju modelovati kao **metodu objekta** kada:

- direktno koristi ili menja stanje objekta;
- predstavlja domensko pravilo tog entiteta;
- treba da zaštiti integritet podataka.

Funkciju modelovati kao **utility** kada:

- ne zavisi od internog stanja konkretnog objekta;
- predstavlja opštu tehničku operaciju (npr. formatiranje, konverzija, pomoćna validacija);
- koristi se široko i nije vezana za jednu domensku klasu.

## 8) Validacija razumevanja — mini-zadaci

1. U opisu sistema za narudžbine identifikovati 3 ključna objekta i njihove atribute.
2. Za svaki objekat navesti najmanje 2 metode koje predstavljaju poslovnu logiku.
3. Odrediti gde treba koristiti delegaciju između objekata.
4. Za isti primer prikazati koje bi funkcije ostale utility i zašto.
5. Uporediti proceduralnu i OOP verziju organizacije logike po kriterijumima: čitljivost, proširivost i kontrola stanja.

---

Ovaj dokument predstavlja operativni vodič za modelovanje sistema u kome objekti nose odgovornost, a funkcije/metode realizuju ponašanje nad jasno definisanim stanjem.
