import { LegalPage } from '@/components/legal-page';
export const metadata = { title: 'KVKK · Örnek Bilgilendirme' };
export default function Page() {
  return (
    <LegalPage
      code="KVKK / DEMO"
      title="Veri bilgilendirmesi"
      intro="Bu sayfa bir portföy arayüzü örneğidir; gerçek bir işletmeye ait KVKK aydınlatma metni veya hukuki uygunluk beyanı değildir."
      sections={[
        {
          title: 'Demo kapsamı',
          text: 'Gerçek müşteri kaydı, kimlik doğrulama, ödeme veya rezervasyon işlemi yapılmaz. Formları örnek bilgilerle deneyebilirsiniz.',
        },
        {
          title: 'Tarayıcı tercihleri',
          text: 'Favoriler ve seyahat tercihleri yalnızca kullandığınız tarayıcıda saklanır. İletişim bilgileri kalıcı taslağa dahil edilmez.',
        },
        {
          title: 'Gönderim ve aktarım',
          text: 'Demo formlarının bilgileri herhangi bir kiralama şirketine, e-posta servisine veya SMS sağlayıcısına gönderilmez.',
        },
        {
          title: 'Gerçek hizmete geçiş',
          text: 'Gerçek bir işletme tarafından kullanım öncesinde veri sorumlusu, işleme süreçleri ve başvuru kanalları ayrıca tanımlanmalıdır. Bu demoda doğrulanmamış bir başvuru adresi sunulmaz.',
        },
      ]}
    />
  );
}
