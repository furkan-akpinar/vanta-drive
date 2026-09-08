'use client';
// oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The wide comparison is keyboard-scrollable.

import { useState } from 'react';
import Link from 'next/link';
import { vehicles } from '@/data/vehicles';
import { useFavorites } from './favorites';
import { VehicleCard } from './vehicle-card';
export function FavoritesPage() {
  const { favorites } = useFavorites();
  const [compare, setCompare] = useState<string[]>([]);
  const activeCompare = compare.filter((slug) => favorites.includes(slug));
  const items = vehicles.filter((v) => favorites.includes(v.slug));
  function toggle(slug: string) {
    setCompare(
      activeCompare.includes(slug)
        ? activeCompare.filter((x) => x !== slug)
        : activeCompare.length < 3
          ? [...activeCompare, slug]
          : activeCompare,
    );
  }
  const comparing = vehicles.filter((v) => activeCompare.includes(v.slug));
  return (
    <>
      <div className="catalog-grid">
        {items.map((v) => (
          <div key={v.slug}>
            <VehicleCard vehicle={v} />
            <label className="compare-check">
              <input
                type="checkbox"
                checked={activeCompare.includes(v.slug)}
                disabled={
                  !activeCompare.includes(v.slug) && activeCompare.length >= 3
                }
                onChange={() => toggle(v.slug)}
              />{' '}
              Karşılaştırmaya ekle
            </label>
          </div>
        ))}
        {items.length === 0 && (
          <div className="empty-state">
            <h3>Garajınız şimdilik boş.</h3>
            <p>
              Beğendiğiniz araçları kalp simgesiyle buraya ekleyebilirsiniz.
            </p>
            <Link className="button primary" href="/araclar">
              Filoyu İncele
            </Link>
          </div>
        )}
      </div>
      {comparing.length > 1 && (
        <div className="compare-wrap">
          <h2>
            Teknik karşılaştırma <span>{comparing.length}/3</span>
          </h2>
          <section
            className="compare-table"
            tabIndex={0}
            aria-label="Araç karşılaştırma tablosu"
          >
            <table>
              <thead>
                <tr>
                  <th>Özellik</th>
                  {comparing.map((v) => (
                    <th key={v.slug}>
                      {v.brand}
                      <br />
                      {v.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Günlük fiyat',
                    (v: (typeof vehicles)[number]) =>
                      `₺${v.dailyPrice.toLocaleString('tr-TR')}`,
                  ],
                  ['Güç', (v: (typeof vehicles)[number]) => `${v.power} HP`],
                  [
                    '0–100',
                    (v: (typeof vehicles)[number]) => `${v.acceleration} sn`,
                  ],
                  ['Yakıt', (v: (typeof vehicles)[number]) => v.fuel],
                  ['Koltuk', (v: (typeof vehicles)[number]) => String(v.seats)],
                  [
                    'Bagaj',
                    (v: (typeof vehicles)[number]) => String(v.luggage),
                  ],
                  [
                    'KM limiti',
                    (v: (typeof vehicles)[number]) => `${v.kmLimit} km`,
                  ],
                ].map(([label, fn]) => (
                  <tr key={label as string}>
                    <td>{label as string}</td>
                    {comparing.map((v) => (
                      <td key={v.slug}>
                        {(fn as (v: (typeof vehicles)[number]) => string)(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </>
  );
}
