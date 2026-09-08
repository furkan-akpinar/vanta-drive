'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Headphones,
  KeyRound,
  Plane,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import { siteImages } from '@/data/vehicles';
import { vehicleClasses as classes } from '@/data/classes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { packages } from '@/data/content';
import { programHref } from '@/lib/booking';
import { FleetCarousel } from './fleet-carousel';
import { MediaImage } from './media-image';

const benefits = [
  ['01', 'Aynı gün teslimat', KeyRound],
  ['02', 'Havalimanı karşılama', Plane],
  ['03', '7/24 yol desteği', Headphones],
  ['04', 'Şeffaf fiyatlandırma', ReceiptText],
  ['05', 'Kurumsal çözümler', ShieldCheck],
] as const;

export function HomeSections() {
  const [activeClass, setActiveClass] = useState(0);
  return (
    <>
      <section className="vehicle-classes-section">
        <div className="class-visuals" aria-hidden="true">
          {classes.map((item, index) => (
            <MediaImage
              key={item.name}
              src={item.image}
              alt=""
              fit="contain"
              className={index === activeClass ? 'active' : ''}
            />
          ))}
          <div className="class-visual-shade" />
        </div>
        <div className="class-explorer">
          <div className="section-head">
            <span className="eyebrow">
              <i>02</i> ARAÇ SINIFLARI
            </span>
            <h2>Sürüş karakterinizi seçin.</h2>
          </div>
          <ul className="class-tracks" aria-label="Araç sınıfları">
            {classes.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  className={`class-track ${index === activeClass ? 'active' : ''}`}
                  onMouseEnter={() => setActiveClass(index)}
                  onFocus={() => setActiveClass(index)}
                  onClick={() => setActiveClass(index)}
                  aria-pressed={index === activeClass}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <b>{item.name}</b>
                  <p>{item.desc}</p>
                  <ArrowRight />
                </button>
              </li>
            ))}
          </ul>
          <Link
            className="class-cta"
            href={`/araclar?sinif=${classes[activeClass].name}`}
          >
            {classes[activeClass].name} araçlarını incele <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="section dark-section fleet-section">
        <div className="section-head split">
          <div>
            <span className="eyebrow">
              <i>03</i> SEÇKİN FİLO
            </span>
            <h2>Garajın ön safları.</h2>
          </div>
          <Link className="text-link" href="/araclar">
            Tüm araçlar <ArrowRight />
          </Link>
        </div>
        <FleetCarousel />
      </section>
      <section className="advantage-grid">
        {benefits.map(([n, name, Icon]) => (
          <div key={name}>
            <span>{n}</span>
            <Icon />
            <h3>{name}</h3>
          </div>
        ))}
      </section>
      <section className="section packages-section">
        <div className="section-head">
          <span className="eyebrow dark">
            <i>04</i> KİRALAMA PROGRAMLARI
          </span>
          <h2>Sürenize göre daha akıllı fiyat.</h2>
        </div>
        <Tabs defaultValue="Haftalık" className="package-selector">
          <TabsList className="package-tabs" aria-label="Kiralama programı">
            {packages.map((p, i) => (
              <TabsTrigger
                id={'program-tab-' + i}
                aria-controls={'program-panel-' + i}
                className="package-tab"
                value={p.name}
                key={p.name}
              >
                <span>0{i + 1}</span>
                <b>{p.name}</b>
                <small>{p.note}</small>
              </TabsTrigger>
            ))}
          </TabsList>
          {packages.map((p, i) => (
            <TabsContent
              keepMounted
              id={'program-panel-' + i}
              aria-labelledby={'program-tab-' + i}
              value={p.name}
              className="package-readout"
              key={p.name}
            >
              <span>
                {p.name === 'Kurumsal' ? 'FİLO PROGRAMI' : 'ARAÇ BAZLI TARİFE'}
              </span>
              <b>{p.discount}</b>
              <p>
                {p.name === 'Kurumsal'
                  ? 'İhtiyaca özel araç karması ve operasyon planı.'
                  : 'Süreye uygun araç tarifesi otomatik uygulanır. Ek hizmetleri ayrıca seçebilirsiniz.'}
              </p>
              <Link className="button primary" href={programHref(p.name)}>
                Programı İncele
              </Link>
            </TabsContent>
          ))}
        </Tabs>
      </section>
      <section className="airport-split">
        <div className="media-placeholder">
          <MediaImage
            src={siteImages.airport}
            alt="Havalimanında VANTA DRIVE teslimat araçları"
            position="55% center"
          />
          <div className="media-caption">
            <span>IST / SAW</span>
            <b>
              Uçuşa göre
              <br />
              senkron teslimat
            </b>
          </div>
        </div>
        <div>
          <span className="eyebrow">
            <i>05</i> HAVALİMANI TESLİMATI
          </span>
          <h2>İnişinizden önce hazır.</h2>
          <p>
            İstanbul Havalimanı veya Sabiha Gökçen için terminal karşılama
            senaryosunu deneyin. Bu demoda uçuş takibi ve gerçek teslimat
            yapılmaz.
          </p>
          <Link className="button primary" href="/havalimani-teslimati">
            Teslimatı Planla <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="corporate-band">
        <MediaImage
          src={siteImages.corporate}
          alt="VANTA DRIVE kurumsal araç filosu"
          position="center 62%"
          className="corporate-photo"
        />
        <div>
          <span className="eyebrow">
            <i>06</i> KURUMSAL FİLO
          </span>
          <h2>
            Operasyon sizden,
            <br />
            mobilite bizden.
          </h2>
        </div>
        <div className="corporate-points">
          <p>Uzun dönem kiralama</p>
          <p>Yönetici araçları</p>
          <p>Bakım ve operasyon desteği</p>
          <Link className="button ghost" href="/kurumsal">
            Teklif Al <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
