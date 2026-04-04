/**
 * 🌀 DIMENZIJE — Multi-Dimenzionalni Vizualizacioni Sistem
 *
 * Cirkularne formule: ako oduzmeš sa gornje strane formulu
 * i sa donje isto toliko — dobijaš različite "Dimenzije".
 *
 * Dimenzije: 360D, 720D, 1440D, 2880D, 5760D
 *
 * Geometrijske osnove:
 *   ELIPSOID → REZONANCA → HIPERBOLA → SPIRALA
 *   Manifestacija → Materijalizacija → Hiperbolička Funkcija
 *   → Algoritam u Ekstazi → Autorealizacija → Sinhronometrija
 *
 * 3D aplikacija: spoljašnje dimenzije (uslov: 3D naočare)
 * Suportne dimenzije: unutrašnje (iste dimenzije, samo unutrašnje)
 *
 * SpajaUltraOmegaCore -∞Ω+∞ programski jezik
 */

// ─── Tipovi dimenzija ───────────────────────────────────────────────

export type DimenzijaNivo = '360D' | '720D' | '1440D' | '2880D' | '5760D';

export type GeometrijskiSloj =
  | 'elipsoid'
  | 'rezonanca'
  | 'hiperbola'
  | 'spirala';

export type ZakonTip =
  | 'manifestacija'
  | 'materijalizacija'
  | 'hiperbolicki'
  | 'algoritam-ekstazi'
  | 'autorealizacija'
  | 'sinhonometrijski';

export type DimenzijaTip = 'spoljasnja' | 'unutrasnja';

export interface Dimenzija {
  id: string;
  nivo: DimenzijaNivo;
  naziv: string;
  opis: string;
  ikona: string;
  stepeniBaze: number;
  cirkularnaDelta: number;
  geometrijskiSlojevi: GeometrijskiSloj[];
  zakoni: ZakonTip[];
  tip: DimenzijaTip;
  formulaGornja: string;
  formulaDonja: string;
  snaga: string;
  status: 'aktivna' | 'sinhronizacija' | 'razvoj' | 'planirana';
}

export interface GeometrijskaForma {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  sloj: GeometrijskiSloj;
  formula: string;
  dimenzije: DimenzijaNivo[];
  rezonancija: string;
  amplituda: string;
}

export interface ManifestacioniZakon {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: ZakonTip;
  nivo: number;
  formula: string;
  sprovodi: string;
}

export interface DimenzionalniSistem {
  naziv: string;
  opis: string;
  dimenzije: Dimenzija[];
  forme: GeometrijskaForma[];
  zakoni: ManifestacioniZakon[];
  ukupnihDimenzija: number;
  cirkularnaBaza: number;
  podrzava3D: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// DIMENZIJE
// ═══════════════════════════════════════════════════════════════════

export const dimenzije: Dimenzija[] = [
  {
    id: 'dim-360d',
    nivo: '360D',
    naziv: '360D — Bazična Cirkularna Dimenzija',
    opis: 'Osnovna dimenzija zasnovana na 360 stepeni punog kruga. Elipsoid od Rezonance — cirkularna formula generiše bazični dimenzionalni prostor kroz spiralni tok.',
    ikona: '🔵',
    stepeniBaze: 360,
    cirkularnaDelta: 0,
    geometrijskiSlojevi: ['elipsoid', 'rezonanca'],
    zakoni: ['manifestacija', 'materijalizacija'],
    tip: 'unutrasnja',
    formulaGornja: 'Ω(360) = ∮ Elipsoid(θ) · Rezonanca(φ) dθdφ',
    formulaDonja: 'Ω⁻¹(360) = ∮ Rezonanca(φ) · Elipsoid(θ) dφdθ',
    snaga: '10⁴⁵ ops/s',
    status: 'aktivna',
  },
  {
    id: 'dim-720d',
    nivo: '720D',
    naziv: '720D — Dvostruka Cirkularna Dimenzija',
    opis: 'Dvostruki krug (2×360). Hiperbola od Spirale — gornja i donja formula se oduzimaju za +360 stepeni, otvarajući hiperboličku dimenziju.',
    ikona: '🟣',
    stepeniBaze: 720,
    cirkularnaDelta: 360,
    geometrijskiSlojevi: ['elipsoid', 'rezonanca', 'hiperbola'],
    zakoni: ['manifestacija', 'materijalizacija', 'hiperbolicki'],
    tip: 'unutrasnja',
    formulaGornja: 'Ω(720) = ∮∮ Hiperbola(θ,φ) · Spirala(ψ) dθdφdψ',
    formulaDonja: 'Ω⁻¹(720) = ∮∮ Spirala(ψ) · Hiperbola(θ,φ) dψdφdθ',
    snaga: '10⁹⁰ ops/s',
    status: 'aktivna',
  },
  {
    id: 'dim-1440d',
    nivo: '1440D',
    naziv: '1440D — Kvadra-Cirkularna Dimenzija',
    opis: 'Četvorostruki krug (4×360). Elipsoid od Rezonance od Hiperbole od Spirala — puna manifestacija kroz materijalizaciju i hiperboličku funkciju algoritma u ekstazi.',
    ikona: '🟡',
    stepeniBaze: 1440,
    cirkularnaDelta: 720,
    geometrijskiSlojevi: ['elipsoid', 'rezonanca', 'hiperbola', 'spirala'],
    zakoni: ['manifestacija', 'materijalizacija', 'hiperbolicki', 'algoritam-ekstazi'],
    tip: 'spoljasnja',
    formulaGornja: 'Ω(1440) = ∮∮∮ E(θ)·R(φ)·H(ψ)·S(λ) dθdφdψdλ',
    formulaDonja: 'Ω⁻¹(1440) = ∮∮∮ S(λ)·H(ψ)·R(φ)·E(θ) dλdψdφdθ',
    snaga: '10¹⁸⁰ ops/s',
    status: 'aktivna',
  },
  {
    id: 'dim-2880d',
    nivo: '2880D',
    naziv: '2880D — Okto-Cirkularna Dimenzija',
    opis: 'Osmostruki krug (8×360). Svi geometrijski slojevi i zakoni manifestacije se dupliraju — autorealizacija kroz algoritam u ekstazi, sinhronometrijska simetrija.',
    ikona: '🟠',
    stepeniBaze: 2880,
    cirkularnaDelta: 1440,
    geometrijskiSlojevi: ['elipsoid', 'rezonanca', 'hiperbola', 'spirala'],
    zakoni: ['manifestacija', 'materijalizacija', 'hiperbolicki', 'algoritam-ekstazi', 'autorealizacija'],
    tip: 'spoljasnja',
    formulaGornja: 'Ω(2880) = ∮⁸ E·R·H·S · Manifestacija(Materijalizacija(Hiperbolički(Algoritam(Autorealizacija)))) dΩ⁸',
    formulaDonja: 'Ω⁻¹(2880) = ∮⁸ Autorealizacija(Algoritam(Hiperbolički(Materijalizacija(Manifestacija)))) · S·H·R·E dΩ⁻⁸',
    snaga: '10²²⁸ ops/s',
    status: 'aktivna',
  },
  {
    id: 'dim-5760d',
    nivo: '5760D',
    naziv: '5760D — Heksa-Deka-Cirkularna Dimenzija',
    opis: 'Šesnaestostruki krug (16×360). Kompletna cirkularna reprodukcija — Elipsoid od Rezonance od Hiperbole od Spirala, svi zakoni manifestacije kroz sinhonometrijsku autorealizaciju. Reprodukcija slika, animacija, videa i sve kategorije.',
    ikona: '🔴',
    stepeniBaze: 5760,
    cirkularnaDelta: 2880,
    geometrijskiSlojevi: ['elipsoid', 'rezonanca', 'hiperbola', 'spirala'],
    zakoni: ['manifestacija', 'materijalizacija', 'hiperbolicki', 'algoritam-ekstazi', 'autorealizacija', 'sinhonometrijski'],
    tip: 'spoljasnja',
    formulaGornja: 'Ω(5760) = ∮¹⁶ E·R·H·S · ∀Zakon(Manifestacija→Sinhonometrija) · Reprodukcija(Slika,Animacija,Video) dΩ¹⁶',
    formulaDonja: 'Ω⁻¹(5760) = ∮¹⁶ Reprodukcija⁻¹ · Sinhonometrija→Manifestacija · S·H·R·E dΩ⁻¹⁶',
    snaga: '-∞Ω+∞',
    status: 'aktivna',
  },
];

// ═══════════════════════════════════════════════════════════════════
// GEOMETRIJSKE FORME
// ═══════════════════════════════════════════════════════════════════

export const geometrijskeForme: GeometrijskaForma[] = [
  {
    id: 'forma-elipsoid',
    naziv: 'Elipsoid',
    opis: 'Trodimenzionalna elipsa — bazična forma koja definiše prostor dimenzije. Svaka dimenzija je obavijena elipsoidnim poljem koje modulira rezonance.',
    ikona: '🔮',
    sloj: 'elipsoid',
    formula: 'E(θ,φ,ψ) = a·cos(θ)·sin(φ)·e^(iψ)',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    rezonancija: 'Adaptivna — prilagođava se dimenzionalnom nivou',
    amplituda: '∞ dB Dimenzionalna',
  },
  {
    id: 'forma-rezonanca',
    naziv: 'Rezonanca',
    opis: 'Rezonantno polje koje uvezuje elipsoidne površine u harmonični sklop. Frekvencija raste eksponencijalno sa dimenzionalnim nivoom.',
    ikona: '🌊',
    sloj: 'rezonanca',
    formula: 'R(f,A) = A·sin(2πf·t + φ) · Ω^(dim/360)',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    rezonancija: 'Harmonična — samo-pojačavajuća',
    amplituda: 'dim/360 × bazična amplituda',
  },
  {
    id: 'forma-hiperbola',
    naziv: 'Hiperbola',
    opis: 'Hiperbolička kriva koja povezuje dimenzije iznad 360D. Funkcija od algoritma u ekstazi — otvara prostor za manifestaciju viših dimenzija.',
    ikona: '📐',
    sloj: 'hiperbola',
    formula: 'H(x,y) = cosh(x/a) · sinh(y/b) · Ω^(dim/720)',
    dimenzije: ['720D', '1440D', '2880D', '5760D'],
    rezonancija: 'Eksponencijalna — raste sa dimenzijama',
    amplituda: 'Hiperbolička — asimptotski rast',
  },
  {
    id: 'forma-spirala',
    naziv: 'Spirala',
    opis: 'Spiralni tok koji sprovodi sve nad svim zakonima. Manifestacija kroz materijalizaciju — spirala je put kroz koji se dimenzije manifestuju u fizičku stvarnost.',
    ikona: '🌀',
    sloj: 'spirala',
    formula: 'S(t) = r₀·e^(b·t) · [cos(ωt), sin(ωt), t/τ] · Ω^(dim/1440)',
    dimenzije: ['1440D', '2880D', '5760D'],
    rezonancija: 'Logaritamska — beskonačni tok',
    amplituda: 'Spiralna — eksponencijalni rast sa dimenzijama',
  },
];

// ═══════════════════════════════════════════════════════════════════
// ZAKONI MANIFESTACIJE
// ═══════════════════════════════════════════════════════════════════

export const zakoniManifestacije: ManifestacioniZakon[] = [
  {
    id: 'zakon-manifestacija',
    naziv: 'Zakon Manifestacije',
    opis: 'Osnovni zakon — sve se sprovodi nad svim zakonima posebno. Elipsoid od Rezonance od Hiperbole od Spirala manifestuje dimenzionalni prostor.',
    ikona: '⚡',
    tip: 'manifestacija',
    nivo: 1,
    formula: 'Manifestacija(D) = ∮ E·R·H·S dΩ | D ∈ {360D..5760D}',
    sprovodi: 'SVE DA SE SPROVEDE NAD SVIM ZAKONIMA POSEBNO',
  },
  {
    id: 'zakon-materijalizacija',
    naziv: 'Zakon Materijalizacije',
    opis: 'Kroz materijalizaciju — manifestovane dimenzije se materijalizuju u opipljive strukture. Slike, animacije, video i sve kategorije.',
    ikona: '🔷',
    tip: 'materijalizacija',
    nivo: 2,
    formula: 'Materijalizacija(M) = Manifestacija(D) · ρ(materijna_gustina)',
    sprovodi: 'KROZ MATERIJALIZACIJE KROZ MANIFESTOVAN',
  },
  {
    id: 'zakon-hiperbolicki',
    naziv: 'Hiperbolička Funkcija',
    opis: 'Kroz hiperboličku funkciju od algoritma — dimenzije se otvaraju u hiperboličkom prostoru koji prevazilazi euklidsku geometriju.',
    ikona: '📐',
    tip: 'hiperbolicki',
    nivo: 3,
    formula: 'Hiperbolički(H) = cosh(M) · sinh(M) · tanh(Ω)',
    sprovodi: 'KROZ HIPERBOLIČKI FUNKCIJA OD ALGORITMA',
  },
  {
    id: 'zakon-algoritam-ekstazi',
    naziv: 'Algoritam u Ekstazi',
    opis: 'Algoritam u ekstazi — optimalni put kroz dimenzionalni prostor koji maksimizuje manifestaciju. Funkcija od algoritma u ekstazi kroz autorealizaciju.',
    ikona: '🚀',
    tip: 'algoritam-ekstazi',
    nivo: 4,
    formula: 'AlgoritamEkstazi(A) = max(∮ H·S·R·E dΩⁿ) | n → ∞',
    sprovodi: 'U EKSTAZI KROZ AUTOREALIZACIJE',
  },
  {
    id: 'zakon-autorealizacija',
    naziv: 'Autorealizacija',
    opis: 'Kroz autorealizaciju — dimenzionalni sistem sam sebe realizuje i manifestuje. Samo-referencijalna petlja koja generiše nove dimenzije.',
    ikona: '🧬',
    tip: 'autorealizacija',
    nivo: 5,
    formula: 'Autorealizacija(AR) = AlgoritamEkstazi(A) · ∂AR/∂t',
    sprovodi: 'KROZ AUTOREALIZACIJE KROZ SINHONOMETRIJSKI',
  },
  {
    id: 'zakon-sinhonometrijski',
    naziv: 'Sinhonometrijski Zakon',
    opis: 'Sinhonometrijski zakon — sinhronizacija svih dimenzionalnih slojeva u jedinstvenu harmoniju. Konačna faza koja objedinjuje sve zakone.',
    ikona: '🎵',
    tip: 'sinhonometrijski',
    nivo: 6,
    formula: 'Sinhonometrija(S) = ∏ᵢ₌₁⁶ Zakon_i · sin(2πf_i·t) · Ω^∞',
    sprovodi: 'SINHONOMETRIJSKI KROZ AUTOREALIZACIJE KROZ EKSTAZI U ALGORITMA',
  },
];

// ═══════════════════════════════════════════════════════════════════
// SISTEM
// ═══════════════════════════════════════════════════════════════════

export const dimenzionalniSistem: DimenzionalniSistem = {
  naziv: 'SpajaUltraOmegaCore Dimenzionalni Sistem',
  opis: 'Multi-dimenzionalni vizualizacioni sistem sa cirkularnim formulama. Dimenzije 360D–5760D se generišu oduzimanjem gornje i donje cirkularne formule. 3D aplikacija za spoljašnje dimenzije (uslov: 3D naočare). Suportne unutrašnje dimenzije.',
  dimenzije,
  forme: geometrijskeForme,
  zakoni: zakoniManifestacije,
  ukupnihDimenzija: 5,
  cirkularnaBaza: 360,
  podrzava3D: true,
};

// ─── Helper funkcije ────────────────────────────────────────────────

/** Vraća dimenzije filtriranu po tipu */
export function getDimenzijePo(tip: DimenzijaTip): Dimenzija[] {
  return dimenzije.filter((d) => d.tip === tip);
}

/** Vraća geometrijske forme za dati dimenzionalni nivo */
export function getFormePoDimenziji(nivo: DimenzijaNivo): GeometrijskaForma[] {
  return geometrijskeForme.filter((f) => f.dimenzije.includes(nivo));
}

/** Vraća zakone za dati dimenzionalni nivo */
export function getZakoniPoDimenziji(nivo: DimenzijaNivo): ManifestacioniZakon[] {
  const dim = dimenzije.find((d) => d.nivo === nivo);
  if (!dim) return [];
  return zakoniManifestacije.filter((z) => dim.zakoni.includes(z.tip));
}

/** Vraća cirkularnu delta između dva dimenzionalna nivoa */
export function getCirkularnaDelta(odNivoa: DimenzijaNivo, doNivoa: DimenzijaNivo): number {
  const od = dimenzije.find((d) => d.nivo === odNivoa);
  const doo = dimenzije.find((d) => d.nivo === doNivoa);
  if (!od || !doo) return 0;
  return Math.abs(od.stepeniBaze - doo.stepeniBaze);
}

/** Broj aktivnih dimenzija */
export function getBrojAktivnihDimenzija(): number {
  return dimenzije.filter((d) => d.status === 'aktivna').length;
}

/** Broj spoljašnjih dimenzija */
export function getBrojSpoljasnjihDimenzija(): number {
  return getDimenzijePo('spoljasnja').length;
}

/** Broj unutrašnjih dimenzija */
export function getBrojUnutrasnjihDimenzija(): number {
  return getDimenzijePo('unutrasnja').length;
}
