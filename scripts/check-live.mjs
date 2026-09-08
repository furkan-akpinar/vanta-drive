import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const base = 'https://vanta-drive.furkan-akpinar.workers.dev';
const out = 'outputs/live';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const checks = [],
  failures = [],
  routes = [],
  media = new Set(),
  runtimeErrors = [];
const check = (name, condition) => {
  assert.ok(condition, name);
  checks.push(name);
};
const meta = (html, name) => {
  for (const match of html.matchAll(/<meta\b[^>]*>/g)) {
    const attrs = Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
    );
    if (attrs.name === name || attrs.property === name) return attrs.content;
  }
};
page.on('pageerror', (e) => runtimeErrors.push(e.message));
try {
  const sitemapRes = await context.request.get(base + '/sitemap.xml');
  check('Sitemap HTTP 200', sitemapRes.status() === 200);
  const sitemap = await sitemapRes.text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(
    'Sitemap contains 39 unique routes on the real origin',
    urls.length === 39 &&
      new Set(urls).size === 39 &&
      urls.every((u) => new URL(u).origin === base),
  );
  check(
    'Sitemap excludes reservation and favorites',
    urls.every((u) => !/\/(rezervasyon|favoriler)/.test(u)),
  );
  const robotsRes = await context.request.get(base + '/robots.txt');
  check(
    'Robots HTTP 200 and real sitemap',
    robotsRes.status() === 200 &&
      (await robotsRes.text()).includes(base + '/sitemap.xml'),
  );
  const source = await readFile('data/vehicles.ts', 'utf8');
  const expectedImages = new Map(
    [...source.matchAll(/slug: '([^']+)'[\s\S]*?images: \[\s*'([^']+)'/g)].map(
      (m) => ['/araclar/' + m[1], m[2]],
    ),
  );
  check('20 vehicle image expectations loaded', expectedImages.size === 20);
  for (const url of [...urls, base + '/rezervasyon', base + '/favoriler']) {
    const route = new URL(url).pathname;
    const canonical = base + route;
    const res = await context.request.get(url);
    const html = await res.text();
    check(route + ' HTTP 200', res.status() === 200);
    check(
      route + ' canonical real origin',
      html.includes(`rel="canonical" href="${canonical}"`),
    );
    check(route + ' Open Graph URL', meta(html, 'og:url') === canonical);
    check(
      route + ' share title and description',
      !!meta(html, 'og:title') &&
        !!meta(html, 'og:description') &&
        !!meta(html, 'twitter:title'),
    );
    const image = meta(html, 'og:image');
    check(
      route + ' absolute share images',
      image?.startsWith(base + '/') && meta(html, 'twitter:image') === image,
    );
    media.add(image);
    if (expectedImages.has(route))
      check(
        route + ' correct vehicle share image',
        image === base + expectedImages.get(route),
      );
    if (/\/(rezervasyon|favoriler)$/.test(route))
      check(route + ' noindex', meta(html, 'robots')?.includes('noindex'));
    routes.push({ route, status: res.status(), canonical, image });
  }
  const filtered = await (
    await context.request.get(base + '/araclar?pickup=Ankara&q=volvo')
  ).text();
  check(
    'Filtered catalog canonical excludes query',
    filtered.includes(`rel="canonical" href="${base}/araclar"`),
  );
  check(
    'Catalog SSR includes vehicle cards',
    filtered.includes('<article class="vehicle-card"'),
  );
  for (const route of [
    '/bu-sayfa-yok',
    '/araclar/bulunamadi',
    '/lokasyonlar/bulunamadi',
  ]) {
    const res = await context.request.get(base + route);
    check(route + ' HTTP 404', res.status() === 404);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of [
      ['home', '/'],
      ['catalog', '/araclar'],
      ['vehicle', '/araclar/porsche-911-carrera'],
      ['location', '/lokasyonlar/istanbul-merkez'],
      ['reservation', '/rezervasyon'],
    ]) {
      const res = await page.goto(base + route, { waitUntil: 'networkidle' });
      check(`${width} ${name} browser HTTP 200`, res.status() === 200);
      await page.locator('h1').first().waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const i of document.images) i.loading = 'eager';
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: [...document.images]
          .filter((i) => !i.naturalWidth)
          .map((i) => i.src),
        sources: [...document.images].map((i) => i.currentSrc || i.src),
      }));
      check(
        `${width} ${name} no overflow or broken images`,
        !metrics.overflow && !metrics.broken.length,
      );
      metrics.sources.forEach((u) => media.add(u));
      await page.screenshot({
        path: `${out}/live-${name}-${width}.png`,
        fullPage: true,
        animations: 'disabled',
      });
    }
  }
  for (const path of [
    '/assets/video/vanta-hero.mp4',
    '/assets/video/vanta-hero-mobile.mp4',
    '/assets/video/vanta-hero-poster.webp',
    '/favicon.svg',
  ])
    media.add(base + path);
  for (const url of media) {
    const res = await context.request.get(url, {
      headers: { Range: 'bytes=0-1023' },
    });
    check(
      'Media ' + new URL(url).pathname,
      [200, 206].includes(res.status()) &&
        !res.headers()['content-type']?.includes('text/html'),
    );
  }
  check('No browser runtime errors', runtimeErrors.length === 0);
} catch (e) {
  failures.push(String(e));
  console.error(String(e));
}
await browser.close();
const report = {
  base,
  checkedAt: new Date().toISOString(),
  checks,
  routes,
  mediaCount: media.size,
  runtimeErrors,
  failures,
};
await writeFile(
  out + '/live-verification.json',
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      checks: checks.length,
      routes: routes.length,
      media: media.size,
      runtimeErrors,
      failures,
    },
    null,
    2,
  ),
);
if (failures.length || runtimeErrors.length) process.exitCode = 1;
