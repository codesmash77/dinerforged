/// <reference types="vite/client" />
import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('[Dinerforged PWA] New version available! Reloading page...');
        if (confirm('A new version of Dinerforged is available. Reload now to update?')) {
          window.location.reload();
        }
      } else {
        console.log('[Dinerforged PWA] App cached for offline usage.');
      }
    });

    wb.addEventListener('activated', (event) => {
      console.log('[Dinerforged PWA] Service Worker activated.');
    });

    wb.register().catch((err) => {
      console.warn('[Dinerforged PWA] Service Worker registration failed:', err);
    });
  }
}