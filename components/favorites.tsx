'use client';
import { useSyncExternalStore } from 'react';
import { vehicles } from '@/data/vehicles';
let memory = '[]';
function snapshot() {
  if (typeof window === 'undefined') return '[]';
  try {
    return localStorage.getItem('vanta-favorites') || memory;
  } catch {
    return memory;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener('vanta-favorites-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('vanta-favorites-change', callback);
    window.removeEventListener('storage', callback);
  };
}
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  let favorites: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed))
      favorites = [
        ...new Set(
          parsed.filter(
            (x): x is string =>
              typeof x === 'string' && vehicles.some((v) => v.slug === x),
          ),
        ),
      ];
  } catch {}
  function toggle(slug: string) {
    if (!vehicles.some((v) => v.slug === slug)) return;
    const next = favorites.includes(slug)
      ? favorites.filter((x) => x !== slug)
      : [...favorites, slug];
    memory = JSON.stringify(next);
    try {
      localStorage.setItem('vanta-favorites', memory);
    } catch {}
    window.dispatchEvent(new Event('vanta-favorites-change'));
  }
  return { favorites, toggle };
}
