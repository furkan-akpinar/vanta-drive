import { LegalPage } from '@/components/legal-page';
export const metadata = {
  title: 'Kiralama Koşulları',
  description: 'Konsept araç kiralama hizmeti için örnek koşullar.',
};
export default function Page() {
  return (
    <LegalPage
      code="TERMS / 01"
      title="Kiralama koşulları"
      intro="Bu sayfa demo hizmet koşullarının anlaşılır özetidir; kesin koşullar araca ve rezervasyona göre sözleşmede gösterilir."
      sections={[
        {
          title: 'Sürücü uygunluğu',
          text: 'Minimum yaş ve ehliyet süresi araç sınıfına göre değişir. Rezervasyon sahibi geçerli sürücü belgesi ve kimlik sunmalıdır.',
        },
        {
          title: 'Depozito',
          text: 'Araç tesliminde belirtilen tutarda kredi kartı provizyonu alınır. Kontrollerden sonra provizyon bankanın işlem süresine göre kaldırılır.',
        },
        {
          title: 'Kilometre ve yakıt',
          text: 'Günlük kilometre sınırı araç detayında belirtilir. Araç teslim alındığı enerji veya yakıt seviyesiyle iade edilmelidir.',
        },
        {
          title: 'İptal ve değişiklik',
          text: 'Teslim saatinden 24 saat öncesine kadar değişiklik talep edilebilir. Araç müsaitliği ve fiyat farkı uygulanabilir.',
        },
      ]}
    />
  );
}
