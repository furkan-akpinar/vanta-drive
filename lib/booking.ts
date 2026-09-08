import { format, addDays, addHours, parseISO, isValid } from 'date-fns';
import { vehicles, type Vehicle } from '../data/vehicles';
import { locations, extras } from '../data/content';
export type Trip = {
  from: string;
  to: string;
  pickup: string;
  dropoff: string;
};
export type Preferences = Trip & { vehicle: string; extras: string[] };
export const MIN_RENTAL_HOURS = 24;
export const DEMO_NOTICE =
  'Portföy demosudur. Bilgiler gönderilmez; ödeme alınmaz.';
export const locationNames = locations.map((l) => l.name);
export const localDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");
export const validDateTime = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
  isValid(parseISO(value));
export const minimumPickup = (now = new Date()) =>
  localDateTime(
    addHours(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
      ),
      1,
    ),
  );
export const minimumReturn = (from: string) =>
  validDateTime(from)
    ? localDateTime(addHours(parseISO(from), MIN_RENTAL_HOURS))
    : minimumPickup();
export function defaultTrip(now = new Date()): Trip {
  const start = addDays(now, 1);
  start.setHours(10, 0, 0, 0);
  return {
    from: localDateTime(start),
    to: localDateTime(addDays(start, 1)),
    pickup: locationNames[0],
    dropoff: locationNames[0],
  };
}
export function readTrip(q: URLSearchParams, base: Trip = defaultTrip()): Trip {
  return {
    from: validDateTime(q.get('from')) ? q.get('from')! : base.from,
    to: validDateTime(q.get('to')) ? q.get('to')! : base.to,
    pickup: locationNames.includes(q.get('pickup') || '')
      ? q.get('pickup')!
      : base.pickup,
    dropoff: locationNames.includes(q.get('dropoff') || '')
      ? q.get('dropoff')!
      : base.dropoff,
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
  return q.toString();
}
export function tripErrors(
  trip: Trip,
  now = new Date(),
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!validDateTime(trip.from) || parseISO(trip.from) < now)
    errors.from = 'Gelecekte bir alma tarihi ve saati seçin.';
  if (
    !validDateTime(trip.to) ||
    !validDateTime(trip.from) ||
    parseISO(trip.to).getTime() - parseISO(trip.from).getTime() <
      MIN_RENTAL_HOURS * 3600000
  )
    errors.to = 'Kiralama süresi en az 24 saat olmalıdır.';
  if (!locationNames.includes(trip.pickup))
    errors.pickup = 'Teslim alma noktasını seçin.';
  if (!locationNames.includes(trip.dropoff))
    errors.dropoff = 'Bırakma noktasını seçin.';
  return errors;
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
            (parseISO(to).getTime() - parseISO(from).getTime()) / 86400000,
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
    ? format(parseISO(value), 'dd.MM.yyyy · HH:mm')
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
      typeof saved.preferences === 'object' &&
      saved.preferences
    ) {
      const p = saved.preferences;
      const params = new URLSearchParams();
      for (const key of ['from', 'to', 'pickup', 'dropoff'])
        if (typeof p[key] === 'string') params.set(key, p[key]);
      base = {
        ...readTrip(params),
        vehicle: vehicles.some((v) => v.slug === p.vehicle)
          ? p.vehicle
          : base.vehicle,
        extras: Array.isArray(p.extras)
          ? p.extras.filter(
              (x: unknown) =>
                typeof x === 'string' && extras.some((e) => e.id === x),
            )
          : [],
      };
    }
  } catch {
    /* Ignore invalid legacy drafts. */
  }
  if (['vehicle', 'from', 'to', 'pickup', 'dropoff'].some((k) => q.has(k)))
    base = { ...defaultTrip(), vehicle: vehicles[0].slug, extras: [] };
  const requested = q.get('vehicle');
  return {
    ...base,
    ...readTrip(q, base),
    vehicle: vehicles.some((v) => v.slug === requested)
      ? requested!
      : base.vehicle,
  };
}
