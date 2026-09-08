'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { BookingConsole } from './booking-console';
import { useHydrated } from '@/hooks/use-hydrated';
const mobileQuery = '(max-width: 767px)';
const subscribeMobile = (notify: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
export function HeroVideo() {
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );
  const hydrated = useHydrated();
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const poster = '/assets/video/vanta-hero-poster.webp';
  useEffect(() => {
    if (!hydrated || reducedMotion || failed) return;
    const el = video.current;
    if (el) {
      el.muted = true;
      el.play().catch((error: DOMException) => {
        if (error.name !== 'AbortError') setFailed(true);
      });
    }
  }, [hydrated, reducedMotion, failed, mobile]);
  return (
    <section
      className="video-hero"
      style={{
        backgroundImage: 'url(' + poster + '), url(/images/hero-vanta.webp)',
      }}
    >
      {hydrated && !failed && !reducedMotion && (
        <video
          src={
            mobile
              ? '/assets/video/vanta-hero-mobile.mp4'
              : '/assets/video/vanta-hero.mp4'
          }
          ref={video}
          className="hero-video-media"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          disablePictureInPicture
          onError={() => setFailed(true)}
        />
      )}
      <div className="hero-video-overlay" />
      <div className="hero-video-content">
        <h1>
          <span>Yolu değil,</span>
          <em>standardı</em>
          <span>değiştirin.</span>
        </h1>
        <p className="lead">
          İstanbul’dan Türkiye’nin her noktasına premium sürüş deneyimi.
        </p>
        <div className="action-row">
          <a
            href="#booking"
            className="button primary"
            onClick={() =>
              document.getElementById('pickup')?.focus({ preventScroll: true })
            }
          >
            Araç Bul <ArrowRight size={18} />
          </a>
          <Link href="/araclar" className="button ghost">
            Filoyu İncele
          </Link>
        </div>
      </div>
      <a
        href="#fleet"
        className="scroll-cue"
        aria-label="Araç vitrinine kaydır"
      >
        <span>KEŞFET</span>
        <ArrowDown />
      </a>
      <BookingConsole />
    </section>
  );
}
