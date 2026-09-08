import { pageMetadata } from '@/lib/seo';
import { ServicePage } from '@/components/service-page';
import { DemoForm } from '@/components/forms';
import { siteImages } from '@/data/vehicles';
export const metadata = pageMetadata('/kurumsal', {
  title: 'Kurumsal Filo',
  description:
    'Yönetici araçları ve uzun dönem filo çözümleri için örnek kurumsal deneyim.',
});
export default function Page() {
  return (
    <ServicePage
      code="BUSINESS / 01"
      heroImage={siteImages.corporate}
      heroPosition="center 62%"
      heroClass="business-page-hero"
      title="Filonuz, hareket halinde."
      lead="Yönetici araçlarından saha ekiplerine, ölçeklenebilir uzun dönem mobilite yönetimi."
      items={[
        {
          title: 'Uzun dönem filo',
          text: '12–36 ay arası esnek kontrat ve ihtiyaca göre araç karması.',
        },
        {
          title: 'Değişim güvencesi',
          text: 'Bakım ve hasar süreçlerinde sınıf eşdeğeri ikame araç.',
        },
        {
          title: 'Operasyon yönetimi',
          text: 'Bakım, lastik, sigorta ve raporlama tek operasyon kanalında.',
        },
        {
          title: 'Kurumsal destek',
          text: 'Atanmış müşteri yöneticisi ve 7/24 sürücü destek hattı.',
        },
      ]}
    >
      <section className="client-logos" aria-label="Örnek kullanım senaryoları">
        <span>Yönetici ulaşımı</span>
        <span>Saha ekipleri</span>
        <span>Etkinlik transferi</span>
        <span>Uzun dönem filo</span>
      </section>
      <section className="form-section">
        <div>
          <span className="eyebrow dark">
            <i>B2B / REQUEST</i> KURUMSAL TEKLİF
          </span>
          <h2>Filo ihtiyacınızı anlatın.</h2>
          <p>
            Araç sayısı ve kullanım modelinizle örnek bir filo talebi oluşturun.
            Form gerçek teklif talebi göndermez.
          </p>
        </div>
        <DemoForm type="corporate" />
      </section>
    </ServicePage>
  );
}
