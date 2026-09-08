import { FavoritesPage } from '@/components/favorites-page';
import { Footer } from '@/components/footer';
export const metadata = {
  title: 'Favori Araçlar',
  description:
    'Kaydettiğiniz araçları görün ve üç araca kadar özelliklerini karşılaştırın.',
};
export default function Page() {
  return (
    <main className="inner-page">
      <header className="page-header">
        <span className="eyebrow">
          <i>GARAGE / SAVED</i> FAVORİLER
        </span>
        <h1>
          Kişisel
          <br />
          seçkiniz.
        </h1>
        <p>En fazla üç aracı teknik değerleriyle yan yana karşılaştırın.</p>
      </header>
      <section className="section light">
        <FavoritesPage />
      </section>
      <Footer />
    </main>
  );
}
