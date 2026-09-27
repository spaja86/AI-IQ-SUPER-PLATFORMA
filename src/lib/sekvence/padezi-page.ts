import type { Sekvenca } from '@/lib/types';
import {
  DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE,
  DEVELOPER_CREATE_PADEZI_CANONICAL_ALIAS,
} from '@/lib/extrimli/developer-create-vrh-ekviladenta-contract';
import { padeziMeta } from './padezi-shared';

export const padeziSekvence: Sekvenca[] = [
  {
    id: 'padezi-hero',
    tip: 'hero',
    naslov: '📚 PADEŽI — objedinjeni pregled',
    podnaslov: 'Developer/Create additive-only jezički paket za sedam kanonskih padeža',
    redosled: 1,
    podaci: {
      opis:
        `${DEVELOPER_CREATE_PADEZI_CANONICAL_ALIAS} ostaje interpretativni paket bez novog source-of-truth sistema. ` +
        'Postojeći moduli za nominativ, genitiv, dativ i akuzativ zadržavaju obrazac, a isti UI/routing model se proširuje na vokativ, instrumental i lokativ.',
      dugmad: [
        { tekst: 'Nominativ', href: '/nominativ' },
        { tekst: 'Akuzativ', href: '/akuzativ', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'padezi-kanon',
    tip: 'tekst',
    naslov: '🧭 Kanonski poredak i normalizacija',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Kanonski spisak je standardizovan na puni skup od sedam padeža. Dupli LOKATIV iz početnog zahteva normalizovan je u VOKATIV, tako da pregled ostaje: NOMINATIV, GENITIV, DATIV, AKUZATIV, VOKATIV, INSTRUMENTAL, LOKATIV.',
    },
  },
  {
    id: 'padezi-tabela',
    tip: 'tabela',
    naslov: '🗂️ Pregled svih padeža',
    redosled: 3,
    podaci: {
      zaglavlje: ['Padež', 'Ruta', 'Fokus'],
      redovi: padeziMeta.map((item) => [item.naziv, item.href, item.kratkiOpis]),
    },
  },
  {
    id: 'padezi-output-model',
    tip: 'lista',
    naslov: '📤 Zaključani output model',
    redosled: 4,
    podaci: {
      stavke: [
        'readinessStatus',
        'blockerReason / watchReasons',
        'humanReviewStatus',
        'rolloutPlan / rollbackPlan',
        'releaseAuditSummary',
        'downstreamReference',
        `kanonski niz: ${DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE.join(' → ')}`,
      ],
    },
  },
  {
    id: 'padezi-cta',
    tip: 'cta',
    naslov: '🚀 Otvori padežne module',
    redosled: 5,
    podaci: {
      opis:
        'PADEŽI paket ostaje summary-only downstream prema spaja86/IO-OPENUI-AO i ne uvodi paralelni runtime sistem.',
      dugmad: padeziMeta.map((item) => ({
        tekst: item.naziv,
        href: item.href,
        stil: item.id === 'nominativ' ? undefined : ('sekundarno' as const),
      })),
    },
  },
];
