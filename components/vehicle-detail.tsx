'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Fuel, Gauge, Heart, Users } from 'lucide-react';
import type { Vehicle } from '@/data/vehicles';
import { VehicleVisual } from './vehicle-visual';
import { useFavorites } from './favorites';
import { DateTimeField, LocationField } from './trip-fields';
import {
  DEMO_NOTICE,
  readTrip,
  tripParams,
  tripErrors,
  minimumPickup,
  minimumReturn,
  quote,
  money,
  type Trip,
} from '@/lib/booking';
export function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const { favorites, toggle } = useFavorites();
  const router = useRouter();
  const q = useSearchParams();
  const [trip, setTrip] = useState(() =>
    readTrip(new URLSearchParams(q.toString())),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const price = quote(vehicle, trip.from, trip.to);
  const saved = favorites.includes(vehicle.slug);
  function change(key: keyof Trip, value: string) {
    setTrip((t) => ({
      ...t,
      [key]: value,
      ...(key === 'from' && t.to < minimumReturn(value)
        ? { to: minimumReturn(value) }
        : {}),
    }));
    setErrors({});
  }
  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const invalid = tripErrors(trip);
    setErrors(invalid);
    if (!Object.keys(invalid).length)
      router.push('/rezervasyon?' + tripParams(trip, vehicle.slug));
  }
  return (
    <>
      <section className="detail-gallery">
        <VehicleVisual vehicle={vehicle} priority className="detail-main" />
      </section>
      <header className="detail-heading">
        <span className="eyebrow dark">{vehicle.className}</span>
        <h1>
          {vehicle.brand} <span>{vehicle.model}</span>
        </h1>
        <p>
          {vehicle.fuel} · {vehicle.transmission} · {vehicle.seats} koltuk
        </p>
      </header>
      <div className="detail-layout">
        <form className="sticky-booking" onSubmit={submit}>
          <div className="price-readout">
            <span>GÜNLÜK TARİFE</span>
            <b>{money(vehicle.dailyPrice)}</b>
          </div>
          <DateTimeField
            id="detail-from"
            label="ALMA TARİHİ / SAAT"
            value={trip.from}
            min={minimumPickup()}
            onChange={(v) => change('from', v)}
            error={errors.from}
          />
          <DateTimeField
            id="detail-to"
            label="BIRAKMA TARİHİ / SAAT"
            value={trip.to}
            min={minimumReturn(trip.from)}
            onChange={(v) => change('to', v)}
            error={errors.to}
          />
          <LocationField
            id="detail-pickup"
            label="TESLİM ALMA"
            value={trip.pickup}
            onChange={(v) => change('pickup', v)}
          />
          <LocationField
            id="detail-dropoff"
            label="BIRAKMA"
            value={trip.dropoff}
            onChange={(v) => change('dropoff', v)}
          />
          <div className="total-line">
            <span>
              {price.days} GÜN · {price.tariff}
            </span>
            <b>{money(price.total)}</b>
          </div>
          <button className="button primary full" type="submit">
            Rezervasyona Devam Et
          </button>
          <button
            type="button"
            className="save-line"
            aria-pressed={saved}
            onClick={() => toggle(vehicle.slug)}
          >
            <Heart fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Favorilerde' : 'Favoriye ekle'}
          </button>
          <small className="demo-note">{DEMO_NOTICE}</small>
        </form>
        <div className="detail-content">
          <span className="eyebrow dark">TEKNİK DOSYA</span>
          <div className="big-specs">
            <div>
              <Gauge />
              <b>{vehicle.power} HP</b>
              <span>Motor gücü</span>
            </div>
            <div>
              <b>{vehicle.acceleration} SN</b>
              <span>0–100 km/s</span>
            </div>
            <div>
              <Fuel />
              <b>{vehicle.fuel}</b>
              <span>Enerji</span>
            </div>
            <div>
              <Users />
              <b>{vehicle.seats}</b>
              <span>Koltuk</span>
            </div>
            <div>
              <Briefcase />
              <b>{vehicle.luggage}</b>
              <span>Bagaj</span>
            </div>
          </div>
          <section>
            <h2>Donanım</h2>
            <ul className="equipment">
              {vehicle.features.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="terms-grid">
            <div>
              <span>GÜNLÜK KM</span>
              <b>{vehicle.kmLimit} KM</b>
            </div>
            <div>
              <span>DEPOZİTO</span>
              <b>{money(vehicle.deposit)}</b>
            </div>
            <div>
              <span>MİN. YAŞ</span>
              <b>{vehicle.minAge}</b>
            </div>
            <div>
              <span>EHLİYET</span>
              <b>{vehicle.licenseYears} YIL</b>
            </div>
          </section>
          <section>
            <h2>Teslimat ve tarife</h2>
            <p className="body-copy">
              Örnek filo durumu:{' '}
              {vehicle.available ? 'müsait' : 'talep üzerine'}. Tanımlı
              lokasyonlar: {vehicle.locations.join(', ')}. Bu demo gerçek
              envanter sorgulamaz.
            </p>
            <p className="body-copy">
              Haftalık {money(vehicle.weeklyPrice)} · Aylık{' '}
              {money(vehicle.monthlyPrice)}. 7 ve 30 günden itibaren ilgili araç
              tarifesinin günlük karşılığı uygulanır. Görseller konsept
              sunumdur; donanım örnek veridir.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
