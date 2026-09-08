import { vehicles, type Vehicle } from '../data/vehicles';
import { locations, extras } from '../data/content';
export type Trip = {
  from: string;
  to: string;
  pickup: string;
  dropoff: string;
  extras?: string[];
};
export type Preferences = Trip & { vehicle: string; extras: string[] };
export const MIN_RENTAL_HOURS = 24;
export const TIME_ZONE = 'Europe/Istanbul';
export const DEMO_NOTICE =
  'Portföy demosudur. Örnek bilgilerle deneyin; bilgiler gönderilmez, ödeme alınmaz.';
export const PRICE_NOTICE =
  'Demo tutarları vergi dahil varsayılır; ayrıca vergi hesaplanmaz. Kiralama araç kullanımını ve belirtilen kilometre hakkını kapsar. Depozito toplamdan ayrıdır; tahsil edilmez.';
export const TARIFF_NOTICE =
  'İlk 6 gün günlük, 7–29 gün haftalık fiyatın 1/7’si, 30+ gün aylık fiyatın 1/30’u tüm süreye uygulanır. Paket eşiğinde daha uzun kiralama daha ucuz olabilir.';
export const locationNames = locations.map((l) => l.name);
const HOUR = 3600000;
// Every wall-clock input is a Turkish delivery time, never the host timezone.
export const localDateTime = (date: Date) =>
  new Date(date.getTime() + 3 * HOUR).toISOString().slice(0, 16);
export const instant = (value: string) => new Date(value + ':00+03:00');
export const validDateTime = (value: unknown): value is string => {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
  )
    return false;
  const date = instant(value);
  return Number.isFinite(date.getTime()) && localDateTime(date) === value;
};
export const minimumPickup = (now = new Date()) =>
  localDateTime(new Date(Math.floor(now.getTime() / HOUR) * HOUR + HOUR));
export const addRentalDays = (from: string, days: number) =>
  localDateTime(new Date(instant(from).getTime() + days * 24 * HOUR));
export const minimumReturn = (from: string) =>
  validDateTime(from) ? addRentalDays(from, 1) : minimumPickup();
export function defaultTrip(now = new Date()): Trip {
  const from =
    localDateTime(new Date(now.getTime() + 24 * HOUR)).slice(0, 10) + 'T10:00';
  return {
    from,
    to: minimumReturn(from),
    pickup: locationNames[0],
    dropoff: locationNames[0],
  };
}
export function readTrip(q: URLSearchParams, base: Trip = defaultTrip()): Trip {
  const pickup = q.get('pickup') ?? q.get('lokasyon');
  const validPickup = locationNames.includes(pickup || '')
    ? pickup!
    : base.pickup;
  const selected = q.get('extras');
  return {
    from: validDateTime(q.get('from')) ? q.get('from')! : base.from,
    to: validDateTime(q.get('to')) ? q.get('to')! : base.to,
    pickup: validPickup,
    dropoff: locationNames.includes(q.get('dropoff') || '')
      ? q.get('dropoff')!
      : pickup
        ? validPickup
        : base.dropoff,
    ...(selected !== null
      ? {
          extras: selected
            .split(',')
            .filter((id) => extras.some((x) => x.id === id)),
        }
      : base.extras
        ? { extras: base.extras }
        : {}),
  };
}
export function tripParams(trip: Trip, vehicle?: string) {
  const q = new URLSearchParams({
    from: trip.from,
    to: trip.to,
    pickup: trip.pickup,
    dropoff: trip.dropoff,
  });
  if (vehicle) q.set('vehicle', vehicle);
  if (trip.extras?.length) q.set('extras', trip.extras.join(','));
  return q.toString();
}
export function tripErrors(
  trip: Trip,
  now = new Date(),
  vehicle?: Vehicle,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!validDateTime(trip.from) || instant(trip.from) < now)
    errors.from = 'Gelecekte bir alma tarihi ve saati seçin.';
  if (
    !validDateTime(trip.to) ||
    !validDateTime(trip.from) ||
    instant(trip.to).getTime() - instant(trip.from).getTime() <
      MIN_RENTAL_HOURS * HOUR
  )
    errors.to = 'Kiralama süresi en az 24 saat olmalıdır.';
  for (const key of ['pickup', 'dropoff'] as const) {
    if (!locationNames.includes(trip[key]))
      errors[key] = 'Geçerli bir teslimat noktası seçin.';
    else if (vehicle && !vehicle.locations.includes(trip[key]))
      errors[key] =
        vehicle.model +
        ' bu noktada sunulmuyor. Uygun noktalar: ' +
        vehicle.locations.join(', ') +
        '.';
  }
  return errors;
}
export function tripNotice(q: URLSearchParams, trip: Trip) {
  const invalid =
    ['from', 'to'].some((k) => q.has(k) && !validDateTime(q.get(k))) ||
    ['pickup', 'dropoff', 'lokasyon'].some(
      (k) => q.has(k) && !locationNames.includes(q.get(k)!),
    );
  if (invalid)
    return 'Bağlantıda geçersiz seyahat bilgisi vardı. Geçerli varsayılanları gösteriyoruz; devam etmeden kontrol edin.';
  if (Object.keys(tripErrors(trip)).length)
    return 'Seyahat tarihleri geçersiz veya geçmişte. Devam etmeden tarihleri değiştirin.';
  if (
    q.has('pickup') &&
    q.has('lokasyon') &&
    q.get('pickup') !== q.get('lokasyon')
  )
    return 'Lokasyon filtresi teslim alma tercihinize göre eşitlendi.';
  return '';
}
export const isAirport = (pickup: string) =>
  ['İstanbul Havalimanı', 'Sabiha Gökçen'].includes(pickup);
export function serviceReason(id: string, trip: Trip) {
  if (id === 'airport' && !isAirport(trip.pickup))
    return 'Karşılama için İstanbul Havalimanı veya Sabiha Gökçen seçin.';
  if (id === 'delivery' && isAirport(trip.pickup))
    return 'Adrese teslim şehir noktalarında sunulur; havalimanında karşılama seçebilirsiniz.';
  return '';
}
export function quote(
  vehicle: Vehicle,
  from: string,
  to: string,
  selected: string[] = [],
) {
  const days =
    validDateTime(from) && validDateTime(to)
      ? Math.max(
          1,
          Math.ceil(
            (instant(to).getTime() - instant(from).getTime()) / 86400000,
          ),
        )
      : 1;
  const rate =
    days >= 30
      ? vehicle.monthlyPrice / 30
      : days >= 7
        ? vehicle.weeklyPrice / 7
        : vehicle.dailyPrice;
  const rental = Math.round(days * rate);
  const services = extras
    .filter((x) => selected.includes(x.id))
    .map((x) => ({ ...x, total: x.price * (x.unit === 'gün' ? days : 1) }));
  const extraTotal = services.reduce((sum, x) => sum + x.total, 0);
  return {
    days,
    rental,
    extraTotal,
    total: rental + extraTotal,
    services,
    tariff:
      days >= 30
        ? 'Aylık tarife'
        : days >= 7
          ? 'Haftalık tarife'
          : 'Günlük tarife',
  };
}
export const money = (amount: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
export const displayDateTime = (value: string) =>
  validDateTime(value)
    ? value.slice(8, 10) +
      '.' +
      value.slice(5, 7) +
      '.' +
      value.slice(0, 4) +
      ' · ' +
      value.slice(11) +
      ' (TR)'
    : 'Tarih seçilmedi';
export function restorePreferences(
  raw: string | null,
  q: URLSearchParams,
): Preferences {
  let base: Preferences = {
    ...defaultTrip(),
    vehicle: vehicles[0].slug,
    extras: [],
  };
  try {
    const saved = raw ? JSON.parse(raw) : null;
    if (
      saved?.version === 2 &&
      saved.preferences &&
      typeof saved.preferences === 'object'
    ) {
      const p = saved.preferences;
      const params = new URLSearchParams();
      for (const key of ['from', 'to', 'pickup', 'dropoff'])
        if (typeof p[key] === 'string') params.set(key, p[key]);
      const restored = readTrip(params);
      if (!Object.keys(tripErrors(restored)).length)
        base = {
          ...restored,
          vehicle: vehicles.some((v) => v.slug === p.vehicle)
            ? p.vehicle
            : base.vehicle,
          extras: Array.isArray(p.extras)
            ? ([
                ...new Set(
                  p.extras.filter(
                    (x: unknown): x is string =>
                      typeof x === 'string' && extras.some((e) => e.id === x),
                  ),
                ),
              ] as string[])
            : [],
        };
    }
  } catch {
    /* Invalid legacy drafts never block a new journey. */
  }
  // Any explicit trip/vehicle URL starts a new journey; omitted fields use defaults.
  if (
    ['vehicle', 'from', 'to', 'pickup', 'dropoff', 'lokasyon', 'extras'].some(
      (k) => q.has(k),
    )
  )
    base = { ...defaultTrip(), vehicle: vehicles[0].slug, extras: [] };
  const requested = vehicles.find((v) => v.slug === q.get('vehicle'));
  if (requested && !q.has('pickup') && !q.has('lokasyon'))
    base = {
      ...base,
      pickup: requested.locations[0],
      dropoff: requested.locations[0],
    };
  return {
    ...base,
    ...readTrip(q, base),
    vehicle: requested?.slug ?? base.vehicle,
  };
}
export function programHref(name: string) {
  if (name === 'Kurumsal') return '/kurumsal#demo-form';
  const trip = defaultTrip();
  trip.to = addRentalDays(
    trip.from,
    name === 'Aylık' ? 30 : name === 'Haftalık' ? 7 : 1,
  );
  return '/araclar?' + tripParams(trip);
}
