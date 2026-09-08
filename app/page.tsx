import { Gauge, Route, ShieldCheck } from 'lucide-react';
import { HeroVideo } from '@/components/hero-video';
import { HomeSections } from '@/components/home-sections';
import { Footer } from '@/components/footer';
import { vehicles } from '@/data/vehicles';

export default function Home() {
  return (
    <main>
      <HeroVideo />
      <section className="signal-strip" aria-label="Vanta Drive hizmet özeti">
        <div>
          <Gauge />
          <span>
            <b>{vehicles.length}</b> seçkin araç
          </span>
        </div>
        <div>
          <Route />
          <span>
            <b>6</b> teslimat noktası
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <b>7/24</b> yol desteği
          </span>
        </div>
      </section>
      <HomeSections />
      <Footer />
    </main>
  );
}
