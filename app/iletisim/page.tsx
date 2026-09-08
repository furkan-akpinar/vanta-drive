import { pageMetadata } from '@/lib/seo';
import { DemoForm } from '@/components/forms';
import { Footer } from '@/components/footer';
import { siteImages } from '@/data/vehicles';
export const metadata = pageMetadata('/iletisim', {
  title: 'İletişim',
  description: 'Gerçek gönderim yapmayan portföy iletişim formunu deneyin.',
});
export default function Page() {
  return (
    <main className="inner-page">
      <header
        className="page-header visual-page-header contact-page-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(5,6,8,.96),rgba(5,6,8,.62) 52%,rgba(5,6,8,.12)),linear-gradient(0deg,rgba(5,6,8,.9),transparent 65%),url(${siteImages.istanbul})`,
        }}
      >
        <span className="eyebrow">
          <i>İLETİŞİM</i> PORTFÖY DENEYİMİ
        </span>
        <h1>
          Kontrol merkezi
          <br />
          hep açık.
        </h1>
        <p>
          İletişim deneyimini örnek bilgilerle keşfedin. Bu form gerçek bir
          işletmeye gönderilmez.
        </p>
      </header>
      <section className="contact-grid">
        <div className="contact-data">
          <span>TELEFON</span>
          <p>Örnek işletme bilgileri</p>
          <span>E-POSTA</span>
          <p>Bu demo ileti göndermez.</p>
          <span>MERKEZ</span>
          <p>
            Levent, Beşiktaş / İstanbul
            <br />
            Her gün 00:00–24:00
          </p>
        </div>
        <DemoForm type="contact" />
      </section>
      <Footer />
    </main>
  );
}
