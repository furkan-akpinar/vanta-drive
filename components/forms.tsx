'use client';
import { useState } from 'react';
import { DEMO_NOTICE } from '@/lib/booking';
import { ChoiceField } from './trip-fields';
import { Check } from 'lucide-react';
export function DemoForm({
  type,
}: {
  type: 'corporate' | 'chauffeur' | 'contact';
}) {
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState('12 ay');
  const [service, setService] = useState('Havalimanı transferi');
  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) setDone(true);
  }
  if (done)
    return (
      <div className="form-success" aria-live="polite">
        <Check />
        <h3>Demo form tamamlandı.</h3>
        <p>
          Bilgileriniz gönderilmedi. Bu işlem gerçek talep veya rezervasyon
          oluşturmaz.
        </p>
      </div>
    );
  return (
    <form className="proposal-form" onSubmit={submit}>
      {type === 'corporate' && (
        <label>
          FİRMA ADI
          <input required name="company" />
        </label>
      )}
      <label>
        {type === 'corporate' ? 'YETKİLİ' : 'AD SOYAD'}
        <input required name="name" />
      </label>
      <label>
        TELEFON
        <input required type="tel" name="phone" />
      </label>
      <label>
        E-POSTA
        <input required type="email" name="email" />
      </label>
      {type === 'corporate' && (
        <>
          <label>
            ARAÇ SAYISI
            <input required type="number" min="1" name="count" />
          </label>
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
            onChange={setService}
            options={[
              'Havalimanı transferi',
              'Günlük özel şoför',
              'Etkinlik ve VIP karşılama',
            ].map((x) => ({ value: x, label: x }))}
          />
          <label>
            TARİH
            <input
              required
              type="date"
              min={new Date().toISOString().split('T')[0]}
            />
          </label>
        </>
      )}
      <label className="wide">
        MESAJ
        <textarea required rows={5} name="message" />
      </label>
      <p className="demo-note wide">{DEMO_NOTICE}</p>
      <button className="button primary" type="submit">
        Demoyu Tamamla
      </button>
    </form>
  );
}
