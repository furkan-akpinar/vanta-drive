'use client';

import { Check, ChevronDown } from 'lucide-react';
import { choices, optionLabel, priceBounds, type Filters } from '@/lib/catalog';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

function ChoiceGroup({
  title,
  filterKey,
  values,
  current,
  set,
}: {
  title: string;
  filterKey: keyof typeof choices;
  values: string[];
  current: string;
  set: (value: string) => void;
}) {
  return (
    <details className="filter-group" open>
      <summary>
        {title}
        <ChevronDown />
      </summary>
      <div className="filter-chips">
        {values.map((value) => (
          <button
            type="button"
            key={value}
            className={current === value ? 'active' : ''}
            aria-pressed={current === value}
            onClick={() => set(current === value ? '' : value)}
          >
            {current === value && <Check />}
            {optionLabel(filterKey, value)}
          </button>
        ))}
      </div>
    </details>
  );
}

export function FilterControls({
  filters,
  set,
  scope = 'desktop',
}: {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  scope?: 'desktop' | 'mobile';
}) {
  return (
    <div className="filter-controls">
      <ChoiceGroup
        title="Sınıf"
        filterKey="className"
        values={choices.className}
        current={filters.className}
        set={(v) => set('className', v)}
      />
      <ChoiceGroup
        title="Marka"
        filterKey="brand"
        values={choices.brand}
        current={filters.brand}
        set={(v) => set('brand', v)}
      />
      <ChoiceGroup
        title="Yakıt"
        filterKey="fuel"
        values={choices.fuel}
        current={filters.fuel}
        set={(v) => set('fuel', v)}
      />
      <ChoiceGroup
        title="Vites"
        filterKey="transmission"
        values={choices.transmission}
        current={filters.transmission}
        set={(v) => set('transmission', v)}
      />
      <ChoiceGroup
        title="Koltuk"
        filterKey="seats"
        values={choices.seats}
        current={filters.seats}
        set={(v) => set('seats', v)}
      />
      <details className="filter-group price-filter" open>
        <summary>
          Günlük fiyat
          <ChevronDown />
        </summary>
        <div className="price-values">
          <b>₺{filters.price[0].toLocaleString('tr-TR')}</b>
          <span>—</span>
          <b>₺{filters.price[1].toLocaleString('tr-TR')}</b>
        </div>
        <Slider
          id={`${scope}-price-range`}
          thumbLabels={['Minimum günlük fiyat', 'Maksimum günlük fiyat']}
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={500}
          value={filters.price}
          onValueChange={(v) => set('price', v as [number, number])}
          aria-label="Günlük fiyat aralığı"
        />
      </details>
      <ChoiceGroup
        title="Lokasyon"
        filterKey="location"
        values={choices.location}
        current={filters.location}
        set={(v) => set('location', v)}
      />
      <div className="availability-row">
        <span>
          <b>Yalnızca müsait</b>
          <small>Örnek müsaitlik verisi · canlı envanter değil</small>
        </span>
        <Switch
          id={`${scope}-availability`}
          checked={filters.available}
          onCheckedChange={(checked) => set('available', checked)}
          aria-label="Yalnızca müsait araçlar"
        />
      </div>
    </div>
  );
}

export function SortControl({
  filters,
  set,
  mobile = false,
}: {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  mobile?: boolean;
}) {
  return (
    <div className={mobile ? 'mobile-sort' : 'sort-control'}>
      <span>SIRALA</span>
      <Select
        value={filters.sort}
        onValueChange={(v) => set('sort', v as string)}
      >
        <SelectTrigger
          id={`sort-${mobile ? 'mobile' : 'desktop'}`}
          className="sort-trigger"
          aria-label="Araçları sırala"
        >
          <SelectValue>
            {filters.sort === 'price-desc'
              ? 'Fiyat: Azalan'
              : filters.sort === 'power'
                ? 'Performans'
                : 'Fiyat: Artan'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Fiyat: Artan</SelectItem>
          <SelectItem value="price-desc">Fiyat: Azalan</SelectItem>
          <SelectItem value="power">Performans</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
