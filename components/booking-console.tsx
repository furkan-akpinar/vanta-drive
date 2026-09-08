'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowUpRight } from 'lucide-react';
import { DateTimeField, LocationField } from './trip-fields';
import { focusInvalid } from '@/lib/validation';
import {
  readTrip,
  minimumPickup,
  minimumReturn,
  tripErrors,
  tripParams,
  type Trip,
} from '@/lib/booking';

export function BookingConsole() {
  const router = useRouter();
  const params = useSearchParams();
  const [trip, setTrip] = useState(() =>
    readTrip(new URLSearchParams(params.toString())),
  );
  const [same, setSame] = useState(trip.pickup === trip.dropoff);
  const [errors, setErrors] = useState<Record<string, string>>({});
  function change(key: keyof Trip, value: string) {
    setTrip((t) => ({
      ...t,
      [key]: value,
      ...(key === 'pickup' && same ? { dropoff: value } : {}),
      ...(key === 'from' && t.to < minimumReturn(value)
        ? { to: minimumReturn(value) }
        : {}),
    }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }
  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = tripErrors(trip);
    setErrors(next);
    if (!Object.keys(next).length) router.push('/araclar?' + tripParams(trip));
    else focusInvalid(e.currentTarget);
  }
  return (
    <form
      id="booking"
      className="booking-console cockpit"
      onSubmit={submit}
      aria-label="Araç arama formu"
    >
      <LocationField
        id="pickup"
        label="TESLİM ALMA"
        value={trip.pickup}
        onChange={(v) => change('pickup', v)}
        error={errors.pickup}
      />
      <LocationField
        id="dropoff"
        label="BIRAKMA"
        value={trip.dropoff}
        onChange={(v) => {
          setSame(false);
          change('dropoff', v);
        }}
        error={errors.dropoff}
      />
      <DateTimeField
        id="from"
        label="ALMA TARİHİ / SAAT"
        value={trip.from}
        min={minimumPickup()}
        onChange={(v) => change('from', v)}
        error={errors.from}
      />
      <DateTimeField
        id="to"
        label="BIRAKMA TARİHİ / SAAT"
        value={trip.to}
        min={minimumReturn(trip.from)}
        onChange={(v) => change('to', v)}
        error={errors.to}
      />
      <button className="console-submit" type="submit">
        <Search />
        <span>Araç Ara</span>
        <ArrowUpRight />
      </button>
      <label className="same-location">
        <input
          type="checkbox"
          checked={same}
          onChange={(e) => {
            setSame(e.target.checked);
            if (e.target.checked) change('dropoff', trip.pickup);
          }}
        />{' '}
        Aynı noktaya bırakacağım{' '}
        <span>Minimum 24 saat · Türkiye saati (UTC+03:00)</span>
      </label>
    </form>
  );
}
