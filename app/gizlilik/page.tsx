import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal-page';
export const metadata = pageMetadata('/gizlilik', { title: 'Gizlilik · Demo' });
export default function Page() {
  return (
    <LegalPage
      code="PRIVACY"
      title="Gizlilik ve demo verileri"
      intro="Bu portföy demosu gerçek rezervasyon veya iletişim gönderimi yapmaz. Aşağıdaki açıklamalar mevcut frontend davranışını anlatır."
      sections={[
        {
          title: 'Yerel tercihler',
          text: 'Favori araçlar, en fazla üç karşılaştırma seçimi ve araç, tarih, saat, teslimat noktası ile ek hizmet seçimleri bu tarayıcının yerel deposunda saklanır. Üyelik ve merkezi kullanıcı kaydı yoktur.',
        },
        {
          title: 'Form bilgileri',
          text: 'Ad, telefon, e-posta, adres ve uçuş bilgileri yalnızca açık formda tutulur; URL, yerel depo, log veya analitiğe yazılmaz. İlgili ek hizmette adres veya uçuş bilgisi gerekir. Tamamlanma veya sayfadan ayrılmada form bilgileri temizlenir. Kart veya ehliyet numarası istenmez.',
        },
        {
          title: 'Temizleme',
          text: 'Favorilerinizi kalp düğmesiyle kaldırabilirsiniz. Demo tamamlanınca rezervasyon taslağı silinir. Tarayıcının bu siteye ait verilerini temizlemek bütün yerel tercihleri kaldırır.',
        },
        {
          title: 'Kapsam',
          text: 'Bu metin gerçek bir araç kiralama işletmesinin gizlilik politikası değildir. Proje üretim hizmetine dönüştürülürse veri işleme ve gizlilik kapsamı ayrıca hazırlanmalıdır.',
        },
      ]}
    />
  );
}
