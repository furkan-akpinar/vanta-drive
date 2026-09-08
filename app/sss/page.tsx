import { pageMetadata } from '@/lib/seo';
import { FAQ } from '@/components/faq';
import { Footer } from '@/components/footer';
export const metadata = pageMetadata('/sss', {
  title: 'Sık Sorulan Sorular',
  description:
    'Kiralama, teslimat, depozito ve demo rezervasyon hakkında sık sorulan sorular.',
});
export default function Page() {
  return (
    <main className="inner-page">
      <header className="page-header">
        <span className="eyebrow">
          <i>HELP / 24</i> BİLGİ MERKEZİ
        </span>
        <h1>Sık sorulanlar.</h1>
        <p>
          Rezervasyon, teslimat, güvence ve iade süreçlerine dair net yanıtlar.
        </p>
      </header>
      <section className="section light narrow">
        <FAQ />
      </section>
      <Footer />
    </main>
  );
}
