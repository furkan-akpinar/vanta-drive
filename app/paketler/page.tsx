import { packages } from '@/data/content';
import { ServicePage } from '@/components/service-page';
import { siteImages } from '@/data/vehicles';
export const metadata = {
  title: 'Kiralama Programları',
  description:
    'Günlük, haftalık, aylık ve kurumsal araç kiralama programlarını portföy demosunda keşfedin.',
};
export default function Page() {
  return (
    <ServicePage
      code="PLANS / 04"
      heroImage={siteImages.hero}
      heroPosition="right center"
      heroClass="plans-page-hero"
      title="Kullandığınız süre kadar akıllı."
      lead="Günlük esneklikten uzun dönem operasyonuna, her program şeffaf fiyat ve kesintisiz destek içerir."
      items={packages.map((p) => ({
        title: p.name,
        text: `${p.note}. ${p.discount}. Kilometre, güvence ve teslimat kapsamı rezervasyon öncesinde netleştirilir.`,
      }))}
    />
  );
}
