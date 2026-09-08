'use client';

import { Check } from 'lucide-react';
import { vehicles } from '@/data/vehicles';
import { extras } from '@/data/content';
import {
  minimumPickup,
  minimumReturn,
  money,
  type Preferences,
  serviceReason,
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
  eligible: boolean;
  setEligible: (value: boolean) => void;
};

export function BookingStep({
  step,
  data,
  set,
  contact,
  setContact,
  errors,
  setErrors,
  eligible,
  setEligible,
}: BookingStepProps) {
  const vehicle = vehicles.find((v) => v.slug === data.vehicle)!;
  const field = (k: 'flight' | 'address') => (
    <label key={k}>
      {k === 'flight' ? 'UÇUŞ NUMARASI' : 'TESLİMAT ADRESİ'}
      <input
        id={k}
        maxLength={k === 'flight' ? 12 : 500}
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
  );
  return (
    <>
      {step === 0 && (
        <>
          <h2 id="step-title" tabIndex={-1}>
            Aracı ve tarihleri seçin.
          </h2>
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
            Minimum 24 saat. Başlanan ek gün tam gün olarak hesaplanır. Tüm
            teslimat saatleri Türkiye saatidir (UTC+03:00).
          </p>
        </>
      )}
      {step === 1 && (
        <>
          <h2 id="step-title" tabIndex={-1}>
            Teslimatı planlayın.
          </h2>
          <p className="field-help">
            {vehicle.model} için uygun noktalar: {vehicle.locations.join(', ')}.
            Araç değişiminde önceki seçiminiz korunur; uyumsuz noktayı aşağıdan
            düzeltin.
          </p>
          <div className="form-grid">
            <LocationField
              id="flow-pickup"
              label="TESLİM ALMA"
              value={data.pickup}
              onChange={(v) => set('pickup', v)}
              error={errors.pickup}
              allowed={vehicle.locations}
            />
            <LocationField
              id="flow-dropoff"
              label="BIRAKMA"
              value={data.dropoff}
              onChange={(v) => set('dropoff', v)}
              error={errors.dropoff}
              allowed={vehicle.locations}
            />
            <ChoiceField
              id="delivery-mode"
              label="TESLİMAT TÜRÜ"
              value={
                data.extras.includes('airport')
                  ? 'airport'
                  : data.extras.includes('delivery')
                    ? 'delivery'
                    : 'station'
              }
              onChange={(value) =>
                set('extras', [
                  ...data.extras.filter(
                    (id) => !['airport', 'delivery'].includes(id),
                  ),
                  ...(value === 'station' ? [] : [value]),
                ])
              }
              options={[
                { value: 'station', label: 'Noktadan teslim · ek ücret yok' },
                ...extras
                  .filter((x) => ['airport', 'delivery'].includes(x.id))
                  .map((x) => ({
                    value: x.id,
                    label:
                      x.name +
                      ' · ' +
                      money(x.price) +
                      (serviceReason(x.id, data) ? ' · uygun değil' : ''),
                    disabled: !!serviceReason(x.id, data),
                  })),
              ]}
            />
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h2 id="step-title" tabIndex={-1}>
            Yolculuğu tamamlayın.
          </h2>
          {errors.extras && (
            <p className="field-error" id="extras-error" role="alert">
              {errors.extras}
            </p>
          )}
          <div className="extras-grid">
            {extras.map((x) => (
              <button
                type="button"
                aria-pressed={data.extras.includes(x.id)}
                disabled={
                  !!serviceReason(x.id, data) && !data.extras.includes(x.id)
                }
                data-invalid={
                  data.extras.includes(x.id) && !!serviceReason(x.id, data)
                }
                aria-describedby={
                  data.extras.includes(x.id) && serviceReason(x.id, data)
                    ? 'extras-error'
                    : undefined
                }
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
                <p>{x.description}</p>
                {serviceReason(x.id, data) && (
                  <p>
                    {serviceReason(x.id, data)}
                    {data.extras.includes(x.id) && ' Kaldırmak için tıklayın.'}
                  </p>
                )}
              </button>
            ))}
          </div>
          <div className="form-grid service-fields">
            {data.extras.includes('airport') && field('flight')}
            {data.extras.includes('delivery') && field('address')}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2 id="step-title" tabIndex={-1}>
            İletişim ve son kontrol.
          </h2>
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
                  id={k}
                  maxLength={k === 'email' ? 254 : k === 'phone' ? 30 : 120}
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
          <label className="eligibility">
            <input
              id="eligible"
              type="checkbox"
              checked={eligible}
              aria-invalid={!!errors.eligible}
              aria-describedby={errors.eligible ? 'eligible-error' : undefined}
              onChange={(e) => {
                setEligible(e.target.checked);
                setErrors((x) => ({ ...x, eligible: '' }));
              }}
            />{' '}
            Demo senaryosunda en az {vehicle.minAge} yaşında ve{' '}
            {vehicle.licenseYears} yıllık ehliyet sahibi olduğumu varsayıyorum.
            Belge veya kimlik numarası istenmez.
          </label>
          {errors.eligible && (
            <small className="field-error" id="eligible-error" role="alert">
              {errors.eligible}
            </small>
          )}
        </>
      )}
    </>
  );
}
