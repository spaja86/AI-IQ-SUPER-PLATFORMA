/** VRH adapter: delegates unchanged to existing loop runtime. No Java translation. */
import * as loops from './index';
import type { PetljaKind, PetljaInput, PetljaResult } from './types';

export const VRH_LOOP_REGISTRY = Object.freeze({
  "FOR PETLJA": Object.freeze({ run: loops.runForPetlja, source: 'src/lib/petlje/for-petlja.ts', goal: "Sekvencijalno iteriranje od start do end sa kontrolisanim korakom." }),
  "ITCH PETLJA": Object.freeze({ run: loops.runItchPetlja, source: 'src/lib/petlje/itch-petlja.ts', goal: "Iterativno približavanje ka target vrednosti uz kontrolisani korak." }),
  "UR PELJA": Object.freeze({ run: loops.runUrPelja, source: 'src/lib/petlje/ur-pelja.ts', goal: "Linearna obrada ulazne sekvence sa determinističkim sabiranjem." }),
  "NIK PETLJA": Object.freeze({ run: loops.runNikPetlja, source: 'src/lib/petlje/nik-petlja.ts', goal: "Obrnuto odbrojavanje od start vrednosti ka end vrednosti." }),
  "DOR PETLJA": Object.freeze({ run: loops.runDorPetlja, source: 'src/lib/petlje/dor-petlja.ts', goal: "Sabiranje apsolutnog odstupanja svake posećene vrednosti od target vrednosti." }),
  "EXE PETLJA": Object.freeze({ run: loops.runExePetlja, source: 'src/lib/petlje/exe-petlja.ts', goal: "Težinsko izvršavanje sekvence gde svaki element doprinosi po svom indeksu." }),
  "KUR PETLJA": Object.freeze({ run: loops.runKurPetlja, source: 'src/lib/petlje/kur-petlja.ts', goal: "Koračno približavanje targetu uz akumulaciju svake međuvrednosti na putu." }),
  "DAR PETLJA": Object.freeze({ run: loops.runDarPetlja, source: 'src/lib/petlje/dar-petlja.ts', goal: "Računanje aritmetičke sredine svih posećenih vrednosti u opsegu." }),
  "YU PETLJA": Object.freeze({ run: loops.runYuPetlja, source: 'src/lib/petlje/yu-petlja.ts', goal: "Brojanje elemenata sekvence koji dostižu ili prelaze target prag." }),
  "ZAR PETLJA": Object.freeze({ run: loops.runZarPetlja, source: 'src/lib/petlje/zar-petlja.ts', goal: "Sabiranje apsolutnih razlika između susednih elemenata sekvence." }),
  "DER PETLJA": Object.freeze({ run: loops.runDerPetlja, source: 'src/lib/petlje/der-petlja.ts', goal: "Praćenje najveće prefiksne sume sekvence kroz jedan auditabilan prolaz." }),
  "GAR PETLJA": Object.freeze({ run: loops.runGarPetlja, source: 'src/lib/petlje/gar-petlja.ts', goal: "Praćenje najveće posećene vrednosti u opsegu." }),
  "ZUR PETLJA": Object.freeze({ run: loops.runZurPetlja, source: 'src/lib/petlje/zur-petlja.ts', goal: "Pronalaženje elementa sekvence koji je najbliži target vrednosti." }),
  "IZI PETLJA": Object.freeze({ run: loops.runIziPetlja, source: 'src/lib/petlje/izi-petlja.ts', goal: "Pronalaženje prvog indeksa u sekvenci koji tačno odgovara target vrednosti." }),
  "UK PETLJA": Object.freeze({ run: loops.runUkPetlja, source: 'src/lib/petlje/uk-petlja.ts', goal: "Brojanje posećenih vrednosti u opsegu koje su manje ili jednake targetu." }),
  "ZUM PETLJA": Object.freeze({ run: loops.runZumPetlja, source: 'src/lib/petlje/zum-petlja.ts', goal: "Sabiranje kvadrata svih posećenih vrednosti u opsegu." }),
  "DJUPRE PETLJA": Object.freeze({ run: loops.runDjuprePetlja, source: 'src/lib/petlje/djupre-petlja.ts', goal: "Sabiranje kubova svih posećenih vrednosti u opsegu uz deterministički audit trag." }),
  "DOMPRE PETLJA": Object.freeze({ run: loops.runDomprePetlja, source: 'src/lib/petlje/dompre-petlja.ts', goal: "Akumulacija preostale distance do targeta pre svakog pomeraja." }),
  "KRUMPE PETLJA": Object.freeze({ run: loops.runKrumpePetlja, source: 'src/lib/petlje/krumpe-petlja.ts', goal: "Sabiranje svakog pozitivnog uspona između uzastopnih elemenata sekvence." }),
  "DOMBRE PETLJA": Object.freeze({ run: loops.runDombrePetlja, source: 'src/lib/petlje/dombre-petlja.ts', goal: "Sabiranje apsolutnog odstupanja posećenih vrednosti od centralne ose opsega." }),
  "OMBA PETLJA": Object.freeze({ run: loops.runOmbaPetlja, source: 'src/lib/petlje/omba-petlja.ts', goal: "Brojanje potrebnih pomaka do targeta uz bounded target izvršavanje." }),
  "DOKSI PETLJA": Object.freeze({ run: loops.runDoksiPetlja, source: 'src/lib/petlje/doksi-petlja.ts', goal: "Sabiranje signed pomaka između uzastopnih elemenata sekvence." }),
  "DOMBRA PETLJA": Object.freeze({ run: loops.runDombraPetlja, source: 'src/lib/petlje/dombra-petlja.ts', goal: "Težinsko sabiranje signed odstupanja od target centra po redosledu obilaska opsega." }),
  "DOKON PETLJA": Object.freeze({ run: loops.runDokonPetlja, source: 'src/lib/petlje/dokon-petlja.ts', goal: "Sabiranje svih međupozicija koje petlja posećuje dok zatvara put ka targetu." }),
  "DUMPIR PETLJA": Object.freeze({ run: loops.runDumpirPetlja, source: 'src/lib/petlje/dumpir-petlja.ts', goal: "Brojanje elemenata sekvence koji ostaju na ili ispod target praga." }),
  "DOMBAR PETLJA": Object.freeze({ run: loops.runDombarPetlja, source: 'src/lib/petlje/dombar-petlja.ts', goal: "Brojanje posećenih vrednosti u opsegu koje dosežu ili prelaze target prag." }),
  "ZUMBA PETLJA": Object.freeze({ run: loops.runZumbaPetlja, source: 'src/lib/petlje/zumba-petlja.ts', goal: "Težinsko sabiranje apsolutnog odstupanja sekvence od targeta." }),
  "DONKI PETLJA": Object.freeze({ run: loops.runDonkiPetlja, source: 'src/lib/petlje/donki-petlja.ts', goal: "Težinsko praćenje pređenog koraka ka targetu kroz svako sledeće prizemljenje." }),
  "DOMPOR PETLJA": Object.freeze({ run: loops.runDomporPetlja, source: 'src/lib/petlje/dompor-petlja.ts', goal: "Sabiranje razlike između maksimuma opsega i svake posećene vrednosti." }),
  "DOK PETLJA": Object.freeze({ run: loops.runDokPetlja, source: 'src/lib/petlje/dok-petlja.ts', goal: "Koračno približavanje targetu uz akumulaciju preostale distance posle svakog pomeraja." }),
  "DIK PETLJA": Object.freeze({ run: loops.runDikPetlja, source: 'src/lib/petlje/dik-petlja.ts', goal: "Praćenje sekvence kroz najbolju dosadašnju bliskost targetu i sabiranje svakog poboljšanja." }),
  "SAR PETLJA": Object.freeze({ run: loops.runSarPetlja, source: 'src/lib/petlje/sar-petlja.ts', goal: "Sabiranje potpisanog odstupanja svake posećene vrednosti u opsegu u odnosu na target centar." }),
  "OKRED PETLJA": Object.freeze({ run: loops.runOkredPetlja, source: 'src/lib/petlje/okred-petlja.ts', goal: "Obilazak opsega radi zaključavanja vrednosti koja je najbliža targetu bez promene izvornog smera." }),
  "DIREKT PETLJA": Object.freeze({ run: loops.runDirektPetlja, source: 'src/lib/petlje/direkt-petlja.ts', goal: "Direktno zatvaranje distance ka targetu bez skretanja, uz sabiranje ostvarenog pomaka po koraku." }),
  "INDIREKT PETLJA": Object.freeze({ run: loops.runIndirektPetlja, source: 'src/lib/petlje/indirekt-petlja.ts', goal: "Indirektno približavanje targetu kroz waypoint sekvencu uz sabiranje svakog poboljšanja distance od početne pozicije." }),
  "SPAJA PETLJA": Object.freeze({ run: loops.runSpajaPetlja, source: 'src/lib/petlje/spaja-petlja.ts', goal: "Pivotiranje između petlji kroz segmente uz kontrolisan export/import međurezultata." }),
  "DURMITOR PETLJA": Object.freeze({ run: loops.runDurmitorPetlja, source: 'src/lib/petlje/durmitor-petlja.ts', goal: "Planinsko širenje od vrha ka podnožju uz ugrađeni UMBREL sloj koji u sebi nosi sve petlje." }),
  "UMBREL PETLJA": Object.freeze({ run: loops.runUmbrelPetlja, source: 'src/lib/petlje/umbrel-petlja.ts', goal: "Orkestracija svih petlji kroz jedinstven, stabilan i auditabilan rezultat." }),
} satisfies Record<PetljaKind, { run: (input: PetljaInput) => PetljaResult; source: string; goal: string }>);

export function describeVrhLoops() {
  return Object.entries(VRH_LOOP_REGISTRY).map(([kind, entry]) => ({ kind, source: entry.source, goal: entry.goal, runtime: 'existing-typescript' as const, javaTranslationVerified: false as const }));
}

export function resolveVrhLoop(kind: string) {
  if (!Object.hasOwn(VRH_LOOP_REGISTRY, kind)) throw new Error('Unknown VRH loop');
  return VRH_LOOP_REGISTRY[kind as PetljaKind].run;
}
