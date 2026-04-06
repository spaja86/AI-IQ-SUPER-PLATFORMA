import type { MetadataRoute } from 'next';
import { APP_NAME, KOMPANIJA, BASE_URL } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'AI-IQ',
    description: `Digitalna Industrija — ${KOMPANIJA}. SpajaPro Prompt Engine v6-15, 21 OMEGA AI persona, 95 igrica, Proksi mreža, SPAJA Mobilna Mreža.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a1a',
    theme_color: '#0a0a1a',
    orientation: 'any',
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
