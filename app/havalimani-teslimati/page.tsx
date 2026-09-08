import { pageMetadata } from '@/lib/seo';
import { ServicePage } from '@/components/service-page';
import { siteImages } from '@/data/vehicles';
export const metadata = pageMetadata('/havalimani-teslimati', {
  title: 'Havalimanı Teslimatı',
  description:
    'İstanbul Havalimanı ve Sabiha Gökçen teslimat seçeneklerini keşfedin.',
});
export default function Page() {
  return (
    <ServicePage
      code="AIR / SYNC"
      image={siteImages.airport}
      imageAlt="VANTA DRIVE havalimanı teslimat filosu"
      title="Uçuşunuzla senkron teslimat."
      lead="Terminal karşılama tercihiyle uygun araçları keşfedin. Bu demoda uçuşlar takip edilmez; gerçek rezervasyon veya talep oluşturulmaz."
      items={[
        {
          title: 'İstanbul Havalimanı',
          href:
            '/araclar?pickup=' +
            encodeURIComponent('İstanbul Havalimanı') +
            '&extras=airport',
          action: 'IST araçlarını seç',
          text: 'İç ve dış hatlarda isim panolu karşılama, bagaj desteği ve vale teslimatı.',
        },
        {
          title: 'Sabiha Gökçen',
          href:
            '/araclar?pickup=' +
            encodeURIComponent('Sabiha Gökçen') +
            '&extras=airport',
          action: 'SAW araçlarını seç',
          text: 'Terminal çıkışından sözleşme tamamlamaya kadar ortalama 15 dakikalık süreç.',
        },
        {
          title: 'Karşılama kapsamı',
          text: 'Seçilen teslim alma noktasında tek seferlik karşılama. Örnek hizmet ücreti son kontrolde ayrıca gösterilir.',
        },
        {
          title: 'Uçuş takibi',
          text: 'Uçuş numarası yalnızca form belleğinde tutulur. Otomatik takip veya yeniden planlama entegrasyonu yoktur.',
        },
      ]}
    />
  );
}
