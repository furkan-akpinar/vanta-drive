import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { locations } from '@/data/content';
import { siteImages } from '@/data/vehicles';
import { RouteMap } from '@/components/route-map';
import { Footer } from '@/components/footer';
import { MediaImage } from '@/components/media-image';
export const metadata = pageMetadata('/lokasyonlar', {
  title: 'Teslimat Noktaları',
  description:
    'Dört şehir ve iki havalimanına yayılan örnek VANTA DRIVE teslimat ağı.',
});
export default function Page() {
  return (
    <main className="inner-page">
      <header className="page-header">
        <span className="eyebrow">
          <i>NETWORK / TR</i> TESLİMAT AĞI
        </span>
        <h1>
          Altı merkez.
          <br />
          Tek standart.
        </h1>
        <p>
          Havalimanından iş merkezinize, aynı teslimat protokolü ve canlı
          operasyon desteği.
        </p>
      </header>
      <MediaImage
        src={siteImages.istanbul}
        alt="İstanbul Boğazı ve VANTA DRIVE teslimat aracı"
        position="center 60%"
        className="service-hero-image"
      />
      <section className="section light">
        <RouteMap />
        <div className="location-list">
          {locations.map((l, i) => (
            <Link href={`/lokasyonlar/${l.slug}`} key={l.slug}>
              <span>0{i + 1}</span>
              <b>{l.code}</b>
              <h2>{l.name}</h2>
              <p>{l.eta}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
