import assert from 'node:assert/strict';
// oxlint-disable typescript/no-implied-eval -- Compile and execute local TypeScript modules for the checks below.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
// Rental fixtures use local Turkish dates, independent of the runner's timezone.
process.env.TZ = 'Europe/Istanbul';
const require = createRequire(import.meta.url),
  cache = new Map();
function source(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const compiledModule = { exports: {} };
  cache.set(file, compiledModule);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (id) =>
      id.startsWith('.')
        ? source(path.resolve(path.dirname(file), id + '.ts'))
        : require(id),
    compiledModule,
    compiledModule.exports,
  );
  return compiledModule.exports;
}
const b = source('lib/booking.ts'),
  { vehicles } = source('data/vehicles.ts');
const trip = {
  from: '2030-10-01T10:00',
  to: '2030-10-02T10:00',
  pickup: 'İstanbul Havalimanı',
  dropoff: 'Ankara',
};
assert.deepEqual(b.tripErrors(trip, new Date('2030-09-30')), {});
assert.ok(
  b.tripErrors({ ...trip, to: '2030-10-02T09:30' }, new Date('2030-09-30')).to,
);
assert.ok(b.tripErrors(trip, new Date('2030-10-02')).from);
assert.ok(b.tripErrors({ ...trip, from: 'bad' }, new Date()).from);
assert.ok(b.tripErrors({ ...trip, pickup: 'unknown' }, new Date()).pickup);
assert.equal(b.minimumReturn(trip.from), trip.to);
assert.equal(
  b.quote(vehicles[0], trip.from, trip.to).total,
  vehicles[0].dailyPrice,
);
assert.equal(
  b.quote(vehicles[0], trip.from, '2030-10-08T10:00').rental,
  vehicles[0].weeklyPrice,
);
assert.equal(
  b.quote(vehicles[0], trip.from, '2030-10-31T10:00').rental,
  vehicles[0].monthlyPrice,
);
assert.equal(b.quote(vehicles[0], trip.from, '2030-10-02T10:30').days, 2);
assert.equal(
  b.quote(vehicles[0], trip.from, '2030-10-03T10:00', ['driver', 'airport'])
    .extraTotal,
  650 * 2 + 1750,
);
assert.equal(
  b.restorePreferences('null', new URLSearchParams()).vehicle,
  vehicles[0].slug,
);
assert.equal(
  b.restorePreferences('{bad', new URLSearchParams()).vehicle,
  vehicles[0].slug,
);
const draft = JSON.stringify({
  version: 2,
  preferences: {
    ...trip,
    vehicle: vehicles[2].slug,
    extras: ['driver'],
    name: 'not retained',
  },
});
assert.equal(
  b.restorePreferences(draft, new URLSearchParams()).vehicle,
  vehicles[2].slug,
);
const restored = b.restorePreferences(
  draft,
  new URLSearchParams(b.tripParams(trip, vehicles[9].slug)),
);
assert.equal(restored.vehicle, vehicles[9].slug);
assert.deepEqual(restored.extras, []);
assert.equal(restored.dropoff, 'Ankara');
assert.equal(restored.name, undefined);
assert.equal(new Set(vehicles.map((v) => v.images[0])).size, 20);
assert.equal(
  new Set(
    vehicles.map((v) =>
      fs.readFileSync('public' + v.images[0]).toString('base64'),
    ),
  ).size,
  20,
);
const catalog = source('lib/catalog.ts');
const invalidFilters = catalog.readFilters(
  new URLSearchParams('marka=unknown&sort=unknown&min=bad&max=Infinity'),
);
assert.equal(invalidFilters.brand, '');
assert.equal(invalidFilters.sort, 'price-asc');
assert.deepEqual(invalidFilters.price, catalog.priceBounds);
assert.equal(catalog.filterVehicles(invalidFilters).length, 20);
const reversedPrices = catalog.readFilters(
  new URLSearchParams('min=999999&max=-1'),
);
assert.deepEqual(reversedPrices.price, catalog.priceBounds);
const porsche = catalog.filterVehicles(
  catalog.readFilters(new URLSearchParams('marka=Porsche')),
);
assert.ok(porsche.length > 0 && porsche.every((v) => v.brand === 'Porsche'));
const electric = catalog.filterVehicles(
  catalog.readFilters(new URLSearchParams('yakit=Elektrik&sort=price-desc')),
);
assert.ok(electric.length > 0 && electric.every((v) => v.fuel === 'Elektrik'));
assert.ok(
  electric.every(
    (v, index) => index === 0 || electric[index - 1].dailyPrice >= v.dailyPrice,
  ),
);
assert.deepEqual(
  catalog.filterVehicles(
    catalog.readFilters(new URLSearchParams('q=nonexistent-model')),
  ),
  [],
);
console.log('PASS: booking, pricing, draft, asset and catalog checks.');

const validation = source('lib/validation.ts');
for (const phone of [
  '-------',
  '((()))  ',
  '       ',
  '+123',
  'abcd1234567',
  '+1234567890123456',
  '0000000000',
])
  assert.equal(validation.validPhone(phone), false, phone);
for (const phone of [
  '+90 (555) 123-45-67',
  '05551234567',
  '+44 20 7946 0958',
  '0049 30 123456',
  '+1 (202) 555-0100',
])
  assert.equal(validation.validPhone(phone), true, phone);
assert.deepEqual(
  validation.contactErrors({
    name: 'İpek O’Neill',
    phone: '+353 87 1234567',
    email: 'ipek@example.test',
  }),
  {},
);
assert.ok(
  validation.contactErrors({ name: '  ', phone: '  ()-- ', email: 'bad' }).name,
);
assert.equal(validation.validText('   ', 2, 2000), false);
assert.equal(validation.validText('a'.repeat(2001), 2, 2000), false);
for (const tz of [
  'UTC',
  'Europe/Istanbul',
  'America/Los_Angeles',
  'Asia/Tokyo',
]) {
  process.env.TZ = tz;
  assert.equal(
    b.minimumPickup(new Date('2030-01-01T23:15:00Z')),
    '2030-01-02T03:00',
    tz,
  );
  assert.equal(
    b.defaultTrip(new Date('2030-01-01T23:15:00Z')).from,
    '2030-01-03T10:00',
    tz,
  );
  assert.equal(
    b.quote(vehicles[0], '2030-03-09T10:00', '2030-03-10T10:00').days,
    1,
    tz,
  );
  assert.equal(
    b.quote(vehicles[0], trip.from, '2030-10-07T10:00').rental,
    111000,
    tz,
  );
  assert.equal(
    b.quote(vehicles[0], trip.from, '2030-10-30T10:00').rental,
    459857,
    tz,
  );
  assert.equal(
    b.quote(vehicles[0], trip.from, '2030-10-31T10:00').rental,
    390000,
    tz,
  );
  assert.ok(
    b.tripErrors(
      { ...trip, from: '2030-01-01T02:00', to: '2030-01-02T02:00' },
      new Date('2030-01-01T00:00:00Z'),
    ).from,
    tz,
  );
}
for (const value of [
  '2030-02-30T10:00',
  '2030-13-01T10:00',
  '2030-01-01T24:01',
  '2030-01-01T10:60',
  'not-a-date',
])
  assert.equal(b.validDateTime(value), false, value);
assert.ok(
  b.tripErrors({ ...trip, to: '2030-09-30T10:00' }, new Date('2030-09-29')).to,
);
assert.ok(
  b.tripErrors(
    { ...trip, pickup: 'Ankara' },
    new Date('2030-09-29'),
    vehicles[0],
  ).pickup,
);
const ankara = new URLSearchParams(
  'pickup=Ankara&lokasyon=' + encodeURIComponent('İstanbul Merkez'),
);
assert.equal(b.readTrip(ankara).pickup, 'Ankara');
assert.equal(b.readTrip(ankara).dropoff, 'Ankara');
assert.equal(catalog.readFilters(ankara).location, 'Ankara');
const ankaraFleet = catalog.filterVehicles(catalog.readFilters(ankara));
assert.ok(
  ankaraFleet.length > 0 &&
    ankaraFleet.length < 20 &&
    ankaraFleet.every((v) => v.locations.includes('Ankara')),
);
assert.equal(
  b.readTrip(new URLSearchParams('lokasyon=Ankara')).pickup,
  'Ankara',
);
assert.equal(
  catalog.readFilters(new URLSearchParams('q=%20%20BMW%20%20i7%20%20')).search,
  'BMW i7',
);
assert.equal(catalog.choices.transmission.includes('Manuel'), false);
assert.ok(b.serviceReason('airport', { ...trip, pickup: 'Ankara' }));
assert.ok(b.serviceReason('delivery', trip));
const airport = b.restorePreferences(
  draft,
  new URLSearchParams(
    'pickup=' + encodeURIComponent('Sabiha Gökçen') + '&extras=airport,unknown',
  ),
);
assert.deepEqual(airport.extras, ['airport']);
assert.deepEqual(
  b.restorePreferences(
    JSON.stringify({
      version: 2,
      preferences: {
        ...trip,
        from: '2020-01-01T10:00',
        to: '2020-01-02T10:00',
        extras: ['driver'],
        vehicle: vehicles[2].slug,
      },
    }),
    new URLSearchParams(),
  ).extras,
  [],
);
for (const [name, days] of [
  ['Günlük', 1],
  ['Haftalık', 7],
  ['Aylık', 30],
]) {
  const p = b.readTrip(
    new URL(b.programHref(name), 'http://localhost').searchParams,
  );
  assert.equal(b.quote(vehicles[0], p.from, p.to).days, days);
}
assert.equal(b.programHref('Kurumsal'), '/kurumsal#demo-form');
assert.equal(
  b.quote(vehicles[0], trip.from, trip.to, ['airport', 'airport']).extraTotal,
  1750,
);
console.log(
  'PASS: international validation, four timezones, tariff thresholds, location conflicts, services and stale drafts.',
);
const previousOrigin = process.env.NEXT_PUBLIC_SITE_URL;
function seoWith(origin) {
  if (origin === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = origin;
  cache.delete(path.resolve('lib/seo.ts'));
  return source('lib/seo.ts');
}
for (const invalid of [
  undefined,
  'not-a-url',
  'javascript:alert(1)',
  'https://user:pass@example.invalid',
]) {
  const seo = seoWith(invalid);
  assert.equal(seo.siteOrigin, undefined);
  const meta = seo.pageMetadata('/araclar', { title: 'Araçlar' });
  assert.equal(meta.alternates, undefined);
  assert.deepEqual(meta.openGraph.images, []);
}
const seo = seoWith('https://preview.example.invalid/path');
for (const vehicle of vehicles) {
  const route = '/araclar/' + vehicle.slug;
  const meta = seo.pageMetadata(
    route,
    { title: vehicle.brand + ' ' + vehicle.model },
    vehicle.images[0],
  );
  assert.equal(
    meta.alternates.canonical,
    'https://preview.example.invalid' + route,
  );
  assert.equal(
    meta.openGraph.images[0].url,
    'https://preview.example.invalid' + vehicle.images[0],
  );
  assert.deepEqual(meta.twitter.images, [meta.openGraph.images[0].url]);
}
if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
else process.env.NEXT_PUBLIC_SITE_URL = previousOrigin;
console.log(
  'PASS: absent/invalid publication origin and all 20 vehicle sharing images. Reserved .invalid origin is a test fixture only.',
);
