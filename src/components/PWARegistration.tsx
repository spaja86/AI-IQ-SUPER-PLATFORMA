'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — PWA Service Worker Registration
// Kompanija SPAJA — Digitalna Industrija

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => {
          console.warn('SW registration failed:', err);
        });
    }
  }, []);

  return null;
}
