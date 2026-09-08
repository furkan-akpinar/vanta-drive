'use client';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '@/data/vehicles';
import { VehicleVisual } from './vehicle-visual';
import { useFavorites } from './favorites';
import { useSearchParams } from 'next/navigation';
import { readTrip, tripParams, quote, money, type Trip } from '@/lib/booking';
export function VehicleCard({
  vehicle,
  trip,
  catalogQuery,
}: {
  vehicle: Vehicle;
  trip?: Trip;
  catalogQuery?: string;
}) {
  const params = useSearchParams();
  const carriedTrip =
    trip ||
    (['from', 'pickup', 'lokasyon'].some((k) => params.has(k))
      ? readTrip(new URLSearchParams(params.toString()))
      : undefined);
  const { favorites, toggle } = useFavorites();
  const saved = favorites.includes(vehicle.slug);
  const price = carriedTrip
    ? quote(vehicle, carriedTrip.from, carriedTrip.to)
    : null;
  const query = new URLSearchParams(carriedTrip ? tripParams(carriedTrip) : '');
  if (catalogQuery !== undefined) query.set('catalog', catalogQuery);
  return (
    <article className="vehicle-card">
      <VehicleVisual vehicle={vehicle} />
      <div className="vehicle-card-head">
        <div>
          <span className="tiny">{vehicle.brand}</span>
          <h3>{vehicle.model}</h3>
        </div>
        <button
          type="button"
          className={`favorite ${saved ? 'saved' : ''}`}
          onClick={() => toggle(vehicle.slug)}
          aria-label={`${vehicle.brand} ${vehicle.model}: ${saved ? 'Favorilerden çıkar' : 'Favorilere ekle'}`}
          aria-pressed={saved}
        >
          <Heart fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="vehicle-card-meta">
        <span>{vehicle.fuel}</span>
        <span>{vehicle.transmission}</span>
      </div>
      <div className="spec-line">
        <span>
          <b>{vehicle.power}</b> HP
        </span>
        <span>
          <b>{vehicle.acceleration}</b> SN
        </span>
        <span>
          <b>{vehicle.seats}</b> KOLTUK
        </span>
      </div>
      <div className="vehicle-card-foot">
        <p>
          <span>GÜNLÜK</span>₺{vehicle.dailyPrice.toLocaleString('tr-TR')}
        </p>
        <Link
          className="detail-link"
          href={`/araclar/${vehicle.slug}${query.size ? '?' + query.toString() : ''}`}
          aria-label={`${vehicle.model} detayını aç`}
        >
          <span>DETAY</span>
          <ArrowUpRight />
        </Link>
      </div>
      <p className="card-trip-price">
        {price
          ? `${price.days} gün · ${price.tariff} · ${money(price.rental)} kiralama`
          : 'Tarih seçerek toplamı görün.'}
        <span>
          Ek hizmetler hariç ·{' '}
          {vehicle.available ? 'Demo: müsait' : 'Demo: talep üzerine'}
        </span>
      </p>
    </article>
  );
}
