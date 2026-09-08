import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [],
  badResponses = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400)
    badResponses.push({ url: r.url(), status: r.status() });
});
await mkdir('outputs/qa', { recursive: true });
const widths = [320, 390, 768, 1024, 1440];
const other = [
  '/araclar/porsche-911-carrera',
  '/rezervasyon',
  '/favoriler',
  '/paketler',
  '/kurumsal',
  '/soforlu-kiralama',
  '/havalimani-teslimati',
  '/lokasyonlar',
  '/lokasyonlar/istanbul-merkez',
  '/hakkimizda',
  '/iletisim',
  '/sss',
  '/gizlilik',
  '/kvkk',
  '/kiralama-kosullari',
];
const results = [];
const links = new Set();
const detailRoutes = [
  ...[
    ...(await readFile('data/vehicles.ts', 'utf8')).matchAll(
      /slug: '([^']+)'/g,
    ),
  ].map((m) => '/araclar/' + m[1]),
  ...[
    ...(await readFile('data/content.ts', 'utf8')).matchAll(/slug: '([^']+)'/g),
  ].map((m) => '/lokasyonlar/' + m[1]),
];
for (const route of new Set(['/', '/araclar', ...other, ...detailRoutes])) {
  for (const width of detailRoutes.includes(route) && !other.includes(route)
    ? [390, 1440]
    : widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(baseURL + route, {
      waitUntil: 'networkidle',
    });
    await page.locator('h1').first().waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) {
        img.loading = 'eager';
      }
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      bodyWidth: document.documentElement.scrollWidth,
      broken: [...document.images]
        .filter((i) => !i.naturalWidth)
        .map((i) => i.src),
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      socialTitle: document.querySelector('meta[property="og:title"]')?.content,
      socialImage: document.querySelector('meta[property="og:image"]')?.content,
      headings: [...document.querySelectorAll('h1')].map((h) => ({
        text: h.textContent,
        width: h.scrollWidth,
        box: h.clientWidth,
      })),
      outliers: [...document.querySelectorAll('main *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            (r.right > innerWidth + 2 || r.left < -2) &&
            !el.closest('.carousel-viewport,.compare-table')
          );
        })
        .slice(0, 8)
        .map((el) => ({ tag: el.tagName, class: el.className })),
    }));
    results.push({ route, width, ...layout });
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((xs) =>
        xs.map((x) => x.href).filter((h) => h.startsWith(location.origin)),
      ))
      links.add(new URL(href).pathname);

    if (
      width === 390 ||
      width === 1440 ||
      ((route === '/' || route === '/araclar') &&
        [320, 768, 1024, 1920].includes(width))
    )
      await page.screenshot({
        path:
          'outputs/qa/' +
          (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')) +
          '-' +
          width +
          '.png',
        fullPage: true,
        animations: 'disabled',
      });
    console.log(
      route,
      width,
      layout.overflow ? 'OVERFLOW' : 'OK',
      layout.broken.length + ' broken images',
    );
  }
}
for (const route of [
  '/missing-route',
  '/araclar/missing-vehicle',
  '/lokasyonlar/missing-location',
]) {
  const response = await page.goto(baseURL + route, {
    waitUntil: 'networkidle',
  });
  const valid =
    response.status() === 404 &&
    (await page.getByRole('heading', { name: 'Bu çıkış kapalı.' }).isVisible());
  results.push({
    route,
    width: 1440,
    overflow: false,
    broken: [],
    expected404: valid,
  });
  if (!valid) errors.push('404 template failed: ' + route);
  await page.screenshot({
    path: 'outputs/qa/404-' + route.split('/').pop() + '.png',
    fullPage: true,
  });
}
// These are deliberate 404 responses, not failed live internal links.
const expected404s = [
  '/missing-route',
  '/araclar/missing-vehicle',
  '/lokasyonlar/missing-location',
];
for (let i = badResponses.length - 1; i >= 0; i--)
  if (
    badResponses[i].status === 404 &&
    expected404s.includes(new URL(badResponses[i].url, baseURL).pathname)
  )
    badResponses.splice(i, 1);
for (let i = errors.length - 1; i >= 0; i--)
  if (
    errors[i].includes('Failed to load resource') &&
    errors[i].includes('404')
  )
    errors.splice(i, 1);
const linkResults = [];
for (const route of links) {
  const response = await page.request.get(baseURL + route);
  linkResults.push({ route, status: response.status() });
  if (response.status() >= 400)
    badResponses.push({ url: route, status: response.status() });
}
await writeFile(
  'outputs/qa/responsive.json',
  JSON.stringify({ results, errors, badResponses, linkResults }, null, 2),
);
await browser.close();
if (
  results.some((r) => r.overflow || r.broken.length) ||
  errors.length ||
  badResponses.length
)
  process.exitCode = 1;
