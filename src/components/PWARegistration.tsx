'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — PWA Service Worker Registration
// Kompanija SPAJA — Digitalna Industrija

import { useEffect } from 'react';
import { APP_VERSION } from '@/lib/constants';

export default function PWARegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let refreshed = false;
    const onControllerChange = () => {
      if (refreshed) return;
      refreshed = true;
      window.location.reload();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATED') {
        navigator.serviceWorker.getRegistration().then((registration) => registration?.update()).catch((error) => {
          console.warn('SW update check failed:', error);
        });
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    navigator.serviceWorker.addEventListener('message', onMessage);

    navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`).then((registration) => {
      const activateWaitingWorker = () => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      };

      if (registration.waiting) activateWaitingWorker();

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            activateWaitingWorker();
          }
        });
      });
    }).catch((err) => {
      console.warn('SW registration failed:', err);
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
  }, []);

  return null;
}
