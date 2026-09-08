'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Building2,
  CarFront,
  Home,
  Heart,
  Menu,
  PackageOpen,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import { useFavorites } from './favorites';
const nav = [
  ['/', 'Ana Sayfa', Home],
  ['/araclar', 'Araçlar', CarFront],
  ['/paketler', 'Paketler', PackageOpen],
  ['/kurumsal', 'Kurumsal', Building2],
  ['/favoriler', 'Favoriler', Heart],
] as const;
const panelNav = [
  ...nav.map(([href, label]) => [href, label]),
  ['/lokasyonlar', 'Lokasyonlar'],
  ['/iletisim', 'İletişim'],
  ['/hakkimizda', 'Hakkımızda'],
];
export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { favorites, message } = useFavorites();
  const active = (href: string) =>
    href === '/' ? path === '/' : path.startsWith(href);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <a className="skip-link" href="#main-content">
        İçeriğe geç
      </a>
      <aside className="rail">
        <Link
          className="monogram"
          href="/"
          aria-label="VD · Vanta Drive ana sayfa"
        >
          VD
        </Link>
        <nav className="rail-nav" aria-label="Ana navigasyon">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={'rail-link ' + (active(href) ? 'active' : '')}
              aria-current={active(href) ? 'page' : undefined}
              title={label}
            >
              <Icon size={21} />
              <span>{label}</span>
              {href === '/favoriler' && favorites.length > 0 && (
                <b
                  className="favorite-count"
                  aria-label={favorites.length + ' favori'}
                >
                  {favorites.length}
                </b>
              )}
            </Link>
          ))}
        </nav>
        <div className="rail-bottom">
          <span lang="tr">TR</span>
          <DialogTrigger
            id="desktop-menu-trigger"
            className="icon-button"
            aria-label="Tam ekran menüyü aç"
          >
            <Menu />
          </DialogTrigger>
        </div>
      </aside>
      <header className="mobile-bar">
        <Link
          className="monogram"
          href="/"
          aria-label="VD · Vanta Drive ana sayfa"
        >
          VD
        </Link>
        <div className="mobile-actions">
          <Link
            className="mobile-favorites"
            href="/favoriler"
            aria-label={favorites.length + ' favori araç'}
          >
            <Heart size={19} />
            <span aria-live="polite">{favorites.length}</span>
          </Link>
          <Link className="mobile-reserve" href="/rezervasyon">
            Rezervasyon
          </Link>
          <DialogTrigger
            id="mobile-menu-trigger"
            className="icon-button"
            aria-label="Menüyü aç"
          >
            <Menu />
          </DialogTrigger>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <output className="favorite-feedback" aria-live="polite" key={message}>
        {message}
        {message && <Link href="/favoriler">Favoriler ve karşılaştırma</Link>}
      </output>
      <DialogContent
        className="garage-panel"
        layout="fullscreen"
        showCloseButton={false}
      >
        <div className="panel-head">
          <span className="monogram">VD</span>
          <DialogTitle className="eyebrow">ROTANIZI SEÇİN</DialogTitle>
          <DialogClose className="icon-button" aria-label="Menüyü kapat">
            <X />
          </DialogClose>
        </div>
        <div className="panel-links">
          <nav aria-label="Tüm sayfalar">
            {panelNav.map(([href, label], i) => (
              <Link
                key={href}
                className={'panel-link ' + (active(href) ? 'active' : '')}
                href={href}
                aria-current={active(href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {label}
                {href === '/favoriler' && <small>({favorites.length})</small>}
              </Link>
            ))}
          </nav>
          <div className="panel-meta">
            <div>
              <b>HİZMETLER</b>
              <Link href="/havalimani-teslimati" onClick={() => setOpen(false)}>
                Havalimanı teslimatı
              </Link>
              <Link href="/soforlu-kiralama" onClick={() => setOpen(false)}>
                Şoförlü kiralama
              </Link>
              <Link href="/sss" onClick={() => setOpen(false)}>
                Sık sorulanlar
              </Link>
            </div>
            <p>İstanbul / Ankara / İzmir / Antalya</p>
            <p>
              Konsept araç kiralama sitesi.
              <br />
              Portföy demosu · Türkçe
            </p>
            <Link
              className="button primary"
              href="/rezervasyon"
              onClick={() => setOpen(false)}
            >
              Rezervasyonu Deneyin
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
