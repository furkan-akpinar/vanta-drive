import { ServicePage } from '@/components/service-page';
import { siteImages } from '@/data/vehicles';
export const metadata = {
  title: 'Havalimanı Teslimatı',
  description:
    'İstanbul Havalimanı ve Sabiha Gökçen teslimat seçeneklerini keşfedin.',
};
export default function Page() {
  return (
    <ServicePage
      code="AIR / SYNC"
      image={siteImages.airport}
      imageAlt="VANTA DRIVE havalimanı teslimat filosu"
      title="Uçuşunuzla senkron teslimat."
      lead="Uçuş numaranızı paylaşın; ekibimiz iniş saatinizi takip etsin ve aracınızı terminal çıkışında hazırlasın."
      items={[
        {
          title: 'İstanbul Havalimanı',
          text: 'İç ve dış hatlarda isim panolu karşılama, bagaj desteği ve vale teslimatı.',
        },
        {
          title: 'Sabiha Gökçen',
          text: 'Terminal çıkışından sözleşme tamamlamaya kadar ortalama 15 dakikalık süreç.',
        },
        {
          title: 'Özel terminal',
          text: 'Genel havacılık terminali, apron koordinasyonu ve kişiselleştirilmiş karşılama.',
        },
        {
          title: 'Uçuş takibi',
          text: 'Erken iniş ve gecikmelere göre teslimat saati otomatik olarak yeniden planlanır.',
        },
      ]}
    />
  );
}
