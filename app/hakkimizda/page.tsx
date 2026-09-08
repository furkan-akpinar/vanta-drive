import { pageMetadata } from '@/lib/seo';
import { ServicePage } from '@/components/service-page';
import { siteImages } from '@/data/vehicles';
export const metadata = pageMetadata('/hakkimizda', {
  title: 'Hakkımızda',
  description: 'VANTA DRIVE premium mobilite konsepti ve tasarım yaklaşımı.',
});
export default function Page() {
  return (
    <ServicePage
      code="VANTA / ORIGIN"
      image={siteImages.garage}
      imageAlt="VANTA DRIVE araç hazırlık garajı"
      title="Premium mobilitenin teknik yorumu."
      lead="VANTA DRIVE; araç keşfi, seyahat planlama ve rezervasyon adımlarını bir araya getiren Türkçe bir portföy projesidir."
      items={[
        {
          title: 'Araç dosyaları',
          text: 'Yirmi konsept araç; teknik özellikler, tarife ve uygunluk koşullarıyla sunulur.',
        },
        {
          title: 'Tek seyahat akışı',
          text: 'Lokasyon ve tarihler katalogdan araç detayına, ardından dört adımlı demoya taşınır.',
        },
        {
          title: 'Açık fiyat hesabı',
          text: 'Kiralama, ek hizmetler ve depozito ayrı gösterilir. Ödeme veya sözleşme işlemi yapılmaz.',
        },
        {
          title: 'Türkiye ağı',
          text: 'Dört şehirde altı örnek teslimat noktası; gerçek ofis veya canlı envanter bağlantısı bulunmaz.',
        },
      ]}
    />
  );
}
