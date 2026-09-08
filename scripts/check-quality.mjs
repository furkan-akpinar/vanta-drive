import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://localhost:3000';
await mkdir('outputs/qa', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const results = [],
  contrast = [];
const routes = [
  '/',
  '/araclar',
  '/araclar/porsche-911-carrera',
  '/rezervasyon',
  '/kurumsal',
  '/kvkk',
];
for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const colors = await page.evaluate(() => {
    const rgb = (s) => s.match(/[\d.]+/g)?.map(Number) || [];
    const luminance = (color) =>
      color
        .slice(0, 3)
        .map((n) => {
          const v = n / 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
    const measured = [],
      skipped = [];
    for (const el of document.querySelectorAll('body *')) {
      if (
        !el.getClientRects().length ||
        ![...el.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
        )
      )
        continue;
      const style = getComputedStyle(el),
        foreground = rgb(style.color);
      if (
        style.visibility !== 'visible' ||
        Number(style.opacity) !== 1 ||
        foreground.length < 3
      )
        continue;
      let parent = el,
        background;
      while (parent) {
        const cs = getComputedStyle(parent),
          color = rgb(cs.backgroundColor);
        if (cs.backgroundImage !== 'none' || Number(cs.opacity) !== 1) {
          background = null;
          break;
        }
        if (color.length === 3 || color[3] === 1) {
          background = color;
          break;
        }
        parent = parent.parentElement;
      }
      const text = el.textContent.trim().slice(0, 100);
      if (!background || foreground[3] === 0) {
        skipped.push(text);
        continue;
      }
      const a = luminance(foreground),
        b = luminance(background),
        ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const size = parseFloat(style.fontSize),
        large =
          size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      measured.push({
        text,
        tag: el.tagName,
        class: el.className,
        foreground: style.color,
        background,
        ratio: Math.round(ratio * 100) / 100,
        required: large ? 3 : 4.5,
        size,
      });
    }
    return { measured, skipped };
  });
  contrast.push({
    route,
    ...colors,
    failures: colors.measured.filter((x) => x.ratio < x.required),
  });
  // 200% text enlargement; distinct from physical device emulation.
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const enlarged = await page.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  results.push({ route, condition: '200% root font size', ...enlarged });
  await page.screenshot({
    path: 'outputs/qa/zoom-' + (route.replaceAll('/', '-') || 'home') + '.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 844, height: 390 });
  await page.reload({ waitUntil: 'networkidle' });
  const landscape = await page.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  results.push({ route, condition: '844x390 landscape', ...landscape });
  await page.setViewportSize({ width: 1440, height: 900 });
}
// Equivalent layout/physical-pixel conditions for a 1440x900 screen at 200% zoom.
// This does not claim to automate the browser's native zoom command.
const zoomContext = await browser.newContext({
  viewport: { width: 720, height: 450 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const zoomPage = await zoomContext.newPage();
for (const route of routes) {
  await zoomPage.goto(base + route, { waitUntil: 'networkidle' });
  const metrics = await zoomPage.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  results.push({
    route,
    condition: '200% zoom equivalent: 720x450 CSS pixels at DPR 2',
    ...metrics,
  });
}
await zoomContext.close();
// Storage access can fail (private mode, browser policy or quota). The app must remain usable.
const blocked = await browser.newContext();
await blocked.addInitScript(() => {
  for (const method of ['getItem', 'setItem', 'removeItem'])
    Storage.prototype[method] = () => {
      throw new DOMException('Test unavailable storage', 'SecurityError');
    };
});
const bp = await blocked.newPage();
await bp.goto(base + '/araclar', { waitUntil: 'networkidle' });
await bp.locator('.favorite').first().click();
await bp
  .getByRole('link', { name: 'Favoriler ve karşılaştırma', exact: true })
  .click();
await bp.waitForURL('**/favoriler');
await bp.waitForLoadState('networkidle');
await bp.locator('.vehicle-card').first().waitFor();
assert.equal(
  await bp.locator('.vehicle-card').count(),
  1,
  'Favorites retain memory fallback',
);
await blocked.close();
await browser.close();
const failures = contrast.flatMap((x) =>
  x.failures.map((f) => ({ route: x.route, ...f })),
);
await writeFile(
  'outputs/qa/quality.json',
  JSON.stringify(
    {
      results,
      contrast,
      storageFallback: 'passed',
      limitations:
        'Computed solid-background text colors only. Text over photographs, gradients, translucency or hidden states is excluded; no full accessibility certification.',
      failures,
    },
    null,
    2,
  ),
);
console.log(
  'Contrast samples:',
  contrast.reduce((n, r) => n + r.measured.length, 0),
  'failures:',
  failures.length,
);
console.log(
  'Zoom/landscape checks:',
  results.length,
  'overflow:',
  results.filter((r) => r.documentWidth > r.width + 1).length,
);
if (failures.length || results.some((r) => r.documentWidth > r.width + 1))
  process.exitCode = 1;
