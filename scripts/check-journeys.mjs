import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
const checks = [],
  failures = [],
  runtimeErrors = [];
await mkdir('outputs/qa', { recursive: true });
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
  console.log('PASS', name);
};
for (const width of [1440, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    timezoneId: width === 390 ? 'America/Los_Angeles' : 'Asia/Tokyo',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => runtimeErrors.push(e.message));
  const sent = [];
  page.on('request', (r) => {
    if (r.method() !== 'GET') sent.push({ url: r.url(), method: r.method() });
  });
  const visit = async (route) => {
    await page.goto(base + route, { waitUntil: 'networkidle' });
  };
  const choose = async (id, label) => {
    const trigger = page.locator('#' + id);
    await trigger.click();
    await page.locator('#' + id + '[aria-controls]').waitFor();
    const menuId = await trigger.getAttribute('aria-controls');
    assert.ok(menuId, 'Select exposes its controlled popup');
    const menu = page.locator('[id="' + menuId + '"]');
    await menu.getByRole('option', { name: label, exact: true }).click();
    await menu.waitFor({ state: 'hidden' });
  };
  const next = async () =>
    page.getByRole('button', { name: 'Devam Et', exact: true }).click();
  const fillContact = async () => {
    await page.locator('#name').fill('İpek O’Neill');
    await page.locator('#phone').fill('+44 (20) 7946-0958');
    await page.locator('#email').fill('ipek@example.test');
    await page.locator('#eligible').check();
  };
  try {
    const response = await page.request.get(base + '/araclar?pickup=Ankara');
    const html = await response.text();
    check(
      width + ' catalog SSR contains cards',
      /<article class="vehicle-card"/.test(html),
    );
    await visit('/?from=2030-10-01T10:00&to=2030-10-08T10:00');
    await choose('pickup', 'Ankara');
    await page.getByRole('button', { name: 'Araç Ara', exact: true }).click();
    await page.waitForURL('**/araclar?**');
    check(
      width + ' Ankara trip summary',
      (await page.locator('.trip-summary').innerText()).includes(
        'Ankara → Ankara',
      ),
    );
    const count = await page.locator('.catalog-grid .vehicle-card').count();
    check(width + ' Ankara filtered subset', count > 0 && count < 20);
    await page.locator('.detail-link').first().click();
    await page.locator('#detail-pickup').waitFor();
    check(
      width + ' detail retains Ankara and Turkish time',
      (await page.locator('#detail-pickup').innerText()).includes('Ankara') &&
        (await page.locator('#detail-from').innerText()).includes('10:00'),
    );
    await page
      .getByRole('button', { name: 'Rezervasyona Devam Et', exact: true })
      .click();
    await page.waitForURL('**/rezervasyon?**');
    await next();
    await page.waitForFunction(
      () => document.activeElement?.id === 'step-title',
    );
    check(
      width + ' step heading receives focus',
      await page
        .locator('#step-title')
        .evaluate((e) => e === document.activeElement),
    );
    await choose('delivery-mode', 'Adrese araç teslimatı · ₺2.250');
    await next();
    await next();
    await page.waitForFunction(
      () =>
        document.activeElement?.id === 'address' &&
        document.getElementById('address')?.getAttribute('aria-invalid') ===
          'true',
    );
    check(
      width + ' address is conditionally required and focused',
      (await page.locator('#address').getAttribute('aria-invalid')) ===
        'true' &&
        (await page
          .locator('#address')
          .evaluate((e) => e === document.activeElement)),
    );
    await page.locator('#address').fill('Örnek Mahallesi 12, Çankaya');
    await page.getByRole('button', { name: /Günlük \+100 kilometre/ }).click();
    await next();
    await fillContact();
    await page.locator('#phone').fill(' (--) -- ');
    await page.getByRole('button', { name: 'Demoyu Tamamla' }).click();
    await page.waitForFunction(
      () =>
        document.activeElement?.id === 'phone' &&
        document.getElementById('phone')?.getAttribute('aria-invalid') ===
          'true',
    );
    check(
      width + ' punctuation phone rejected and focused',
      (await page.locator('#phone').getAttribute('aria-invalid')) === 'true' &&
        (await page
          .locator('#phone')
          .evaluate((e) => e === document.activeElement)),
    );
    await page.locator('#phone').fill('+44 (20) 7946-0958');
    await page.getByRole('button', { name: 'Hizmetleri düzenle' }).click();
    check(
      width + ' edit preserves delivery address',
      (await page.locator('#address').inputValue()) ===
        'Örnek Mahallesi 12, Çankaya',
    );
    await next();
    check(
      width + ' edit preserves contact',
      (await page.locator('#name').inputValue()) === 'İpek O’Neill',
    );
    const stored = await page.evaluate(() =>
      JSON.stringify(
        Object.fromEntries(
          Object.keys(localStorage).map((key) => [
            key,
            localStorage.getItem(key),
          ]),
        ),
      ),
    );
    check(
      width + ' contact address phone stay out of storage and URL',
      !/İpek|7946|Örnek Mahallesi|ipek@/.test(
        stored + decodeURIComponent(page.url()),
      ),
    );
    await page.screenshot({
      path: 'outputs/qa/booking-review-' + width + '.png',
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Demoyu Tamamla' }).click();
    await page.locator('#confirmation-title').waitFor();
    check(
      width + ' final nonpersonal summary',
      (await page.locator('.confirmation-trip').innerText()).includes(
        'Ankara → Ankara',
      ),
    );
    check(
      width + ' completion clears draft and personal data',
      (await page.evaluate(() => !localStorage.getItem('vanta-booking'))) &&
        !(await page.locator('.confirmation').innerText()).includes('İpek'),
    );
    await page.screenshot({
      path: 'outputs/qa/booking-success-' + width + '.png',
      fullPage: true,
    });
    check(width + ' no form submission requests', sent.length === 0);
    await page.getByRole('button', { name: 'Yeniden dene' }).click();
    check(
      width + ' restart available',
      await page.locator('#flow-vehicle').isVisible(),
    );

    await visit(
      '/lokasyonlar/ankara?from=2030-10-01T10:00&to=2030-10-08T10:00',
    );
    const locLink = new URL(
      await page
        .getByRole('link', { name: 'Bu noktadaki araçlar' })
        .getAttribute('href'),
      base,
    );
    check(
      width + ' location CTA and card carry context',
      locLink.searchParams.get('pickup') === 'Ankara' &&
        locLink.searchParams.get('from') === '2030-10-01T10:00' &&
        (
          await page.locator('.detail-link').first().getAttribute('href')
        ).includes('pickup=Ankara'),
    );
    await visit('/paketler');
    for (const [label, days] of [
      ['Günlük', 1],
      ['Haftalık', 7],
      ['Aylık', 30],
    ]) {
      const href = await page
        .locator('.service-grid article')
        .filter({
          has: page.getByRole('heading', { name: label, exact: true }),
        })
        .getByRole('link')
        .getAttribute('href');
      const q = new URL(href, base).searchParams;
      check(
        width + ' ' + label + ' program duration',
        (new Date(q.get('to')) - new Date(q.get('from'))) / 86400000 === days,
      );
    }
    await visit('/havalimani-teslimati');
    await page.getByRole('link', { name: 'SAW araçlarını seç' }).click();
    await page.waitForURL('**/araclar?**');
    await page.locator('.detail-link').first().click();
    await page.locator('#detail-pickup').waitFor();
    await page
      .getByRole('button', { name: 'Rezervasyona Devam Et', exact: true })
      .click();
    await page.waitForURL('**/rezervasyon?**');
    await next();
    await next();
    check(
      width + ' airport service carried into booking',
      await page.locator('#flight').isVisible(),
    );
    await next();
    check(
      width + ' flight conditionally required',
      (await page.locator('#flight').getAttribute('aria-invalid')) === 'true',
    );
    await page.locator('#flight').fill('TK1234');
    await next();
    await fillContact();
    await page.getByRole('button', { name: 'Demoyu Tamamla' }).click();
    await page.locator('#confirmation-title').waitFor();

    await visit(
      '/rezervasyon?vehicle=audi-rs6-avant&from=2030-10-01T10:00&to=2030-10-02T10:00',
    );
    await next();
    await next();
    await next();
    await fillContact();
    await page.getByRole('button', { name: 'Demoyu Tamamla' }).click();
    await page
      .getByRole('heading', { name: 'Talep üzerine demo tamamlandı.' })
      .waitFor();
    check(
      width + ' unavailable car never claims availability',
      await page
        .getByText(
          'Araç müsaitliği onaylanmış değildir. Gerçek talep gönderilmedi.',
        )
        .isVisible(),
    );

    await visit('/rezervasyon?vehicle=missing&from=bad');
    check(
      width + ' invalid vehicle explained',
      await page.getByText(/Bağlantıdaki araç bulunamadı/).isVisible(),
    );
    await page.evaluate(() => {
      localStorage.setItem('vanta-favorites', '{broken');
      localStorage.setItem('vanta-compare', 'null');
    });
    await visit('/favoriler');
    check(
      width + ' corrupt preferences safe',
      await page
        .getByRole('heading', { name: 'Garajınız şimdilik boş.' })
        .isVisible(),
    );
  } catch (error) {
    failures.push({ width, message: String(error) });
    console.error(error);
    await page.screenshot({
      path: 'outputs/qa/journey-failure-' + width + '.png',
      fullPage: true,
    });
  } finally {
    await context.close();
  }
}
await browser.close();
await writeFile(
  'outputs/qa/journeys.json',
  JSON.stringify({ checks, failures, runtimeErrors }, null, 2),
);
if (failures.length || runtimeErrors.length) process.exitCode = 1;
