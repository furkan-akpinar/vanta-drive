'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Grid2X2, List, SlidersHorizontal, X } from 'lucide-react';
import { readTrip, displayDateTime, tripParams } from '@/lib/booking';
import {
  readFilters,
  filterVehicles,
  filterKeys,
  optionLabel,
  priceBounds,
  type Filters,
} from '@/lib/catalog';
import { useHydrated } from '@/hooks/use-hydrated';
import { VehicleCard } from './vehicle-card';
import { FilterControls, SortControl } from './catalog-controls';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

export function VehicleCatalog() {
  const hydrated = useHydrated();
  const router = useRouter();
  const params = useSearchParams();
  const q = new URLSearchParams(params.toString());
  const filters = readFilters(q);
  const view = q.get('view') === 'list' ? 'list' : 'grid';
  const trip = readTrip(q);
  function navigate(next: URLSearchParams, replace = false) {
    router[replace ? 'replace' : 'push']('/araclar?' + next.toString(), {
      scroll: false,
    });
  }
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const p = new URLSearchParams(params.toString());
    if (key === 'price') {
      const range = value as [number, number];
      p.set('min', String(range[0]));
      p.set('max', String(range[1]));
    } else {
      const name =
        key === 'available'
          ? 'musait'
          : key === 'search'
            ? 'q'
            : key === 'sort'
              ? 'sort'
              : filterKeys[key as keyof typeof filterKeys];
      if (value) p.set(name, key === 'available' ? '1' : String(value));
      else p.delete(name);
    }
    navigate(p, key === 'price' || key === 'search');
  };
  const clear = () => {
    const p = new URLSearchParams(params.toString());
    [...Object.values(filterKeys), 'min', 'max', 'musait', 'q', 'sort'].forEach(
      (k) => p.delete(k),
    );
    navigate(p);
  };
  const setView = (value: string) => {
    const p = new URLSearchParams(params.toString());
    p.set('view', value);
    navigate(p);
  };
  const filtered = filterVehicles(filters);
  if (!hydrated)
    return (
      <div className="empty-state">
        <p>Filo hazırlanıyor.</p>
      </div>
    );
  const active = [
    ...(filters.search
      ? [{ key: 'search' as const, label: filters.search }]
      : []),
    ...(
      [
        'className',
        'brand',
        'fuel',
        'transmission',
        'seats',
        'location',
      ] as const
    )
      .filter((k) => filters[k])
      .map((k) => ({ key: k, label: optionLabel(k, filters[k]) })),
    ...(filters.available
      ? [{ key: 'available' as const, label: 'Yalnızca müsait' }]
      : []),
    ...(filters.price[0] !== priceBounds[0] ||
    filters.price[1] !== priceBounds[1]
      ? [
          {
            key: 'price' as const,
            label: `₺${filters.price[0].toLocaleString('tr-TR')}–₺${filters.price[1].toLocaleString('tr-TR')}`,
          },
        ]
      : []),
  ];
  const clearKey = (key: keyof Filters) => {
    if (key === 'price') set('price', priceBounds);
    else if (key === 'available') set('available', false);
    else if (key !== 'sort') set(key, '');
  };
  return (
    <>
      <div className="trip-summary">
        <div>
          <span>SEYAHATİNİZ</span>
          <b>
            {trip.pickup} → {trip.dropoff}
          </b>
          <p>
            {displayDateTime(trip.from)} — {displayDateTime(trip.to)}
          </p>
        </div>
        <Link href={'/?' + tripParams(trip) + '#booking'}>
          Tarihleri değiştir
        </Link>
        <small>Müsaitlik ve fiyatlar portföy demosu verileridir.</small>
      </div>
      <label className="catalog-search">
        MARKA / MODEL ARA
        <input
          type="search"
          placeholder="Örn. Porsche, i7, Range Rover"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </label>
      <div className="catalog-toolbar">
        <div className="result-count">
          <b>{filtered.length}</b>
          <span>
            ARAÇ
            <br />
            BULUNDU
          </span>
        </div>
        <div className="mobile-tools">
          <Drawer showSwipeHandle>
            <DrawerTrigger className="mobile-filter">
              <SlidersHorizontal /> Filtrele{' '}
              {active.length > 0 && <b>{active.length}</b>}
            </DrawerTrigger>
            <DrawerContent className="filter-drawer">
              <DrawerHeader>
                <div>
                  <DrawerTitle>Filtreler</DrawerTitle>
                  <span>{filtered.length} araç eşleşiyor</span>
                </div>
                <DrawerClose className="drawer-x" aria-label="Filtreleri kapat">
                  <X />
                </DrawerClose>
              </DrawerHeader>
              <div className="drawer-scroll">
                <FilterControls filters={filters} set={set} />
              </div>
              <DrawerFooter>
                <button className="clear-button" onClick={() => clear()}>
                  Tümünü temizle
                </button>
                <DrawerClose className="button primary">
                  {' '}
                  {filtered.length} Aracı Göster
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <SortControl filters={filters} set={set} mobile />
        </div>
        <div className="catalog-actions">
          <SortControl filters={filters} set={set} />
          <div className="view-toggle" aria-label="Görünüm seçimi">
            <button
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
              aria-label="Grid görünümü"
              aria-pressed={view === 'grid'}
            >
              <Grid2X2 />
            </button>
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              aria-label="Liste görünümü"
              aria-pressed={view === 'list'}
            >
              <List />
            </button>
          </div>
        </div>
      </div>
      <aside className="desktop-filters">
        <div className="filter-title">
          <div>
            <span>FİLTRELER</span>
            <b>{filtered.length} SONUÇ</b>
          </div>
          <button onClick={() => clear()}>Tümünü temizle</button>
        </div>
        <FilterControls filters={filters} set={set} />
      </aside>
      <div className="active-filters">
        {active.map((item) => (
          <button key={item.key} onClick={() => clearKey(item.key)}>
            {item.label}
            <X />
          </button>
        ))}
        {active.length > 1 && (
          <button className="clear-all" onClick={() => clear()}>
            Tümünü temizle
          </button>
        )}
      </div>
      <div className={`catalog-grid ${view === 'list' ? 'list-view' : ''}`}>
        {filtered.map((v) => (
          <VehicleCard key={v.slug} vehicle={v} trip={trip} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>Eşleşen araç bulunamadı.</h3>
            <p>Filtrelerden birini kaldırarak filoyu genişletebilirsiniz.</p>
            <button className="button primary" onClick={() => clear()}>
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}
