'use client';
// oxlint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- Keyboard arrows intentionally scroll this named carousel region.

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { VehicleCard } from './vehicle-card';

export function FleetCarousel() {
  const reduced = useReducedMotion();
  const [snapCount, setSnapCount] = useState(vehicles.length);
  const [viewportRef, api] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
    duration: reduced ? 0 : 25,
  });
  const viewportNode = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const sync = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setSnapCount(api.scrollSnapList().length);
    setProgress(
      ((api.selectedScrollSnap() + 1) / api.scrollSnapList().length) * 100,
    );
  }, [api]);
  useEffect(() => {
    if (!api) return;
    queueMicrotask(sync);
    api.on('select', sync).on('reInit', sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api, sync]);
  const attachViewport = useCallback(
    (node: HTMLElement | null) => {
      viewportNode.current = node;
      viewportRef(node);
    },
    [viewportRef],
  );
  useEffect(() => {
    const node = viewportNode.current;
    if (!node || !api) return;
    let last = 0;
    let delta = 0;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) + 3) return;
      const next = e.deltaX > 0;
      if (next ? !api.canScrollNext() : !api.canScrollPrev()) return;
      e.preventDefault();
      const now = performance.now();
      if (now - last < 350) return;
      delta += e.deltaX;
      if (Math.abs(delta) > 45) {
        if (next) api.scrollNext();
        else api.scrollPrev();
        last = now;
        delta = 0;
      }
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  }, [api]);
  function keys(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      api?.scrollNext();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      api?.scrollPrev();
    }
  }
  return (
    <div className="fleet-carousel" id="fleet">
      <div className="carousel-controls">
        <div className="carousel-index">
          <b>{String(selected + 1).padStart(2, '0')}</b>
          <span>/ {String(snapCount).padStart(2, '0')}</span>
        </div>
        <div className="carousel-progress" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="carousel-arrows">
          <button
            onClick={() => api?.scrollPrev()}
            onKeyDown={keys}
            disabled={!canPrev}
            aria-label="Önceki araç"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            onKeyDown={keys}
            disabled={!canNext}
            aria-label="Sonraki araç"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <section
        className="carousel-viewport"
        ref={attachViewport}
        aria-label="Seçkin araç vitrini"
        tabIndex={0}
        onKeyDown={keys}
      >
        <div className="carousel-track">
          {vehicles.map((v) => (
            <div className="carousel-slide" key={v.slug}>
              <VehicleCard vehicle={v} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
