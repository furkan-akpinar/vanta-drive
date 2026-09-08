import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { BookingFlow } from '@/components/booking-flow';
export const metadata: Metadata = pageMetadata('/rezervasyon', {
  title: 'Rezervasyon',
  robots: { index: false, follow: true },
});
export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === 'string') q.set(key, value);
  return (
    <main className="booking-page">
      <header className="booking-title">
        <span className="eyebrow">
          <i>VD / BOOKING</i> GÜVENLİ REZERVASYON
        </span>
        <h1>
          Sürüşünüzü
          <br />
          yapılandırın.
        </h1>
      </header>
      <BookingFlow key={q.toString()} query={q.toString()} />
    </main>
  );
}
