'use client';
import { useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { locations } from '@/data/content';
import { validDateTime } from '@/lib/booking';
export function ChoiceField({
  id,
  label,
  value,
  options,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string; disabled?: boolean }[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="choice-field">
      <label id={`${id}-label`}>{label}</label>
      <Select value={value} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger
          id={id}
          aria-labelledby={`${id}-label`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="field-trigger"
        >
          <SelectValue>
            {options.find((o) => o.value === value)?.label || 'Seçin'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="cockpit-menu">
          {options.map((o) => (
            <SelectItem value={o.value} key={o.value} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <small className="field-error" id={`${id}-error`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
export function LocationField({
  id,
  label,
  value,
  onChange,
  error,
  allowed,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  allowed?: string[];
}) {
  return (
    <div className="cockpit-field">
      <MapPin className="field-icon" aria-hidden="true" />
      <ChoiceField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        options={locations.map((l) => ({
          value: l.name,
          label:
            l.name +
            (allowed && !allowed.includes(l.name)
              ? ' · Bu araç için uygun değil'
              : ''),
          disabled: allowed ? !allowed.includes(l.name) : false,
        }))}
        error={error}
      />
    </div>
  );
}
export function DateTimeField({
  id,
  label,
  value,
  min,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const date = validDateTime(value) ? parseISO(value) : undefined;
  const day = value.split('T')[0] || min.split('T')[0];
  const time = value.split('T')[1] || '10:00';
  const times = Array.from(
    { length: 48 },
    (_, i) =>
      `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
  );
  const updateDay = (next: Date | undefined) => {
    if (!next) return;
    const nextDay = format(next, 'yyyy-MM-dd');
    let nextValue = `${nextDay}T${time}`;
    if (nextValue < min) nextValue = min;
    onChange(nextValue);
  };
  return (
    <div className="cockpit-field">
      <label id={`${id}-label`}>
        <CalendarDays aria-hidden="true" /> {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="cockpit-trigger date-trigger"
        >
          <span id={`${id}-value`}>
            {date ? format(date, 'd MMM yyyy', { locale: tr }) : 'Tarih seçin'}
            <small>{date ? time : 'Saat seçin'}</small>
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="date-panel">
          <Calendar
            defaultMonth={date}
            mode="single"
            selected={date}
            onSelect={updateDay}
            disabled={{ before: parseISO(min.split('T')[0]) }}
            locale={tr}
          />
          <div className="time-row">
            <ChoiceField
              id={`${id}-time`}
              label="SAAT"
              value={time}
              onChange={(v) => onChange(`${day}T${v}`)}
              options={times
                .filter((t) => `${day}T${t}` >= min)
                .map((t) => ({ value: t, label: t }))}
            />
            <button
              type="button"
              className="button primary"
              onClick={() => setOpen(false)}
            >
              Tamam
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <small className="field-error" id={`${id}-error`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
