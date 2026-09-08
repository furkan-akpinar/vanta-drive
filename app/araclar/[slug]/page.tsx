import { notFound } from 'next/navigation';
import { vehicles } from '@/data/vehicles';
import { VehicleDetail } from '@/components/vehicle-detail';
import { VehicleCard } from '@/components/vehicle-card';
import { Footer } from '@/components/footer';
import { pageMetadata } from '@/lib/seo';
export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => {
    const v = vehicles.find((x) => x.slug === slug);
    return pageMetadata(
      '/araclar/' + slug,
      {
        title: v ? `${v.brand} ${v.model}` : 'Araç',
        description: v
          ? `${v.brand} ${v.model} teknik özellikleri ve rezervasyon bilgileri.`
          : '',
      },
      v?.images[0],
    );
  });
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = vehicles.find((v) => v.slug === slug);
  if (!vehicle) notFound();
  const similar = vehicles
    .filter((v) => v.className === vehicle.className && v.slug !== slug)
    .slice(0, 3);
  return (
    <main>
      <VehicleDetail key={vehicle.slug} vehicle={vehicle} />
      {similar.length > 0 && (
        <section className="section dark-section">
          <div className="section-head">
            <span className="eyebrow">
              <i>BENZER ARAÇLAR</i> AYNI SINIF
            </span>
            <h2>Alternatif makineler.</h2>
          </div>
          <div className="catalog-grid compact">
            {similar.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
