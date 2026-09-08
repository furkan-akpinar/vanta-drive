import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { locations } from '@/data/content';
import { vehicles } from '@/data/vehicles';
import { VehicleCard } from '@/components/vehicle-card';
import { Footer } from '@/components/footer';
import { defaultTrip, readTrip, tripParams } from '@/lib/booking';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = locations.find((l) => l.slug === slug);
  return pageMetadata('/lokasyonlar/' + slug, {
    title: loc?.name || 'Lokasyon',
    description: loc?.description || 'VANTA DRIVE teslimat ağı',
  });
}
export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) notFound();
  const query = await searchParams;
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (typeof value === 'string') q.set(key, value);
  const trip = {
    ...readTrip(q, defaultTrip()),
    pickup: loc.name,
    dropoff: loc.name,
  };
  const fleet = vehicles
    .filter((v) => v.locations.includes(loc.name))
    .slice(0, 3);
  return (
    <main className="inner-page">
      <header className="page-header">
        <span className="eyebrow">
          <i>{loc.code} / STATION</i> VANTA NETWORK
        </span>
        <h1>{loc.name}</h1>
        <p>{loc.description}</p>
        <div className="location-meta">
          <span>
            ADRES <b>{loc.address}</b>
          </span>
          <span>
            TESLİMAT <b>{loc.eta}</b>
          </span>
        </div>
        <Link className="button primary" href={'/araclar?' + tripParams(trip)}>
          Bu noktadaki araçlar <ArrowRight />
        </Link>
      </header>
      <section className="section dark-section">
        <div className="section-head">
          <h2>Önerilen filo.</h2>
        </div>
        <div className="catalog-grid compact">
          {fleet.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} trip={trip} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
