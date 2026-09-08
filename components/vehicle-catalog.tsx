'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid2X2, List, SlidersHorizontal, X } from 'lucide-react';
import {
  readTrip,
  displayDateTime,
  tripParams,
  tripNotice,
} from '@/lib/booking';
import {
  readFilters,
  filterVehicles,
  filterKeys,
  optionLabel,
  priceBounds,
  type Filters,
} from '@/lib/catalog';
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
  const params = useSearchParams();
  const q = new URLSearchParams(params.toString());
  const filters = readFilters(q);
  const view = q.get('view') === 'list' ? 'list' : 'grid';
  const trip = readTrip(q);
  const [searchDraft, setSearchDraft] = useState({
    query: filters.search,
    value: filters.search,
  });
  // Discard the previous typing draft when history changes the committed query.
  if (searchDraft.query !== filters.search)
    setSearchDraft({ query: filters.search, value: filters.search });
  const search =
    searchDraft.query === filters.search ? searchDraft.value : filters.search;
  const setSearch = (value: string) =>
    setSearchDraft({ query: filters.search, value });
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(q.toString());
  useEffect(() => {
    latest.current = params.toString();
    return () => clearTimeout(pending.current);
  }, [params]);
  useEffect(() => () => clearTimeout(pending.current), []);
  function navigate(next: URLSearchParams, replace = false) {
    // Vinext synchronizes useSearchParams with native history writes. Local
    // filtering keeps the focused control mounted; direct URLs still render on the server.
    latest.current = next.toString();
    window.history[replace ? 'replaceState' : 'pushState'](
      null,
      '',
      '/araclar?' + next.toString(),
    );
  }
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    clearTimeout(pending.current);
    const p = new URLSearchParams(latest.current);
    if (search.trim()) p.set('q', search.trim().replace(/\s+/g, ' '));
    else p.delete('q');
    if (key === 'location') {
      if (value) {
        p.set('pickup', String(value));
        if (trip.pickup === trip.dropoff) p.set('dropoff', String(value));
      } else {
        p.delete('pickup');
        p.delete('dropoff');
      }
    }
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
    clearTimeout(pending.current);
    setSearch('');
    const p = new URLSearchParams(latest.current);
    [
      ...Object.values(filterKeys).filter((k) => k !== 'lokasyon'),
      'min',
      'max',
      'musait',
      'q',
      'sort',
    ].forEach((k) => p.delete(k));
    navigate(p);
  };
  const setView = (value: string) => {
    clearTimeout(pending.current);
    const p = new URLSearchParams(latest.current);
    if (search.trim()) p.set('q', search.trim().replace(/\s+/g, ' '));
    else p.delete('q');
    p.set('view', value);
    navigate(p);
  };
  const filtered = filterVehicles(filters);
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
      {tripNotice(q, trip) && (
        <output className="journey-notice">{tripNotice(q, trip)}</output>
      )}
      <div className="trip-summary">
        <div>
          <span>SEYAHATİNİZ</span>
          <b>
            {filters.location
              ? `${trip.pickup} → ${trip.dropoff}`
              : 'Tüm teslimat noktaları'}
          </b>
          <p>
            {displayDateTime(trip.from)} — {displayDateTime(trip.to)}
          </p>
        </div>
        <Link href={'/?' + tripParams(trip) + '#booking'}>
          Tarihleri değiştir
        </Link>
        <small>
          Türkiye saati (UTC+03:00).{' '}
          {filters.location
            ? 'Araçlar teslim alma noktasına göre listelenir.'
            : 'Lokasyon filtresiyle teslim alma noktanızı seçin; detayda araca uygun noktalar gösterilir.'}{' '}
          Müsaitlik ve fiyatlar örnek veridir.
        </small>
      </div>
      <label className="catalog-search">
        MARKA / MODEL ARA
        <input
          type="search"
          placeholder="Örn. Porsche, i7, Range Rover"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            clearTimeout(pending.current);
            pending.current = setTimeout(() => {
              const next = new URLSearchParams(latest.current);
              const normalized = value.trim().replace(/\s+/g, ' ');
              if (normalized) next.set('q', normalized);
              else next.delete('q');
              navigate(next, true);
            }, 300);
          }}
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
            <DrawerTrigger
              id="catalog-filter-trigger"
              className="mobile-filter"
            >
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
                <FilterControls filters={filters} set={set} scope="mobile" />
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
          <VehicleCard
            key={v.slug}
            vehicle={v}
            trip={
              filters.location
                ? trip
                : { ...trip, pickup: v.locations[0], dropoff: v.locations[0] }
            }
            catalogQuery={q.toString()}
          />
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
