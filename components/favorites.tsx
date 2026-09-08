'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { vehicles } from '@/data/vehicles';
let memory = '[]';
let message = '';
let comparisonMemory = '[]';
let favoritesMemoryOnly = false;
let comparisonMemoryOnly = false;
function snapshot() {
  if (typeof window === 'undefined') return '[]';
  if (favoritesMemoryOnly) return memory;
  try {
    return localStorage.getItem('vanta-favorites') || '[]';
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
  const normalized = JSON.stringify(favorites);
  useEffect(() => {
    if (raw === normalized) return;
    memory = normalized;
    try {
      localStorage.setItem('vanta-favorites', normalized);
    } catch {
      favoritesMemoryOnly = true;
    }
    window.dispatchEvent(new Event('vanta-favorites-change'));
  }, [raw, normalized]);
  function toggle(slug: string) {
    if (!vehicles.some((v) => v.slug === slug)) return;
    const next = favorites.includes(slug)
      ? favorites.filter((x) => x !== slug)
      : [...favorites, slug];
    memory = JSON.stringify(next);
    const vehicle = vehicles.find((v) => v.slug === slug)!;
    message = `${vehicle.brand} ${vehicle.model} ${next.includes(slug) ? 'favorilere kaydedildi.' : 'favorilerden kaldırıldı.'}`;
    try {
      localStorage.setItem('vanta-favorites', memory);
      favoritesMemoryOnly = false;
    } catch {
      favoritesMemoryOnly = true;
      message += ' Tarayıcı depolaması kullanılamıyor; bu oturumda korunur.';
    }
    const compared = readComparison().filter((x) => next.includes(x));
    saveComparison(compared);
    window.dispatchEvent(new Event('vanta-favorites-change'));
  }
  return { favorites, toggle, message };
}
function comparisonSnapshot() {
  if (comparisonMemoryOnly) return comparisonMemory;
  try {
    return localStorage.getItem('vanta-compare') || '[]';
  } catch {
    return comparisonMemory;
  }
}
function readComparison(raw = comparisonSnapshot()): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (x): x is string =>
                typeof x === 'string' && vehicles.some((v) => v.slug === x),
            ),
          ),
        ].slice(0, 3)
      : [];
  } catch {
    return [];
  }
}
function saveComparison(value: string[]) {
  comparisonMemory = JSON.stringify(value);
  try {
    localStorage.setItem('vanta-compare', comparisonMemory);
    comparisonMemoryOnly = false;
  } catch {
    comparisonMemoryOnly = true;
  }
  window.dispatchEvent(new Event('vanta-favorites-change'));
}
export function useComparison() {
  const raw = useSyncExternalStore(subscribe, comparisonSnapshot, () => '[]');
  const { favorites } = useFavorites();
  const compare = readComparison(raw).filter((slug) =>
    favorites.includes(slug),
  );
  const normalized = JSON.stringify(compare);
  useEffect(() => {
    if (raw !== normalized) saveComparison(JSON.parse(normalized) as string[]);
  }, [raw, normalized]);
  return { compare, setCompare: saveComparison };
}
