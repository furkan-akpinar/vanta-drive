import { LegalPage } from '@/components/legal-page';
export const metadata = { title: 'Gizlilik · Demo' };
export default function Page() {
  return (
    <LegalPage
      code="PRIVACY"
      title="Gizlilik ve demo verileri"
      intro="Bu portföy demosu gerçek rezervasyon veya iletişim gönderimi yapmaz. Aşağıdaki açıklamalar mevcut frontend davranışını anlatır."
      sections={[
        {
          title: 'Yerel tercihler',
          text: 'Favori araçlar ve araç, tarih, saat, teslimat noktası ile ek hizmet seçimleri bu tarayıcının yerel deposunda saklanır. Üyelik ve merkezi kullanıcı kaydı yoktur.',
        },
        {
          title: 'Form bilgileri',
          text: 'Ad, telefon, e-posta ve isteğe bağlı teslimat açıklamaları yalnızca açık formun belleğinde tutulur; taslağa yazılmaz ve bir işletmeye gönderilmez. Kart veya ehliyet numarası istenmez.',
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
