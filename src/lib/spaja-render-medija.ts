/**
 * 🎬 SPAJA Render za Slike i Video — Render Medija Sistem
 *
 * SPAJA Render za Slike i Video renderuje slike, video i sve
 * povezane medijske kategorije — animacije, 3D modele, vektorsku
 * grafiku, audio-vizuelne kompozicije, hologram i VR/AR sadržaj.
 *
 * Manifestovan kroz "SPAJA Generator za Endžine" koji prevlači
 * engine-e preko svih render modula u ekosistemu.
 *
 * Link: https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6
 */

// ─── Tipovi ──────────────────────────────────────────────

export type RenderStatus = 'aktivan' | 'renderovanje' | 'cekanje' | 'odrzavanje' | 'planiran';
export type RenderKategorija = 'slika' | 'video' | 'animacija' | '3d-model' | 'vektorska-grafika' | 'audio-vizuelno' | 'hologram' | 'vr-ar';

export interface RenderEngine {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: RenderKategorija;
  status: RenderStatus;
  verzija: string;
  formati: string[];
  mogucnosti: string[];
  rezolucija: string;
  fps?: number;
}

export interface RenderPipeline {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  koraci: string[];
  ulazniFormati: string[];
  izlazniFormati: string[];
}

export interface RenderStatistika {
  ukupnoEngina: number;
  aktivnihEngina: number;
  ukupnoPipeline: number;
  ukupnoFormata: number;
  ukupnoKategorija: number;
}

export type NikolaSpajicFormulaKategorija = 'slika' | 'video';
export type NikolaSpajicFormulaStatus = 'optimalno' | 'stabilno' | 'oprez' | 'kriticno';

export interface NikolaSpajicFormulaInput {
  kvalitetIzvora: number;
  kompleksnostScene: number;
  dinamikaPokreta: number;
  aiPouzdanost: number;
  vremenskiBudzetMs: number;
}

export interface NikolaSpajicFormulaBoundaries {
  kvalitetIzvora: { min: number; max: number };
  kompleksnostScene: { min: number; max: number };
  dinamikaPokreta: { min: number; max: number };
  aiPouzdanost: { min: number; max: number };
  vremenskiBudzetMs: { min: number; max: number };
}

export interface NikolaSpajicFormulaWeights {
  kvalitetIzvora: number;
  kompleksnostScene: number;
  dinamikaPokreta: number;
  aiPouzdanost: number;
  vremenskiBudzetMs: number;
}

export interface NikolaSpajicFormulaSpec {
  naziv: string;
  autor: string;
  verzija: string;
  ulazi: string[];
  izlazi: string[];
  granice: NikolaSpajicFormulaBoundaries;
  tezine: Record<NikolaSpajicFormulaKategorija, NikolaSpajicFormulaWeights>;
  fallbackPravila: string[];
}

export interface ChatGptFormulaSuggestionPayload {
  kvalitetIzvora?: number;
  kompleksnostScene?: number;
  dinamikaPokreta?: number;
  aiPouzdanost?: number;
  vremenskiBudzetMs?: number;
}

export interface ChatGptFormulaValidation {
  valid: boolean;
  warnings: string[];
}

export interface ChatGptIntegracioniUgovor {
  mode: 'predlog-parametara';
  runtimeEvaluacija: false;
  ulaznoMapiranje: string[];
  izlaznoMapiranje: string[];
  validacija: string[];
  ogranicenja: string[];
  fallback: string[];
}

export interface NikolaSpajicFormulaResult {
  kategorija: NikolaSpajicFormulaKategorija;
  score: number;
  status: NikolaSpajicFormulaStatus;
  preporuka: string;
  objasnjenje: string;
  input: NikolaSpajicFormulaInput;
  warnings: string[];
  fallbackUsed: boolean;
}

export interface NikolaSpajicFormulaSummary {
  slika: NikolaSpajicFormulaResult;
  video: NikolaSpajicFormulaResult;
  chatGpt: {
    mode: ChatGptIntegracioniUgovor['mode'];
    runtimeEvaluacija: ChatGptIntegracioniUgovor['runtimeEvaluacija'];
  };
}

export interface SpajaRenderMedija {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  generatorLink: string;
  engini: RenderEngine[];
  pipeline: RenderPipeline[];
  statistika: RenderStatistika;
  nikolaSpajicFormule: NikolaSpajicFormulaSummary;
  chatGptIntegracioniUgovor: ChatGptIntegracioniUgovor;
}

// ─── Render Engine-i ─────────────────────────────────────

export const renderEngini: RenderEngine[] = [
  {
    id: 'render-slike-hd-4k-8k',
    naziv: 'Slike HD/4K/8K Render',
    opis: 'Engine za renderovanje slika u HD, 4K i 8K rezoluciji — fotografije, ilustracije i digitalna umetnost',
    ikona: '🖼️',
    kategorija: 'slika',
    status: 'aktivan',
    verzija: '3.0.0',
    formati: ['PNG', 'JPEG', 'WebP', 'AVIF', 'TIFF', 'BMP', 'RAW'],
    mogucnosti: ['HDR renderovanje', 'Color grading', 'Noise reduction', 'Super-rezolucija', 'Batch obrada'],
    rezolucija: '8K (7680×4320)',
  },
  {
    id: 'render-video-engine',
    naziv: 'Video Render Engine',
    opis: 'Engine za renderovanje video sadržaja — od SD do 8K, enkodiranje, montaža i post-produkcija',
    ikona: '🎬',
    kategorija: 'video',
    status: 'aktivan',
    verzija: '2.5.0',
    formati: ['MP4', 'WebM', 'AVI', 'MOV', 'MKV', 'ProRes'],
    mogucnosti: ['Multi-rezolucija', 'Hardware enkodiranje', 'HDR10/Dolby Vision', 'Multi-track audio', 'Titlovi'],
    rezolucija: '8K (7680×4320)',
    fps: 120,
  },
  {
    id: 'render-animacioni',
    naziv: 'Animacioni Render',
    opis: 'Engine za renderovanje animacija — 2D, 3D, pokretna grafika i karakter animacija',
    ikona: '🎞️',
    kategorija: 'animacija',
    status: 'aktivan',
    verzija: '2.0.0',
    formati: ['GIF', 'APNG', 'WebP', 'Lottie', 'SVG Animacija', 'MP4'],
    mogucnosti: ['Keyframe animacija', 'Pokretna grafika', '2D/3D animacija', 'Karakter rigging', 'Fizika simulacija'],
    rezolucija: '4K (3840×2160)',
    fps: 60,
  },
  {
    id: 'render-3d-model',
    naziv: '3D Model Render',
    opis: 'Engine za renderovanje 3D modela — ray tracing, PBR materijali, globalno osvetljenje',
    ikona: '🧊',
    kategorija: '3d-model',
    status: 'aktivan',
    verzija: '2.0.0',
    formati: ['glTF', 'OBJ', 'FBX', 'STL', 'USDZ', 'BLEND'],
    mogucnosti: ['Ray tracing', 'PBR materijali', 'Globalno osvetljenje', 'Subsurface scattering', 'Ambient occlusion'],
    rezolucija: '8K (7680×4320)',
    fps: 60,
  },
  {
    id: 'render-vektorska-grafika',
    naziv: 'Vektorska Grafika Engine',
    opis: 'Engine za renderovanje vektorske grafike — SVG, AI, EPS sa beskonačnim skaliranjem',
    ikona: '✏️',
    kategorija: 'vektorska-grafika',
    status: 'aktivan',
    verzija: '1.5.0',
    formati: ['SVG', 'AI', 'EPS', 'PDF', 'DXF'],
    mogucnosti: ['Beskonačno skaliranje', 'Bézier krive', 'Gradijenti', 'Pattern fill', 'Tipografija'],
    rezolucija: 'Beskonačna (vektorska)',
  },
  {
    id: 'render-audio-vizuelni',
    naziv: 'Audio-Vizuelni Kompozitor',
    opis: 'Engine za audio-vizuelne kompozicije — sinhronizacija zvuka i slike, vizualizatori i efekti',
    ikona: '🎵',
    kategorija: 'audio-vizuelno',
    status: 'aktivan',
    verzija: '1.0.0',
    formati: ['MP4+Audio', 'WebM+Audio', 'AV1', 'Opus', 'AAC'],
    mogucnosti: ['Audio vizualizacija', 'Sinhronizacija', 'Spektar animacija', 'Beat detekcija', 'Multi-track miks'],
    rezolucija: '4K (3840×2160)',
    fps: 60,
  },
  {
    id: 'render-hologramski',
    naziv: 'Hologramski Render',
    opis: 'Engine za renderovanje holograma — volumetrijski prikaz, svetlosno polje i prostorno mapiranje',
    ikona: '🌌',
    kategorija: 'hologram',
    status: 'renderovanje',
    verzija: '0.5.0',
    formati: ['HoloData', 'LightField', 'VolumeMap', 'PointCloud'],
    mogucnosti: ['Volumetrijski rendering', 'Svetlosno polje', 'Prostorno mapiranje', 'Real-time hologram', 'Interaktivni prikaz'],
    rezolucija: '4K Volumetrijski',
    fps: 30,
  },
  {
    id: 'render-vr-ar',
    naziv: 'VR/AR Render Engine',
    opis: 'Engine za virtuelnu i proširenu realnost — stereoskopski rendering, prostorno praćenje i interakcija',
    ikona: '🥽',
    kategorija: 'vr-ar',
    status: 'aktivan',
    verzija: '1.5.0',
    formati: ['OpenXR', 'glTF-VR', 'USDZ-AR', 'WebXR'],
    mogucnosti: ['Stereoskopski rendering', 'Prostorno praćenje', '6DOF interakcija', 'Hand tracking', 'Eye tracking'],
    rezolucija: '4K po oku (4320×4320)',
    fps: 90,
  },
  {
    id: 'render-ai-upscaling',
    naziv: 'AI Upscaling Engine',
    opis: 'AI engine za povećanje rezolucije — neuronske mreže za super-rezoluciju slika i videa',
    ikona: '🤖',
    kategorija: 'slika',
    status: 'aktivan',
    verzija: '2.0.0',
    formati: ['PNG', 'JPEG', 'WebP', 'MP4', 'WebM'],
    mogucnosti: ['AI super-rezolucija', '4× uvećanje', 'Denoising', 'Face enhancement', 'Video upscaling'],
    rezolucija: 'Do 16K (AI uvećanje)',
  },
  {
    id: 'render-dimenzionalni-360d-5760d',
    naziv: 'Dimenzionalni Render 360D-5760D',
    opis: 'Engine za dimenzionalno renderovanje — od 360D do 5760D, geometrijski procesori i cirkularne formule',
    ikona: '🌀',
    kategorija: '3d-model',
    status: 'aktivan',
    verzija: '1.0.0',
    formati: ['DIM360', 'DIM720', 'DIM1080', 'DIM5760', 'Universal-DIM'],
    mogucnosti: ['Dimenzionalno renderovanje 360D–5760D', 'Geometrijski procesori', 'Cirkularne formule', 'Multi-dimenzionalni prostor', 'Beskonačna dubina'],
    rezolucija: '5760D Dimenzionalna',
    fps: 60,
  },
];

// ─── Render Pipeline-i ───────────────────────────────────

export const renderPipeline: RenderPipeline[] = [
  {
    id: 'pipeline-standardni',
    naziv: 'Standardni Pipeline',
    opis: 'Osnovni render pipeline za svakodnevnu upotrebu — brz i efikasan za standardne formate',
    ikona: '📋',
    koraci: ['Prijem medija', 'Dekodiranje', 'Obrada', 'Enkodiranje', 'Isporuka'],
    ulazniFormati: ['PNG', 'JPEG', 'MP4', 'WebM', 'SVG'],
    izlazniFormati: ['PNG', 'JPEG', 'WebP', 'MP4', 'WebM'],
  },
  {
    id: 'pipeline-profesionalni',
    naziv: 'Profesionalni Pipeline',
    opis: 'Pipeline za profesionalnu produkciju — HDR, color management, multi-pass renderovanje',
    ikona: '🎬',
    koraci: ['Prijem medija', 'Color space konverzija', 'HDR obrada', 'Multi-pass render', 'Color grading', 'Finalni output'],
    ulazniFormati: ['RAW', 'ProRes', 'EXR', 'DPX', 'TIFF'],
    izlazniFormati: ['ProRes', 'EXR', 'DPX', 'TIFF', 'DCI-P3'],
  },
  {
    id: 'pipeline-ai-poboljsani',
    naziv: 'AI-Poboljšani Pipeline',
    opis: 'Pipeline sa AI poboljšanjima — super-rezolucija, denoising, face enhancement i sadržajna analiza',
    ikona: '🤖',
    koraci: ['Prijem medija', 'AI analiza', 'Super-rezolucija', 'Denoising', 'Enhancement', 'Finalni output'],
    ulazniFormati: ['PNG', 'JPEG', 'MP4', 'WebM', 'TIFF'],
    izlazniFormati: ['PNG', 'WebP', 'AVIF', 'MP4', 'WebM'],
  },
  {
    id: 'pipeline-real-time',
    naziv: 'Real-Time Pipeline',
    opis: 'Pipeline za renderovanje u realnom vremenu — streaming, gaming i live prezentacije',
    ikona: '⚡',
    koraci: ['Frame capture', 'GPU obrada', 'Post-processing', 'V-Sync', 'Display output'],
    ulazniFormati: ['Frame buffer', 'WebGL', 'Vulkan', 'DirectX'],
    izlazniFormati: ['Display stream', 'WebRTC', 'HLS', 'DASH'],
  },
  {
    id: 'pipeline-batch-processing',
    naziv: 'Batch Processing Pipeline',
    opis: 'Pipeline za masovnu obradu — paralelno renderovanje velikog broja fajlova sa redovima čekanja',
    ikona: '📦',
    koraci: ['Red čekanja', 'Distribucija poslova', 'Paralelna obrada', 'Agregacija', 'Isporuka paketa'],
    ulazniFormati: ['PNG', 'JPEG', 'TIFF', 'MP4', 'MOV', 'RAW'],
    izlazniFormati: ['PNG', 'JPEG', 'WebP', 'AVIF', 'MP4', 'WebM'],
  },
  {
    id: 'pipeline-dimenzionalni',
    naziv: 'Dimenzionalni Pipeline',
    opis: 'Pipeline za dimenzionalno renderovanje — 360D-5760D, geometrijski procesori i cirkularne formule',
    ikona: '🌀',
    koraci: ['Dimenzionalni prijem', 'Geometrijska obrada', 'Cirkularna transformacija', 'Multi-dim render', 'Dimenzionalni output'],
    ulazniFormati: ['DIM360', 'DIM720', 'DIM1080', 'glTF', 'USDZ'],
    izlazniFormati: ['DIM360', 'DIM720', 'DIM1080', 'DIM5760', 'Universal-DIM'],
  },
];

const FORMULA_SCORE_MIN = 0;
const FORMULA_SCORE_MAX = 100;

const FORMULA_DEFAULT_INPUT: Record<NikolaSpajicFormulaKategorija, NikolaSpajicFormulaInput> = {
  slika: {
    kvalitetIzvora: 78,
    kompleksnostScene: 64,
    dinamikaPokreta: 20,
    aiPouzdanost: 85,
    vremenskiBudzetMs: 42_000,
  },
  video: {
    kvalitetIzvora: 72,
    kompleksnostScene: 74,
    dinamikaPokreta: 82,
    aiPouzdanost: 80,
    vremenskiBudzetMs: 90_000,
  },
};

export const nikolaSpajicFormulaSpec: NikolaSpajicFormulaSpec = {
  naziv: 'Nikola Spajić formule za SPAJA Render',
  autor: 'Nikola Spajić',
  verzija: '1.0.0',
  ulazi: [
    'kvalitetIzvora',
    'kompleksnostScene',
    'dinamikaPokreta',
    'aiPouzdanost',
    'vremenskiBudzetMs',
  ],
  izlazi: ['score', 'status', 'preporuka', 'objasnjenje', 'warnings', 'fallbackUsed'],
  granice: {
    kvalitetIzvora: { min: 0, max: 100 },
    kompleksnostScene: { min: 0, max: 100 },
    dinamikaPokreta: { min: 0, max: 100 },
    aiPouzdanost: { min: 0, max: 100 },
    vremenskiBudzetMs: { min: 1_000, max: 180_000 },
  },
  tezine: {
    slika: {
      kvalitetIzvora: 0.35,
      kompleksnostScene: 0.25,
      dinamikaPokreta: 0.05,
      aiPouzdanost: 0.25,
      vremenskiBudzetMs: 0.1,
    },
    video: {
      kvalitetIzvora: 0.25,
      kompleksnostScene: 0.2,
      dinamikaPokreta: 0.3,
      aiPouzdanost: 0.15,
      vremenskiBudzetMs: 0.1,
    },
  },
  fallbackPravila: [
    'Ako je ulaz nevalidan (NaN, Infinity, nedostaje), koristi se podrazumevana vrednost po kategoriji.',
    'Ako ChatGPT payload nije validan, ignoriše se i koristi se deterministic fallback.',
    'Score se uvek clamp-uje u opsegu 0–100.',
  ],
};

export const chatGptIntegracioniUgovor: ChatGptIntegracioniUgovor = {
  mode: 'predlog-parametara',
  runtimeEvaluacija: false,
  ulaznoMapiranje: [
    'prompt.category -> slika|video',
    'prompt.qualityHint -> kvalitetIzvora',
    'prompt.complexityHint -> kompleksnostScene',
    'prompt.motionHint -> dinamikaPokreta',
    'prompt.confidenceHint -> aiPouzdanost',
    'prompt.timeBudgetMs -> vremenskiBudzetMs',
  ],
  izlaznoMapiranje: [
    'chatgpt.kvalitetIzvora -> formula.kvalitetIzvora',
    'chatgpt.kompleksnostScene -> formula.kompleksnostScene',
    'chatgpt.dinamikaPokreta -> formula.dinamikaPokreta',
    'chatgpt.aiPouzdanost -> formula.aiPouzdanost',
    'chatgpt.vremenskiBudzetMs -> formula.vremenskiBudzetMs',
  ],
  validacija: [
    'Svi numericki parametri moraju biti konacni brojevi.',
    'Parametri se clamp-uju na dozvoljene granice iz specifikacije.',
    'Payload se smatra nevalidnim ako nijedan parametar nije upotrebljiv.',
  ],
  ogranicenja: [
    'ChatGPT se koristi samo za predlog parametara.',
    'Runtime evaluacija score-a je lokalna i deterministic.',
    'Nema spoljnog API poziva u kriticnom putu render evaluacije.',
  ],
  fallback: [
    'Ako ChatGPT nije dostupan, koristi se default ulaz po kategoriji.',
    'Ako ChatGPT vrati nevalidan payload, ignoriše se i beleži warning.',
    'Ako pojedinačni parametar nije validan, koristi se fallback samo za taj parametar.',
  ],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeVremenskiBudzet(
  value: number,
  kategorija: NikolaSpajicFormulaKategorija,
): number {
  const target = kategorija === 'slika' ? 45_000 : 90_000;
  return clamp((value / target) * 100, FORMULA_SCORE_MIN, FORMULA_SCORE_MAX);
}

function toFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function sanitizeFormulaInput(
  kategorija: NikolaSpajicFormulaKategorija,
  input?: Partial<NikolaSpajicFormulaInput>,
): { value: NikolaSpajicFormulaInput; warnings: string[]; fallbackUsed: boolean } {
  const fallback = FORMULA_DEFAULT_INPUT[kategorija];
  const warnings: string[] = [];
  let fallbackUsed = false;

  const pick = (
    key: keyof NikolaSpajicFormulaInput,
    min: number,
    max: number,
  ): number => {
    const raw = toFiniteNumber(input?.[key]);
    if (raw === undefined) {
      fallbackUsed = true;
      warnings.push(`${key}: fallback`);
      return fallback[key];
    }
    return clamp(raw, min, max);
  };

  return {
    value: {
      kvalitetIzvora: pick('kvalitetIzvora', 0, 100),
      kompleksnostScene: pick('kompleksnostScene', 0, 100),
      dinamikaPokreta: pick('dinamikaPokreta', 0, 100),
      aiPouzdanost: pick('aiPouzdanost', 0, 100),
      vremenskiBudzetMs: pick('vremenskiBudzetMs', 1_000, 180_000),
    },
    warnings,
    fallbackUsed,
  };
}

function resolveFormulaStatus(score: number): NikolaSpajicFormulaStatus {
  if (score >= 85) return 'optimalno';
  if (score >= 70) return 'stabilno';
  if (score >= 50) return 'oprez';
  return 'kriticno';
}

function resolveFormulaPreporuka(
  kategorija: NikolaSpajicFormulaKategorija,
  status: NikolaSpajicFormulaStatus,
): string {
  if (status === 'optimalno') return `Render za ${kategorija} je spreman za pun kvalitet i produkcioni izlaz.`;
  if (status === 'stabilno') return `Render za ${kategorija} je stabilan; preporučeno je blago fino podešavanje parametara.`;
  if (status === 'oprez') return `Render za ${kategorija} traži optimizaciju pre finalnog izvoza.`;
  return `Render za ${kategorija} nije preporučen bez korekcije ulaza i/ili budžeta vremena.`;
}

function resolveFormulaObjasnjenje(
  kategorija: NikolaSpajicFormulaKategorija,
  status: NikolaSpajicFormulaStatus,
): string {
  return `Nikola Spajić formula (${kategorija}) status=${status}; ChatGPT ima ulogu predloga parametara, dok se runtime score računa lokalno.`;
}

export function validateChatGptFormulaSuggestion(
  payload: unknown,
): ChatGptFormulaValidation {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, warnings: ['chatgpt payload nije objekat'] };
  }
  const p = payload as ChatGptFormulaSuggestionPayload;
  const values = [
    p.kvalitetIzvora,
    p.kompleksnostScene,
    p.dinamikaPokreta,
    p.aiPouzdanost,
    p.vremenskiBudzetMs,
  ];
  const usable = values.some((v) => typeof v === 'number' && Number.isFinite(v));
  if (!usable) {
    return { valid: false, warnings: ['chatgpt payload nema nijedan upotrebljiv numericki parametar'] };
  }
  return { valid: true, warnings: [] };
}

export function evaluateNikolaSpajicFormule(
  kategorija: NikolaSpajicFormulaKategorija,
  input?: Partial<NikolaSpajicFormulaInput>,
): NikolaSpajicFormulaResult {
  const sanitized = sanitizeFormulaInput(kategorija, input);
  const normalizedBudget = normalizeVremenskiBudzet(
    sanitized.value.vremenskiBudzetMs,
    kategorija,
  );
  const tezine = nikolaSpajicFormulaSpec.tezine[kategorija];

  const rawScore =
    sanitized.value.kvalitetIzvora * tezine.kvalitetIzvora +
    sanitized.value.kompleksnostScene * tezine.kompleksnostScene +
    sanitized.value.dinamikaPokreta * tezine.dinamikaPokreta +
    sanitized.value.aiPouzdanost * tezine.aiPouzdanost +
    normalizedBudget * tezine.vremenskiBudzetMs;

  const score = Math.round(clamp(rawScore, FORMULA_SCORE_MIN, FORMULA_SCORE_MAX) * 100) / 100;
  const status = resolveFormulaStatus(score);

  return {
    kategorija,
    score,
    status,
    preporuka: resolveFormulaPreporuka(kategorija, status),
    objasnjenje: resolveFormulaObjasnjenje(kategorija, status),
    input: sanitized.value,
    warnings: sanitized.warnings,
    fallbackUsed: sanitized.fallbackUsed,
  };
}

export function evaluateNikolaSpajicFormuleFromChatGpt(
  kategorija: NikolaSpajicFormulaKategorija,
  payload: unknown,
): NikolaSpajicFormulaResult {
  const validation = validateChatGptFormulaSuggestion(payload);
  if (!validation.valid) {
    return {
      ...evaluateNikolaSpajicFormule(kategorija),
      warnings: [...validation.warnings, 'chatgpt fallback: default input'],
      fallbackUsed: true,
    };
  }

  const suggestion = payload as ChatGptFormulaSuggestionPayload;
  const result = evaluateNikolaSpajicFormule(kategorija, suggestion);
  return {
    ...result,
    warnings: [...result.warnings, ...validation.warnings],
  };
}

export function getNikolaSpajicFormulaSummary(): NikolaSpajicFormulaSummary {
  return {
    slika: evaluateNikolaSpajicFormule('slika'),
    video: evaluateNikolaSpajicFormule('video'),
    chatGpt: {
      mode: chatGptIntegracioniUgovor.mode,
      runtimeEvaluacija: chatGptIntegracioniUgovor.runtimeEvaluacija,
    },
  };
}

// ─── Kompletni SPAJA Render Medija ───────────────────────

function izracunajStatistiku(): RenderStatistika {
  const aktivnih = renderEngini.filter((e) => e.status === 'aktivan').length;
  const sviFormati = new Set(renderEngini.flatMap((e) => e.formati));
  const kategorije = new Set(renderEngini.map((e) => e.kategorija)).size;

  return {
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: aktivnih,
    ukupnoPipeline: renderPipeline.length,
    ukupnoFormata: sviFormati.size,
    ukupnoKategorija: kategorije,
  };
}

export const spajaRenderMedija: SpajaRenderMedija = {
  naziv: 'SPAJA Render za Slike i Video',
  opis:
    'SPAJA Render za Slike i Video renderuje slike, video i sve povezane medijske kategorije — ' +
    'animacije, 3D modele, vektorsku grafiku, audio-vizuelne kompozicije, hologram i VR/AR sadržaj. ' +
    'Manifestovan kroz SPAJA Generator za Endžine koji prevlači engine-e preko svih render modula.',
  verzija: '1.0.0',
  link: 'https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
  generatorLink: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  engini: renderEngini,
  pipeline: renderPipeline,
  statistika: izracunajStatistiku(),
  nikolaSpajicFormule: getNikolaSpajicFormulaSummary(),
  chatGptIntegracioniUgovor: chatGptIntegracioniUgovor,
};

// ─── Helper funkcije ─────────────────────────────────────

export function getAktivniEngini(): RenderEngine[] {
  return renderEngini.filter((e) => e.status === 'aktivan');
}

export function getEnginiPoKategoriji(kat: RenderKategorija): RenderEngine[] {
  return renderEngini.filter((e) => e.kategorija === kat);
}

export function getEnginePoId(id: string): RenderEngine | undefined {
  return renderEngini.find((e) => e.id === id);
}

export function getPipeline(): RenderPipeline[] {
  return renderPipeline;
}

export function getRenderStatistika(): RenderStatistika {
  return izracunajStatistiku();
}
