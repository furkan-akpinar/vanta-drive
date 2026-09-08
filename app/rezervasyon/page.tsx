import type { Metadata } from 'next';
import { BookingFlow } from '@/components/booking-flow';
export const metadata: Metadata = { title: 'Rezervasyon' };
export default function BookingPage() {
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
      <BookingFlow />
    </main>
  );
}
