import type { MetadataRoute } from 'next';
import { APP_NAME, KOMPANIJA, OMEGA_AI_PERSONA_COUNT, TOTAL_IGRICA, SPAJA_PRO_RANGE } from '@/lib/constants';

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
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
