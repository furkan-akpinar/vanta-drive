'use client';
import { useState } from 'react';
export function MediaImage({
  src,
  alt,
  className = '',
  fit = 'cover',
  position = 'center',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
  position?: string;
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState('');
  const isCategory = src.endsWith('-category.webp');
  return (
    <div className={'media-image ' + className}>
      {failedSrc !== src ? (
        // oxlint-disable-next-line next/no-img-element
        <img
          src={src}
          srcSet={
            isCategory
              ? src.replace('.webp', '-800.webp') + ' 800w, ' + src + ' 1600w'
              : undefined
          }
          sizes={isCategory ? '(max-width:760px) 100vw, 70vw' : undefined}
          alt={alt}
          width={1600}
          height={1000}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailedSrc(src)}
          style={{ objectFit: fit, objectPosition: position }}
        />
      ) : (
        <p className="image-fallback">{alt || 'Görsel yüklenemedi.'}</p>
      )}
    </div>
  );
}
