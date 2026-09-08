import { pageMetadata } from '@/lib/seo';
import { ServicePage } from '@/components/service-page';
import { DemoForm } from '@/components/forms';
import { siteImages } from '@/data/vehicles';
import { chauffeurServices } from '@/data/content';
export const metadata = pageMetadata('/soforlu-kiralama', {
  title: 'Şoförlü Kiralama',
  description:
    'VIP ulaşım ve şoförlü araç kiralama hizmetinin frontend demosu.',
});
export default function Page() {
  return (
    <ServicePage
      code="CHAUFFEUR / VIP"
      image={siteImages.chauffeur}
      imageAlt="VANTA DRIVE özel şoför hizmeti"
      title="Zaman sizin. Rota bizim."
      lead="Deneyimli sürücüler, kusursuz araç kondisyonu ve dakik planlama ile şehir içi ve şehirler arası premium ulaşım."
      items={chauffeurServices.map((s) => ({
        title: s.name,
        text: s.description,
        href: '#demo-form',
        action: 'Programını oluştur',
      }))}
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
