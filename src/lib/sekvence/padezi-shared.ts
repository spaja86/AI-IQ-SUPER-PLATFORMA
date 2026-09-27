import type { Sekvenca } from '@/lib/types';
import { DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE } from '@/lib/extrimli/developer-create-vrh-ekviladenta-contract';

export type PadezId =
  | 'nominativ'
  | 'genitiv'
  | 'dativ'
  | 'akuzativ'
  | 'vokativ'
  | 'instrumental'
  | 'lokativ';

type PadezMeta = {
  id: PadezId;
  naziv: (typeof DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE)[number];
  href: `/${PadezId}`;
  ikona: string;
  kratkiOpis: string;
};

const PADEZI_META_BY_CASE: Record<
  (typeof DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE)[number],
  PadezMeta
> = {
  NOMINATIV: {
    id: 'nominativ',
    naziv: 'NOMINATIV',
    href: '/nominativ',
    ikona: '🅽',
    kratkiOpis: 'Imenovanje subjekta i osnovnog oblika reči.',
  },
  GENITIV: {
    id: 'genitiv',
    naziv: 'GENITIV',
    href: '/genitiv',
    ikona: '🅶',
    kratkiOpis: 'Pripadnost, količina, odsustvo i negacija.',
  },
  DATIV: {
    id: 'dativ',
    naziv: 'DATIV',
    href: '/dativ',
    ikona: '🅳',
    kratkiOpis: 'Primaoc radnje, namenjenost i usmerenost.',
  },
  AKUZATIV: {
    id: 'akuzativ',
    naziv: 'AKUZATIV',
    href: '/akuzativ',
    ikona: '🧠',
    kratkiOpis: 'Direktan objekat i kretanje ka cilju.',
  },
  VOKATIV: {
    id: 'vokativ',
    naziv: 'VOKATIV',
    href: '/vokativ',
    ikona: '🗣️',
    kratkiOpis: 'Dozivanje, obraćanje i tonska jasnoća poziva.',
  },
  INSTRUMENTAL: {
    id: 'instrumental',
    naziv: 'INSTRUMENTAL',
    href: '/instrumental',
    ikona: '🛠️',
    kratkiOpis: 'Sredstvo, način vršenja radnje i društvo.',
  },
  LOKATIV: {
    id: 'lokativ',
    naziv: 'LOKATIV',
    href: '/lokativ',
    ikona: '📍',
    kratkiOpis: 'Mesto, tema i odnos uz predloge.',
  },
};

const PADEZI_META: PadezMeta[] = DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE.map(
  (naziv) => PADEZI_META_BY_CASE[naziv],
);

const PADEZI_META_BY_ID = Object.fromEntries(PADEZI_META.map((item) => [item.id, item])) as Record<
  PadezId,
  PadezMeta
>;

export const padeziMeta = PADEZI_META;

export function getPadezMeta(id: PadezId): PadezMeta {
  return PADEZI_META_BY_ID[id];
}

export function buildPadezNavigationButtons(
  currentId: PadezId | null,
  options: { includeOverview?: boolean; includeCurrent?: boolean; primaryId?: PadezId } = {},
) {
  const { includeOverview = true, includeCurrent = false, primaryId } = options;
  const visibleMeta = PADEZI_META.filter((item) => includeCurrent || item.id !== currentId);
  const orderedMeta = [
    ...(primaryId ? visibleMeta.filter((item) => item.id === primaryId) : []),
    ...visibleMeta.filter((item) => item.id !== primaryId),
  ];

  return [
    ...orderedMeta.map((item) => ({
      tekst: item.naziv,
      href: item.href,
      stil: 'sekundarno' as const,
    })),
    ...(includeOverview ? [{ tekst: 'Pregled PADEŽI', href: '/padezi', stil: 'sekundarno' as const }] : []),
  ];
}

type BuildPadezSekvenceOptions = {
  podnaslov: string;
  opis: string;
  fokus: string[];
  primeri?: string[];
};

export function buildPadezSekvence(
  id: PadezId,
  options: BuildPadezSekvenceOptions,
): Sekvenca[] {
  const meta = getPadezMeta(id);

  return [
    {
      id: `${id}-hero`,
      tip: 'hero',
      naslov: `${meta.ikona} ${meta.naziv} — povezani modul`,
      podnaslov: options.podnaslov,
      redosled: 1,
      podaci: {
        opis: options.opis,
        dugmad: buildPadezNavigationButtons(id),
      },
    },
    {
      id: `${id}-fokus`,
      tip: 'lista',
      naslov: `🎯 ${meta.naziv} — fokus učenja`,
      redosled: 2,
      podaci: {
        stavke: options.fokus,
      },
    },
    ...(options.primeri
      ? [
          {
            id: `${id}-primeri`,
            tip: 'lista' as const,
            naslov: `🧪 ${meta.naziv} — primeri i signalne tačke`,
            redosled: 3,
            podaci: {
              stavke: options.primeri,
            },
          },
        ]
      : []),
    {
      id: `${id}-cta`,
      tip: 'cta',
      naslov: '🔗 Povezani padeži',
      redosled: options.primeri ? 4 : 3,
      podaci: {
        opis:
          'PADEŽI paket prati kanonski niz NOMINATIV → GENITIV → DATIV → AKUZATIV → VOKATIV → INSTRUMENTAL → LOKATIV i ostaje summary-only vezan za Developer/Create / VRH PROGRAMSKOG EKVILADENTA.',
        dugmad: buildPadezNavigationButtons(id),
      },
    },
  ];
}
