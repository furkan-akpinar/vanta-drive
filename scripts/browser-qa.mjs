import { mkdir, writeFile } from 'node:fs/promises';
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
const widths = [320, 360, 390, 430, 768, 820, 1024, 1366, 1440, 1920];
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
for (const route of ['/', '/araclar', ...other]) {
  for (const width of route === '/' || route === '/araclar'
    ? widths
    : [390, 1440]) {
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
