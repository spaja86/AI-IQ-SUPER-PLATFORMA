import type { MetadataRoute } from 'next';
import { APP_NAME, KOMPANIJA, OMEGA_AI_PERSONA_COUNT, TOTAL_IGRICA, SPAJA_PRO_RANGE } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'AI-IQ',
    description: `Digitalna Industrija — ${KOMPANIJA}. SpajaPro Prompt Engine v${SPAJA_PRO_RANGE}, ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona, ${TOTAL_IGRICA} igrica, Proksi mreža, SPAJA Mobilna Mreža.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a1a',
    theme_color: '#0a0a1a',
    orientation: 'any',
    lang: 'sr-Latn',
    scope: '/',
    categories: ['business', 'productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Poslovni Novčanik',
        short_name: 'Novčanik',
        description: 'Otvori poslovni wallet modul',
        url: '/poslovni-novcanik',
      },
      {
        name: 'AI IQ World Bank',
        short_name: 'Banka',
        description: 'Otvori bankarski modul',
        url: '/banka',
      },
      {
        name: 'Generator Poslovnih Računa',
        short_name: 'Generator',
        description: 'Otvori AI IQ World Bank generator poslovnih računa',
        url: '/generator-za-poslovne-racune',
      },
    ],
    icons: [
      {
        src: BRAND_ASSETS.favicon,
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
