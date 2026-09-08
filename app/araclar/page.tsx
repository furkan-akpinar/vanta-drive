import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { VehicleCatalog } from '@/components/vehicle-catalog';
import { Footer } from '@/components/footer';
import { siteImages, vehicles } from '@/data/vehicles';
export const metadata: Metadata = pageMetadata('/araclar', {
  title: 'Premium Araç Filosu',
  description:
    'VANTA DRIVE premium araç filosunu sınıf, marka, yakıt ve lokasyona göre filtreleyin.',
});
export default function VehiclesPage() {
  return (
    <main className="inner-page">
      <header
        className="page-header visual-page-header fleet-page-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(5,6,8,.96),rgba(5,6,8,.52) 52%,rgba(5,6,8,.12)),linear-gradient(0deg,rgba(5,6,8,.88),transparent 66%),url(${siteImages.garage})`,
        }}
      >
        <span className="eyebrow">
          <i>FLEET / {String(vehicles.length).padStart(2, '0')}</i> SEÇKİN
          KOLEKSİYON
        </span>
        <h1>
          Doğru makine.
          <br />
          Doğru rota.
        </h1>
        <p>
          Performanstan yönetici konforuna, 20 farklı sürüş karakterini
          keşfedin.
        </p>
      </header>
      <section className="catalog">
        <VehicleCatalog />
      </section>
      <Footer />
    </main>
  );
}
