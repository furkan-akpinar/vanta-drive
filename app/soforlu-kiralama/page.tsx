import { ServicePage } from '@/components/service-page';
import { DemoForm } from '@/components/forms';
import { siteImages } from '@/data/vehicles';
export const metadata = {
  title: 'Şoförlü Kiralama',
  description:
    'VIP ulaşım ve şoförlü araç kiralama hizmetinin frontend demosu.',
};
export default function Page() {
  return (
    <ServicePage
      code="CHAUFFEUR / VIP"
      image={siteImages.chauffeur}
      imageAlt="VANTA DRIVE özel şoför hizmeti"
      title="Zaman sizin. Rota bizim."
      lead="Deneyimli sürücüler, kusursuz araç kondisyonu ve dakik planlama ile şehir içi ve şehirler arası premium ulaşım."
      items={[
        {
          title: 'Havalimanı transferi',
          text: 'Uçuş takibi ve terminal karşılama dahil tek yön premium transfer.',
        },
        {
          title: 'Günlük özel şoför',
          text: '8 saat / 150 km dahil, gün boyunca beklemeli yönetici ulaşımı.',
        },
        {
          title: 'Etkinlik ve VIP',
          text: 'Konvoy planlama, protokol karşılama ve koordinasyon desteği.',
        },
        {
          title: 'Saatlik paket',
          text: 'En az üç saatlik rezervasyonla şehir içi toplantı ve davet ulaşımı.',
        },
      ]}
    >
      <section className="form-section">
        <div>
          <span className="eyebrow dark">
            <i>DRIVER / REQUEST</i> TALEP FORMU
          </span>
          <h2>Programınızı paylaşın.</h2>
        </div>
        <DemoForm type="chauffeur" />
      </section>
    </ServicePage>
  );
}
