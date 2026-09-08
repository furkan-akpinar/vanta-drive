import { ServicePage } from '@/components/service-page';
import { siteImages } from '@/data/vehicles';
export const metadata = {
  title: 'Hakkımızda',
  description: 'VANTA DRIVE premium mobilite konsepti ve tasarım yaklaşımı.',
};
export default function Page() {
  return (
    <ServicePage
      code="VANTA / ORIGIN"
      image={siteImages.garage}
      imageAlt="VANTA DRIVE araç hazırlık garajı"
      title="Premium mobilitenin teknik yorumu."
      lead="VANTA DRIVE, araç kiralamayı bir anahtar tesliminden çıkarıp ölçülebilir bir hizmet standardına dönüştürür."
      items={[
        {
          title: '42 nokta kontrolü',
          text: 'Her araç teslimattan önce mekanik, kozmetik ve dijital sistem kontrolünden geçer.',
        },
        {
          title: 'Tek ekip',
          text: 'Rezervasyondan iadeye kadar aynı operasyon ekibi sürecinizi izler.',
        },
        {
          title: 'Şeffaf sözleşme',
          text: 'Fiyat, depozito, kilometre ve güvence kapsamı imza öncesi net biçimde gösterilir.',
        },
        {
          title: 'Türkiye ağı',
          text: 'Dört şehir ve iki havalimanında kontrollü büyüyen teslimat altyapısı.',
        },
      ]}
    />
  );
}
