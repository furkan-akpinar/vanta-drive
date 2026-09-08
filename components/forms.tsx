'use client';
import { useRef, useState } from 'react';
import {
  DEMO_NOTICE,
  minimumPickup,
  instant,
  validDateTime,
} from '@/lib/booking';
import { contactErrors, validText, focusInvalid } from '@/lib/validation';
import { chauffeurServices } from '@/data/content';
import { ChoiceField } from './trip-fields';
import { Check } from 'lucide-react';

export function DemoForm({
  type,
}: {
  type: 'corporate' | 'chauffeur' | 'contact';
}) {
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState('12 ay');
  const [service, setService] = useState(chauffeurServices[0].name);
  const [hours, setHours] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const success = useRef<HTMLDivElement>(null);
  const selected = chauffeurServices.find((x) => x.name === service)!;
  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === 'string' ? entry : '';
    };
    const issues = contactErrors({
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
    });
    if (!validText(value('message'), 2, 2000))
      issues.message = '2–2000 karakterlik bir mesaj girin.';
    if (type === 'corporate') {
      if (!validText(value('company')))
        issues.company = '2–120 karakterlik bir firma adı girin.';
      const count = Number(value('count'));
      if (!Number.isInteger(count) || count < 1 || count > 1000)
        issues.count = '1–1000 arasında araç sayısı girin.';
    }
    if (type === 'chauffeur') {
      if (!validDateTime(value('date')) || instant(value('date')) < new Date())
        issues.date = 'Gelecekte bir tarih ve saat seçin (Türkiye saati).';
      for (const key of ['origin', 'destination'])
        if (!validText(value(key), 2, 500))
          issues[key] = 'Başlangıç ve varış noktasını belirtin.';
      const count = Number(hours);
      if (!Number.isFinite(count) || count < selected.hours || count > 24)
        issues.hours = selected.hours + '–24 saat arasında süre girin.';
      if (
        service === 'Havalimanı transferi' &&
        !/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(value('flight').trim())
      )
        issues.flight = 'Örnek uçuş numarasını girin (TK1234).';
    }
    setErrors(issues);
    if (Object.keys(issues).length) {
      focusInvalid(form);
      return;
    }
    form.reset();
    setDone(true);
    requestAnimationFrame(() => success.current?.focus());
  }
  function field(name: string, label: string, kind = 'text', maxLength = 120) {
    return (
      <label>
        {label}
        <input
          id={type + '-' + name}
          name={name}
          type={kind}
          maxLength={maxLength}
          min={
            kind === 'datetime-local'
              ? minimumPickup()
              : kind === 'number'
                ? 1
                : undefined
          }
          max={kind === 'number' ? 1000 : undefined}
          autoComplete={
            name === 'phone'
              ? 'tel'
              : ['name', 'email'].includes(name)
                ? name
                : 'off'
          }
          aria-invalid={!!errors[name]}
          aria-describedby={
            errors[name] ? type + '-' + name + '-error' : undefined
          }
          onChange={() => setErrors((x) => ({ ...x, [name]: '' }))}
        />
        {errors[name] && (
          <small
            className="field-error"
            id={type + '-' + name + '-error'}
            role="alert"
          >
            {errors[name]}
          </small>
        )}
      </label>
    );
  }
  if (done)
    return (
      <div
        ref={success}
        tabIndex={-1}
        className="form-success"
        aria-live="polite"
      >
        <Check />
        <h3>Demo form tamamlandı.</h3>
        <p>
          Bilgileriniz gönderilmedi. Bu işlem gerçek talep veya rezervasyon
          oluşturmaz. Form bilgileri temizlendi.
        </p>
        <button
          type="button"
          className="button primary"
          onClick={() => {
            setDone(false);
            setErrors({});
            requestAnimationFrame(() =>
              document
                .getElementById(
                  type + '-' + (type === 'corporate' ? 'company' : 'name'),
                )
                ?.focus(),
            );
          }}
        >
          Yeniden dene
        </button>
      </div>
    );
  return (
    <form id="demo-form" className="proposal-form" onSubmit={submit} noValidate>
      {type === 'corporate' && field('company', 'FİRMA ADI')}
      {field('name', type === 'corporate' ? 'YETKİLİ' : 'AD SOYAD')}
      {field('phone', 'TELEFON', 'tel', 30)}
      {field('email', 'E-POSTA', 'email', 254)}
      {type === 'corporate' && (
        <>
          {field('count', 'ARAÇ SAYISI', 'number')}
          <ChoiceField
            id="duration"
            label="SÜRE"
            value={duration}
            onChange={setDuration}
            options={['12 ay', '24 ay', '36 ay'].map((x) => ({
              value: x,
              label: x,
            }))}
          />
        </>
      )}
      {type === 'chauffeur' && (
        <>
          <ChoiceField
            id="service"
            label="HİZMET"
            value={service}
            onChange={(name) => {
              setService(name);
              setHours(
                String(chauffeurServices.find((x) => x.name === name)!.hours),
              );
            }}
            options={chauffeurServices.map((x) => ({
              value: x.name,
              label: x.name,
            }))}
          />
          <p className="field-help wide">{selected.description}</p>
          {field('date', 'TARİH / SAAT (TR)', 'datetime-local')}
          {field('origin', 'BAŞLANGIÇ', 'text', 500)}
          {field('destination', 'VARIŞ', 'text', 500)}
          <label>
            SÜRE (SAAT)
            <input
              id="chauffeur-hours"
              type="number"
              min={selected.hours}
              max={24}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              aria-invalid={!!errors.hours}
              aria-describedby={errors.hours ? 'hours-error' : undefined}
            />
            {errors.hours && (
              <small className="field-error" id="hours-error" role="alert">
                {errors.hours}
              </small>
            )}
          </label>
          {service === 'Havalimanı transferi' &&
            field('flight', 'UÇUŞ NUMARASI', 'text', 12)}
        </>
      )}
      <label className="wide">
        MESAJ
        <textarea
          id={type + '-message'}
          rows={5}
          name="message"
          maxLength={2000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          onChange={() => setErrors((x) => ({ ...x, message: '' }))}
        />
        {errors.message && (
          <small id="message-error" className="field-error" role="alert">
            {errors.message}
          </small>
        )}
      </label>
      <p className="demo-note wide">{DEMO_NOTICE}</p>
      <button className="button primary" type="submit">
        Demoyu Tamamla
      </button>
    </form>
  );
}
