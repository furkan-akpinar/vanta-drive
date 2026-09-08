'use client';
import { useState } from 'react';
import { vehicleImageSettings, type Vehicle } from '@/data/vehicles';
export function VehicleVisual({
  vehicle,
  priority = false,
  className = '',
}: {
  vehicle: Vehicle;
  priority?: boolean;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState('');
  const src = vehicle.images[0];
  const framing = vehicleImageSettings[vehicle.slug] ?? {
    fit: 'contain' as const,
    position: 'center',
  };
  return (
    <div className={'vehicle-visual ' + className}>
      {src && src !== failedSrc ? (
        // oxlint-disable-next-line next/no-img-element
        <img
          src={src}
          srcSet={
            vehicle.imageSmall
              ? vehicle.imageSmall + ' 800w, ' + src + ' 1600w'
              : undefined
          }
          sizes={
            priority
              ? '(max-width: 768px) 100vw, 90vw'
              : '(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 30vw'
          }
          alt={vehicle.brand + ' ' + vehicle.model + ' — konsept araç görseli'}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          width={1600}
          height={1000}
          onError={() => setFailedSrc(src)}
          style={{ objectFit: framing.fit, objectPosition: framing.position }}
        />
      ) : (
        <p className="image-fallback">
          Görsel yüklenemedi.
          <br />
          <span>
            {vehicle.brand} {vehicle.model}
          </span>
        </p>
      )}
      <div className="vehicle-mark">
        <span>{vehicle.className}</span>
        <span>VANTA DRIVE</span>
      </div>
    </div>
  );
}
