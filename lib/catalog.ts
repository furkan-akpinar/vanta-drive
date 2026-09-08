import { vehicles } from '../data/vehicles';
import { vehicleClasses } from '../data/classes';
import { readTrip } from './booking';

export type Filters = {
  className: string;
  brand: string;
  fuel: string;
  transmission: string;
  seats: string;
  price: [number, number];
  available: boolean;
  location: string;
  sort: string;
  search: string;
};
export const priceBounds: [number, number] = [
  Math.min(...vehicles.map((v) => v.dailyPrice)),
  Math.max(...vehicles.map((v) => v.dailyPrice)),
];
export const defaultFilters: Filters = {
  className: '',
  brand: '',
  fuel: '',
  transmission: '',
  seats: '',
  price: priceBounds,
  available: false,
  location: '',
  sort: 'price-asc',
  search: '',
};
export const choices = {
  className: vehicleClasses.map((c) => c.name) as string[],
  brand: [...new Set(vehicles.map((v) => v.brand))],
  fuel: [...new Set(vehicles.map((v) => v.fuel))],
  transmission: [
    ...new Set(vehicles.map((v) => v.transmissionType)),
  ] as string[],
  seats: [...new Set(vehicles.map((v) => String(v.seats)))].sort(),
  location: [...new Set(vehicles.flatMap((v) => v.locations))],
};
export function optionLabel(key: keyof typeof choices, value: string) {
  return key === 'seats' ? value + '+ koltuk' : value;
}

export const filterKeys = {
  className: 'sinif',
  brand: 'marka',
  fuel: 'yakit',
  transmission: 'vites',
  seats: 'koltuk',
  location: 'lokasyon',
} as const;

export function readFilters(q: URLSearchParams): Filters {
  const filters: Filters = { ...defaultFilters };
  for (const k of Object.keys(filterKeys) as (keyof typeof filterKeys)[]) {
    const value = q.get(filterKeys[k]) || '';
    if (choices[k].includes(value)) filters[k] = value;
  }
  const low = Number(q.get('min') || priceBounds[0]),
    high = Number(q.get('max') || priceBounds[1]);
  filters.price = [
    Number.isFinite(low)
      ? Math.max(priceBounds[0], Math.min(low, priceBounds[1]))
      : priceBounds[0],
    Number.isFinite(high)
      ? Math.min(priceBounds[1], Math.max(high, priceBounds[0]))
      : priceBounds[1],
  ];
  filters.price.sort((a, b) => a - b);
  filters.available = q.get('musait') === '1';
  filters.search = (q.get('q') || '').trim().replace(/\s+/g, ' ');
  filters.location =
    q.has('pickup') || q.has('lokasyon') ? readTrip(q).pickup : '';
  filters.sort = ['price-asc', 'price-desc', 'power'].includes(
    q.get('sort') || '',
  )
    ? q.get('sort')!
    : 'price-asc';
  return filters;
}

export function filterVehicles(filters: Filters) {
  return vehicles
    .filter(
      (v) =>
        (!filters.className || v.className === filters.className) &&
        (!filters.brand || v.brand === filters.brand) &&
        (!filters.fuel || v.fuel === filters.fuel) &&
        (!filters.transmission ||
          v.transmissionType === filters.transmission) &&
        (!filters.seats || v.seats >= +filters.seats) &&
        v.dailyPrice >= filters.price[0] &&
        v.dailyPrice <= filters.price[1] &&
        (!filters.available || v.available) &&
        (!filters.location || v.locations.includes(filters.location)) &&
        (!filters.search ||
          (v.brand + ' ' + v.model)
            .toLocaleLowerCase('tr-TR')
            .includes(filters.search.toLocaleLowerCase('tr-TR'))),
    )
    .sort((a, b) =>
      filters.sort === 'price-desc'
        ? b.dailyPrice - a.dailyPrice
        : filters.sort === 'power'
          ? b.power - a.power
          : a.dailyPrice - b.dailyPrice,
    );
}
