'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { useHydrated } from '@/hooks/use-hydrated';
import { BookingStep, type Contact } from './booking-step';
import { contactErrors, validText } from '@/lib/validation';
import {
  DEMO_NOTICE,
  restorePreferences,
  minimumReturn,
  tripErrors,
  quote,
  money,
  displayDateTime,
  type Preferences,
  serviceReason,
  PRICE_NOTICE,
  TARIFF_NOTICE,
  tripNotice,
} from '@/lib/booking';

function initial(query: string) {
  let raw = null;
  if (typeof window !== 'undefined') {
    try {
      raw = localStorage.getItem('vanta-booking');
    } catch {}
    return restorePreferences(raw, new URLSearchParams(query));
  }
  return restorePreferences(null, new URLSearchParams(query));
}
export function BookingFlow({ query }: { query: string }) {
  const hydrated = useHydrated();
  const [data, setData] = useState<Preferences>(() => initial(query));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [eligible, setEligible] = useState(false);
  const root = useRef<HTMLFormElement>(null);
  const [initialNotice] = useState(() => {
    if (typeof window === 'undefined') return '';
    const q = new URLSearchParams(query);
    if (q.has('vehicle') && !vehicles.some((v) => v.slug === q.get('vehicle')))
      return 'Bağlantıdaki araç bulunamadı. Yeni bir araç seçerek demoya devam edebilirsiniz.';
    let raw = null;
    try {
      raw = localStorage.getItem('vanta-booking');
    } catch {
      return 'Tarayıcı depolaması kullanılamıyor; tercihler yalnızca bu açık formda korunur.';
    }
    return (
      tripNotice(q, data) ||
      (raw && !q.size
        ? 'Geçerli seyahat taslağı geri yüklenir; bozuk veya geçmiş taslak yerine yeni tarihler gösterilir. Tercihlerinizi kontrol edin.'
        : '')
    );
  });
  const [contact, setContact] = useState<Contact>({
    name: '',
    phone: '',
    email: '',
    flight: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationAttempt, setValidationAttempt] = useState(0);
  useEffect(() => {
    if (!hydrated) return;
    const id = requestAnimationFrame(() => {
      const target =
        root.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"], [data-invalid="true"]',
        ) ||
        document.getElementById(done ? 'confirmation-title' : 'step-title');
      target?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [step, validationAttempt, done, hydrated]);
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
    if (key === 'vehicle') setEligible(false);
    if (key === 'extras' && Array.isArray(value))
      setContact((c) => ({
        ...c,
        ...(!value.includes('airport') ? { flight: '' } : {}),
        ...(!value.includes('delivery') ? { address: '' } : {}),
      }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }
  function next(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationAttempt((v) => v + 1);
    const invalid = tripErrors(data, new Date(), vehicle);
    if (Object.keys(invalid).length) {
      setErrors(invalid);
      setStep(invalid.from || invalid.to ? 0 : 1);
      return;
    }
    if (step >= 2) {
      const issues: Record<string, string> = {};
      const unsupported = data.extras.filter((id) => serviceReason(id, data));
      if (unsupported.length)
        issues.extras =
          'Teslimat noktasına uygun olmayan seçili hizmetleri kaldırın veya teslimat noktasını düzenleyin.';
      if (
        data.extras.includes('delivery') &&
        !validText(contact.address, 10, 500)
      )
        issues.address = '10–500 karakterlik teslimat adresi girin.';
      if (
        data.extras.includes('airport') &&
        !/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(contact.flight.trim())
      )
        issues.flight =
          'Uçuş numarasını girin (ör. TK1234). Canlı uçuş takibi yapılmaz.';
      if (Object.keys(issues).length) {
        setErrors(issues);
        setStep(2);
        return;
      }
    }
    if (step === 3) {
      const issues = contactErrors(contact);
      if (!eligible)
        issues.eligible = 'Demo sürücü uygunluk beyanını onaylayın.';
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
        <h2 id="confirmation-title" tabIndex={-1}>
          {vehicle.available
            ? 'Demo rezervasyon tamamlandı.'
            : 'Talep üzerine demo tamamlandı.'}
        </h2>
        <p>
          Bu işlem gerçek rezervasyon oluşturmaz. Bilgileriniz gönderilmedi ve
          ödeme alınmadı.
        </p>
        {!vehicle.available && (
          <p>Araç müsaitliği onaylanmış değildir. Gerçek talep gönderilmedi.</p>
        )}
        <div className="confirmation-trip">
          <h2>
            {vehicle.brand} {vehicle.model}
          </h2>
          <p>
            {data.pickup} → {data.dropoff}
          </p>
          <p>
            {displayDateTime(data.from)} — {displayDateTime(data.to)}
          </p>
          <p>
            {price.days} gün · {price.tariff} · Kiralama {money(price.rental)}
          </p>
          <p>
            Ek hizmetler:{' '}
            {price.services.map((x) => x.name).join(', ') || 'Yok'} ·{' '}
            {money(price.extraTotal)}
          </p>
          <p>
            Demo toplam {money(price.total)} · Ayrı depozito{' '}
            {money(vehicle.deposit)}
          </p>
        </div>
        <button
          type="button"
          className="button dark-button"
          onClick={() => {
            setStep(0);
            setEligible(false);
            setDone(false);
          }}
        >
          Yeniden dene
        </button>
        <Link className="button primary" href="/araclar">
          Filoya dön
        </Link>
      </section>
    );
  return (
    <form ref={root} className="booking-flow" onSubmit={next} noValidate>
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
      {initialNotice && <p className="journey-notice">{initialNotice}</p>}
      {!vehicle.available && (
        <p className="journey-notice">
          Talep üzerine araç: bu akış müsaitlik onayı vermez ve gerçek talep
          göndermez.
        </p>
      )}
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
            eligible={eligible}
            setEligible={setEligible}
          />
          {step === 3 && (
            <section className="final-review" aria-label="Son kontrol">
              <h3>Seyahatinizi kontrol edin.</h3>
              <div>
                <b>Araç ve tarihler</b>
                <p>
                  {vehicle.brand} {vehicle.model}
                  <br />
                  {displayDateTime(data.from)} — {displayDateTime(data.to)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep(0);
                  }}
                >
                  Araç ve tarihleri düzenle
                </button>
              </div>
              <div>
                <b>Teslimat</b>
                <p>
                  {data.pickup} → {data.dropoff}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep(1);
                  }}
                >
                  Teslimatı düzenle
                </button>
              </div>
              <div>
                <b>Ek hizmetler ve açıklamalar</b>
                <p>
                  {price.services.map((x) => x.name).join(', ') ||
                    'Ek hizmet yok'}
                  {contact.address && (
                    <>
                      <br />
                      Adres: {contact.address}
                    </>
                  )}
                  {contact.flight && (
                    <>
                      <br />
                      Uçuş: {contact.flight}
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep(2);
                  }}
                >
                  Hizmetleri düzenle
                </button>
              </div>
              <div>
                <b>İletişim</b>
                <p>
                  {contact.name || 'Ad soyad girilmedi'}
                  <br />
                  {contact.phone || 'Telefon girilmedi'}
                  <br />
                  {contact.email || 'E-posta girilmedi'}
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('name')?.focus()}
                >
                  İletişimi düzenle
                </button>
              </div>
            </section>
          )}
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
            <div>
              <dt>Ek hizmet toplamı</dt>
              <dd>{money(price.extraTotal)}</dd>
            </div>
            <div>
              <dt>Ayrı depozito · alınmaz</dt>
              <dd>{money(vehicle.deposit)}</dd>
            </div>
            <div>
              <dt>Toplam km hakkı</dt>
              <dd>
                {price.days *
                  (vehicle.kmLimit +
                    (data.extras.includes('km') ? 100 : 0))}{' '}
                km
              </dd>
            </div>
          </dl>
          <div className="total-line">
            <span>DEMO TOPLAM</span>
            <b>{money(price.total)}</b>
          </div>
          <p className="price-notice">{PRICE_NOTICE}</p>
          <details className="tariff-explainer">
            <summary>Tarife nasıl hesaplanır?</summary>
            <p>{TARIFF_NOTICE}</p>
          </details>
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
