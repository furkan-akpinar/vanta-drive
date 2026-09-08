'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { useHydrated } from '@/hooks/use-hydrated';
import { BookingStep, type Contact } from './booking-step';
import {
  DEMO_NOTICE,
  restorePreferences,
  minimumReturn,
  tripErrors,
  quote,
  money,
  displayDateTime,
  type Preferences,
} from '@/lib/booking';

function initial() {
  let raw = null;
  if (typeof window !== 'undefined') {
    try {
      raw = localStorage.getItem('vanta-booking');
    } catch {}
    return restorePreferences(raw, new URLSearchParams(location.search));
  }
  return restorePreferences(null, new URLSearchParams());
}
export function BookingFlow() {
  const hydrated = useHydrated();
  const [data, setData] = useState<Preferences>(initial);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [contact, setContact] = useState<Contact>({
    name: '',
    phone: '',
    email: '',
    flight: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (done) localStorage.removeItem('vanta-booking');
      else
        localStorage.setItem(
          'vanta-booking',
          JSON.stringify({ version: 2, preferences: data }),
        );
    } catch {}
  }, [data, done, hydrated]);
  const vehicle = vehicles.find((v) => v.slug === data.vehicle)!;
  const price = quote(vehicle, data.from, data.to, data.extras);
  function set<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setData((d) => ({
      ...d,
      [key]: value,
      ...(key === 'from' &&
      typeof value === 'string' &&
      d.to < minimumReturn(value)
        ? { to: minimumReturn(value) }
        : {}),
    }));
    setErrors({});
  }
  function next(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const invalid = tripErrors(data);
    if (Object.keys(invalid).length) {
      setErrors(invalid);
      setStep(invalid.from || invalid.to ? 0 : 1);
      return;
    }
    if (step === 3) {
      const issues: Record<string, string> = {};
      if (contact.name.trim().length < 2) issues.name = 'Ad soyad girin.';
      if (!/^[+\d\s()-]{7,20}$/.test(contact.phone))
        issues.phone = 'Geçerli bir telefon girin.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
        issues.email = 'Geçerli bir e-posta girin.';
      setErrors(issues);
      if (Object.keys(issues).length) return;
      setContact({ name: '', phone: '', email: '', flight: '', address: '' });
      setDone(true);
    } else setStep((s) => s + 1);
  }
  if (!hydrated)
    return <p className="flow-loading">Seyahat tercihleri hazırlanıyor.</p>;
  if (done)
    return (
      <section className="confirmation" aria-live="polite">
        <div className="confirm-icon">
          <Check />
        </div>
        <span className="eyebrow dark">PORTFÖY DENEYİMİ</span>
        <h1>
          Demo rezervasyon
          <br />
          tamamlandı.
        </h1>
        <p>
          Bu işlem gerçek rezervasyon oluşturmaz. Bilgileriniz gönderilmedi ve
          ödeme alınmadı.
        </p>
        <Link className="button primary" href="/araclar">
          Filoya dön
        </Link>
      </section>
    );
  return (
    <form className="booking-flow" onSubmit={next} noValidate>
      <ol className="steps">
        {['Araç ve tarih', 'Teslimat', 'Ek hizmetler', 'İletişim ve özet'].map(
          (label, i) => (
            <li
              key={label}
              className={i === step ? 'active' : i < step ? 'complete' : ''}
              aria-current={i === step ? 'step' : undefined}
            >
              <span>{i < step ? <Check size={16} /> : i + 1}</span>
              {label}
            </li>
          ),
        )}
      </ol>
      <p className="demo-note">{DEMO_NOTICE}</p>
      <div className="booking-work">
        <section className="flow-step" aria-labelledby="step-title">
          <BookingStep
            step={step}
            data={data}
            set={set}
            contact={contact}
            setContact={setContact}
            errors={errors}
            setErrors={setErrors}
          />
        </section>
        <aside className="booking-summary">
          <span className="tiny">SEYAHAT ÖZETİ</span>
          <h3>
            {vehicle.brand}
            <br />
            {vehicle.model}
          </h3>
          <dl>
            <div>
              <dt>Alma</dt>
              <dd>
                {displayDateTime(data.from)}
                <br />
                {data.pickup}
              </dd>
            </div>
            <div>
              <dt>Bırakma</dt>
              <dd>
                {displayDateTime(data.to)}
                <br />
                {data.dropoff}
              </dd>
            </div>
            <div>
              <dt>
                {price.days} gün · {price.tariff}
              </dt>
              <dd>{money(price.rental)}</dd>
            </div>
            {price.services.map((x) => (
              <div key={x.id}>
                <dt>{x.name}</dt>
                <dd>{money(x.total)}</dd>
              </div>
            ))}
          </dl>
          <div className="total-line">
            <span>DEMO TOPLAM</span>
            <b>{money(price.total)}</b>
          </div>
        </aside>
      </div>
      <div className="booking-nav">
        <button
          type="button"
          className="button dark-button"
          disabled={step === 0}
          onClick={() => {
            setStep((s) => s - 1);
            setErrors({});
          }}
        >
          <ChevronLeft /> Geri
        </button>
        <button className="button primary" type="submit">
          {step === 3 ? 'Demoyu Tamamla' : 'Devam Et'}
          <ChevronRight />
        </button>
      </div>
    </form>
  );
}
