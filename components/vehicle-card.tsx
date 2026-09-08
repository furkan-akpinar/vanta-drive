'use client';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '@/data/vehicles';
import { VehicleVisual } from './vehicle-visual';
import { useFavorites } from './favorites';
import { useSearchParams } from 'next/navigation';
import { readTrip, tripParams, type Trip } from '@/lib/booking';
export function VehicleCard({
  vehicle,
  trip,
}: {
  vehicle: Vehicle;
  trip?: Trip;
}) {
  const params = useSearchParams();
  const carriedTrip =
    trip ||
    (params.has('from')
      ? readTrip(new URLSearchParams(params.toString()))
      : undefined);
  const { favorites, toggle } = useFavorites();
  const saved = favorites.includes(vehicle.slug);
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
          aria-label={saved ? 'Favorilerden çıkar' : 'Favorilere ekle'}
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
          href={`/araclar/${vehicle.slug}${carriedTrip ? '?' + tripParams(carriedTrip) : ''}`}
          aria-label={`${vehicle.model} detayını aç`}
        >
          <span>DETAY</span>
          <ArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
