'use client';

import { Check } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { extras } from '@/data/content';
import {
  minimumPickup,
  minimumReturn,
  money,
  type Preferences,
} from '@/lib/booking';
import { ChoiceField, DateTimeField, LocationField } from './trip-fields';

export type Contact = {
  name: string;
  phone: string;
  email: string;
  flight: string;
  address: string;
};

type BookingStepProps = {
  step: number;
  data: Preferences;
  set: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  contact: Contact;
  setContact: React.Dispatch<React.SetStateAction<Contact>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export function BookingStep({
  step,
  data,
  set,
  contact,
  setContact,
  errors,
  setErrors,
}: BookingStepProps) {
  return (
    <>
      {step === 0 && (
        <>
          <h2 id="step-title">Aracı ve tarihleri seçin.</h2>
          <div className="form-grid">
            <ChoiceField
              id="flow-vehicle"
              label="ARAÇ"
              value={data.vehicle}
              options={vehicles.map((v) => ({
                value: v.slug,
                label: v.brand + ' ' + v.model,
              }))}
              onChange={(v) => set('vehicle', v)}
            />
            <DateTimeField
              id="flow-from"
              label="ALMA TARİHİ / SAAT"
              value={data.from}
              min={minimumPickup()}
              onChange={(v) => set('from', v)}
              error={errors.from}
            />
            <DateTimeField
              id="flow-to"
              label="BIRAKMA TARİHİ / SAAT"
              value={data.to}
              min={minimumReturn(data.from)}
              onChange={(v) => set('to', v)}
              error={errors.to}
            />
          </div>
          <p className="field-help">
            Minimum 24 saat. Başlanan ek gün tam gün olarak hesaplanır.
          </p>
        </>
      )}
      {step === 1 && (
        <>
          <h2 id="step-title">Teslimatı planlayın.</h2>
          <div className="form-grid">
            <LocationField
              id="flow-pickup"
              label="TESLİM ALMA"
              value={data.pickup}
              onChange={(v) => set('pickup', v)}
              error={errors.pickup}
            />
            <LocationField
              id="flow-dropoff"
              label="BIRAKMA"
              value={data.dropoff}
              onChange={(v) => set('dropoff', v)}
              error={errors.dropoff}
            />
            {(['flight', 'address'] as const).map((k) => (
              <label key={k}>
                {k === 'flight' ? 'UÇUŞ NUMARASI' : 'TESLİMAT ADRESİ'}{' '}
                <small>(isteğe bağlı)</small>
                <input
                  value={contact[k]}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, [k]: e.target.value }))
                  }
                />
              </label>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h2 id="step-title">Yolculuğu tamamlayın.</h2>
          <div className="extras-grid">
            {extras.map((x) => (
              <button
                type="button"
                aria-pressed={data.extras.includes(x.id)}
                className={data.extras.includes(x.id) ? 'selected' : ''}
                key={x.id}
                onClick={() =>
                  set(
                    'extras',
                    data.extras.includes(x.id)
                      ? data.extras.filter((id) => id !== x.id)
                      : [...data.extras, x.id],
                  )
                }
              >
                <span>{data.extras.includes(x.id) ? <Check /> : '+'}</span>
                <b>{x.name}</b>
                <small>
                  {money(x.price)} / {x.unit}
                </small>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2 id="step-title">İletişim ve son kontrol.</h2>
          <p className="field-help">
            Örnek bilgilerle deneyebilirsiniz. İletişim bilgileriniz taslağa
            kaydedilmez.
          </p>
          <div className="form-grid">
            {(['name', 'phone', 'email'] as const).map((k) => (
              <label key={k}>
                {k === 'name'
                  ? 'AD SOYAD'
                  : k === 'phone'
                    ? 'TELEFON'
                    : 'E-POSTA'}
                <input
                  type={
                    k === 'phone' ? 'tel' : k === 'email' ? 'email' : 'text'
                  }
                  autoComplete={k === 'phone' ? 'tel' : k}
                  value={contact[k]}
                  aria-invalid={!!errors[k]}
                  aria-describedby={errors[k] ? k + '-error' : undefined}
                  onChange={(e) => {
                    setContact((c) => ({ ...c, [k]: e.target.value }));
                    setErrors((x) => ({ ...x, [k]: '' }));
                  }}
                />
                {errors[k] && (
                  <small className="field-error" id={k + '-error'} role="alert">
                    {errors[k]}
                  </small>
                )}
              </label>
            ))}
          </div>
        </>
      )}
    </>
  );
}
