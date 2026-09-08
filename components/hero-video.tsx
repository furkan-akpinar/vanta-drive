'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { preload } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
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
  const params = useSearchParams();
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );
  const hydrated = useHydrated();
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const poster = '/assets/video/vanta-hero-poster.webp';
  preload(poster, { as: 'image', fetchPriority: 'high' });
  useEffect(() => {
    if (!hydrated || reducedMotion || failed || paused) return;
    const el = video.current;
    if (el) {
      el.muted = true;
      el.play().catch((error: DOMException) => {
        if (error.name !== 'AbortError') setFailed(true);
      });
    }
  }, [hydrated, reducedMotion, failed, mobile, paused]);
  return (
    <section
      className="video-hero"
      style={{
        backgroundImage: 'url(' + poster + ')',
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
          autoPlay={!paused}
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
        <p className="hero-demo">PREMIUM ARAÇ KİRALAMA · PORTFÖY DEMOSU</p>
        <h1>
          <span>Yolu değil,</span>
          <em>standardı</em>
          <span>değiştirin.</span>
        </h1>
        <p className="lead">
          Seçili şehirlerde premium araçları keşfedin, seyahatinizi planlayın.
          Gerçek rezervasyon oluşturulmaz.
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
      {hydrated && !failed && !reducedMotion && (
        <button
          type="button"
          className="video-control"
          aria-label={
            paused
              ? 'Arka plan videosunu oynat'
              : 'Arka plan videosunu duraklat'
          }
          onClick={() => {
            if (paused) {
              setPaused(false);
            } else {
              video.current?.pause();
              setPaused(true);
            }
          }}
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
          <span>{paused ? 'Oynat' : 'Duraklat'}</span>
        </button>
      )}
      <a
        href="#fleet"
        className="scroll-cue"
        aria-label="Keşfet · Araç vitrinine kaydır"
      >
        <span>KEŞFET</span>
        <ArrowDown />
      </a>
      <BookingConsole key={params.toString()} />
    </section>
  );
}
