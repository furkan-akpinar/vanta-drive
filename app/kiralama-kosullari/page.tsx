import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal-page';
import { PRICE_NOTICE, TARIFF_NOTICE } from '@/lib/booking';
export const metadata = pageMetadata('/kiralama-kosullari', {
  title: 'Kiralama Koşulları',
  description: 'Konsept araç kiralama hizmeti için örnek koşullar.',
});
export default function Page() {
  return (
    <LegalPage
      code="TERMS / 01"
      title="Kiralama koşulları"
      intro="Bu sayfa yalnızca portföy demosunun kurallarını açıklar. Gerçek kiralama, ödeme, poliçe veya sözleşme oluşturulmaz."
      sections={[
        {
          title: 'Sürücü uygunluğu',
          text: 'Minimum yaş ve ehliyet süresi araç kaydından gösterilir. Son adımda demo uygunluk beyanı istenir; kimlik veya belge toplanmaz.',
        },
        {
          title: 'Depozito',
          text: PRICE_NOTICE,
        },
        {
          title: 'Kilometre ve yakıt',
          text: 'Toplam kilometre hakkı araçtaki günlük sınırın kiralama günüyle çarpımıdır. Ek kilometre hizmeti günde 100 km ekler. Yakıt/şarj ve trafik cezaları örnek fiyata dahil değildir.',
        },
        {
          title: 'Süre ve tarife',
          text:
            'Minimum 24 saat; başlanan ek gün tam gün sayılır. Türkiye saati (UTC+03:00) kullanılır. ' +
            TARIFF_NOTICE,
        },
      ]}
    />
  );
}
