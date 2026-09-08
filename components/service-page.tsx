import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Headphones,
  Repeat2,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from './footer';
import { MediaImage } from './media-image';
export function ServicePage({
  code,
  title,
  lead,
  items,
  image,
  imageAlt,
  heroImage,
  heroPosition = 'center',
  heroClass = '',
  children,
}: {
  code: string;
  title: string;
  lead: string;
  items: { title: string; text: string }[];
  image?: string;
  imageAlt?: string;
  heroImage?: string;
  heroPosition?: string;
  heroClass?: string;
  children?: React.ReactNode;
}) {
  const icons = [Clock3, ShieldCheck, Repeat2, Headphones];
  return (
    <main className="inner-page">
      <header
        className={`page-header ${heroImage ? 'visual-page-header' : 'editorial-page-header'} ${heroClass}`}
        style={
          heroImage
            ? {
                backgroundImage: `linear-gradient(90deg,rgba(5,6,8,.96) 0%,rgba(5,6,8,.7) 45%,rgba(5,6,8,.16) 100%),linear-gradient(0deg,rgba(5,6,8,.9),transparent 65%),url(${heroImage})`,
                backgroundPosition: heroPosition,
              }
            : undefined
        }
      >
        <span className="eyebrow">
          <i>{code}</i> VANTA SERVICES
        </span>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>
      {image && (
        <MediaImage
          src={image}
          alt={imageAlt || title}
          position="center 58%"
          className="service-hero-image"
        />
      )}
      <section className="service-grid">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article key={item.title}>
              <span>0{i + 1}</span>
              <Icon />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          );
        })}
      </section>
      {children}
      <section className="service-cta">
        <span>VANTA DRIVE / PLANLAMA</span>
        <h2>
          İhtiyacınıza göre
          <br />
          net bir rota.
        </h2>
        <Link className="button white" href="/iletisim">
          Bizimle Görüşün <ArrowRight />
        </Link>
      </section>
      <Footer />
    </main>
  );
}
