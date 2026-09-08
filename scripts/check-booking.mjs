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
