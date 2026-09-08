import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage(),
  errors = [],
  checks = [],
  expectedErrors = [];
let deliberateFailure = false;
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (e) => {
  if (e.type() === 'error') {
    if (deliberateFailure && e.text().includes('net::ERR_FAILED'))
      expectedErrors.push(e.text());
    else errors.push(e.text());
  }
});
const visit = async (path) => {
  await page.goto(baseURL + path, { waitUntil: 'networkidle' });
  await page.locator('h1').first().waitFor();
};
const waitForRoute = async (url) => {
  await page.waitForURL(url);
  await page.waitForLoadState('networkidle');
  await page.locator('h1').first().waitFor();
};
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
  console.log('PASS', name);
};
const choose = async (id, value) => {
  const trigger = page.locator('#' + id);
  await trigger.click();
  await page.locator('#' + id + '[aria-controls]').waitFor();
  const menuId = await trigger.getAttribute('aria-controls');
  assert.ok(menuId, 'Select exposes its controlled popup');
  const menu = page.locator('[id="' + menuId + '"]');
  await menu.getByRole('option', { name: value, exact: true }).click();
  await menu.waitFor({ state: 'hidden' });
};
await mkdir('outputs/qa', { recursive: true });
try {
  await visit('/');
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && !v.paused && v.currentTime > 0;
  });
  check(
    'Hero autoplay/muted/loop/playsInline/no controls',
    await page
      .locator('video')
      .evaluate(
        (v) => v.autoplay && v.muted && v.loop && v.playsInline && !v.controls,
      ),
  );
  await page
    .getByRole('button', { name: 'Arka plan videosunu duraklat' })
    .click();
  check(
    'Video pauses accessibly',
    await page.locator('video').evaluate((v) => v.paused),
  );
  await page.getByRole('button', { name: 'Arka plan videosunu oynat' }).click();
  await page.screenshot({ path: 'outputs/qa/desktop-hero.png' });
  await page
    .getByRole('button', { name: 'Tam ekran menüyü aç', exact: true })
    .click();
  await page.getByRole('dialog').waitFor();
  check(
    'Menu focus trapped',
    await page
      .getByRole('dialog')
      .evaluate((d) => d.contains(document.activeElement)),
  );
  for (let i = 0; i < 25; i++) await page.keyboard.press('Tab');
  await page.waitForFunction(() =>
    document.querySelector('[role="dialog"]')?.contains(document.activeElement),
  );
  check(
    'Menu Tab cycle stays within dialog',
    await page
      .getByRole('dialog')
      .evaluate((d) => d.contains(document.activeElement)),
  );
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  check(
    'Menu focus restored',
    await page
      .getByRole('button', { name: 'Tam ekran menüyü aç', exact: true })
      .evaluate((e) => e === document.activeElement),
  );
  await choose('dropoff', 'Ankara');
  await choose('pickup', 'İzmir');
  check(
    'Independent dropoff preserved',
    (await page.locator('#dropoff').innerText()).includes('Ankara'),
  );
  await page.locator('#from').click();
  await page.locator('.date-panel').waitFor();
  await page.locator('.date-panel button[data-selected-single="true"]').click();
  check(
    'Calendar stays open after selecting date',
    await page.locator('.date-panel').isVisible(),
  );
  await choose('from-time', '12:30');
  await page.getByRole('button', { name: 'Tamam', exact: true }).click();
  check(
    'Time selection retained',
    (await page.locator('#from').innerText()).includes('12:30'),
  );
  await page.getByRole('button', { name: 'Araç Ara', exact: true }).click();
  await waitForRoute('**/araclar?**');
  const trip = new URL(page.url()).searchParams;
  check(
    'Trip URL carries date/time and both locations',
    trip.get('from').endsWith('12:30') &&
      trip.get('dropoff') === 'Ankara' &&
      trip.get('pickup') === 'İzmir',
  );
  await page
    .locator('.desktop-filters')
    .getByRole('button', { name: 'İstanbul Merkez', exact: true })
    .click();
  await waitForRoute(
    (url) => url.searchParams.get('pickup') === 'İstanbul Merkez',
  );
  await page
    .locator('.desktop-filters')
    .getByRole('button', { name: 'Porsche', exact: true })
    .click();
  await waitForRoute('**marka=Porsche**');
  check(
    'Brand filter results',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 3,
  );
  await page.reload({ waitUntil: 'networkidle' });
  check(
    'Filters survive reload',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 3,
  );
  await page
    .locator('.desktop-filters')
    .getByRole('button', { name: 'Elektrik', exact: true })
    .click();
  await waitForRoute('**yakit=Elektrik**');
  check(
    'Combined filtering',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 1,
  );
  await page.goBack({ waitUntil: 'networkidle' });
  check(
    'Back restores URL filters',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 3,
  );
  await page
    .getByRole('button', { name: 'Liste görünümü', exact: true })
    .click();
  await page.locator('.catalog-grid.list-view').waitFor();
  check(
    'List layout',
    await page.locator('.catalog-grid.list-view').isVisible(),
  );
  await page.locator('.detail-link').first().click();
  await waitForRoute('**/araclar/porsche-**');
  check(
    'Detail retains locations',
    (await page.locator('#detail-dropoff').innerText()).includes('Ankara'),
  );
  await page.getByRole('link', { name: 'Kataloğa dön', exact: true }).click();
  await waitForRoute('**/araclar?**');
  check(
    'Catalog return preserves brand and view',
    new URL(page.url()).searchParams.get('marka') === 'Porsche' &&
      (await page.locator('.catalog-grid.list-view').isVisible()),
  );
  await page.locator('.detail-link').first().click();
  await page.locator('#detail-from').waitFor();
  await page
    .getByRole('button', { name: 'Rezervasyona Devam Et', exact: true })
    .click();
  check(
    'Incompatible return location is blocked',
    (await page.locator('#detail-dropoff').getAttribute('aria-invalid')) ===
      'true',
  );
  await choose('detail-dropoff', 'İstanbul Merkez');
  const detailTotal = await page
    .locator('.sticky-booking .total-line b')
    .innerText();
  await page.evaluate(() =>
    localStorage.setItem(
      'vanta-booking',
      JSON.stringify({
        version: 2,
        preferences: {
          vehicle: 'bmw-i7',
          from: '2031-01-01T10:00',
          to: '2031-01-02T10:00',
          pickup: 'Ankara',
          dropoff: 'Ankara',
          extras: ['driver'],
        },
      }),
    ),
  );
  await page
    .getByRole('button', { name: 'Rezervasyona Devam Et', exact: true })
    .click();
  await waitForRoute('**/rezervasyon?**');
  check(
    'New explicit vehicle overrides old draft',
    (await page.locator('#flow-vehicle').innerText()).includes('Porsche'),
  );
  check(
    'Pricing matches detail',
    detailTotal ===
      (await page.locator('.booking-summary .total-line b').innerText()),
  );
  await page.getByRole('button', { name: 'Devam Et', exact: true }).click();
  check(
    'Booking location preserved',
    (await page.locator('#flow-dropoff').innerText()).includes(
      'İstanbul Merkez',
    ),
  );
  await page.getByRole('button', { name: 'Devam Et', exact: true }).click();
  await page.getByRole('button', { name: /Çocuk koltuğu/ }).click();
  await page.getByRole('button', { name: 'Devam Et', exact: true }).click();
  await page
    .getByRole('button', { name: 'Demoyu Tamamla', exact: true })
    .click();
  check(
    'Inline validation including driver declaration',
    (await page.getByRole('alert').count()) === 4,
  );
  await page.getByLabel('AD SOYAD', { exact: false }).fill('Demo Kullanıcı');
  await page.getByLabel('TELEFON', { exact: false }).fill('05550000000');
  await page.getByLabel('E-POSTA', { exact: false }).fill('demo@example.test');
  await page.locator('#eligible').check();
  check(
    'Contact data not persisted',
    !(
      await page.evaluate(() => localStorage.getItem('vanta-booking'))
    ).includes('Demo Kullanıcı'),
  );
  await page
    .getByRole('button', { name: 'Demoyu Tamamla', exact: true })
    .click();
  await page
    .getByRole('heading', { name: 'Demo rezervasyon tamamlandı.' })
    .waitFor();
  check(
    'Truthful demo completion',
    await page.getByText(/Bu işlem gerçek rezervasyon oluşturmaz/).isVisible(),
  );
  await visit('/araclar');
  await page.locator('.catalog-search input').fill('BMW');
  await waitForRoute('**q=BMW**');
  check(
    'Search keeps keyboard focus after URL update',
    await page
      .locator('.catalog-search input')
      .evaluate((el) => el === document.activeElement),
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.catalog-grid .vehicle-card').length === 3,
  );
  check(
    'Brand/model text search',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 3,
  );
  await page.locator('.catalog-search input').fill('xyz-no-model');
  await waitForRoute('**q=xyz-no-model**');
  await page
    .getByRole('heading', { name: 'Eşleşen araç bulunamadı.' })
    .waitFor();
  check(
    'Search empty state',
    await page
      .getByRole('button', { name: 'Filtreleri Temizle', exact: true })
      .isVisible(),
  );
  await page
    .getByRole('button', { name: 'Filtreleri Temizle', exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll('.catalog-grid .vehicle-card').length === 20,
  );
  await page
    .getByRole('slider', { name: 'Minimum günlük fiyat', exact: true })
    .press('ArrowRight');
  await waitForRoute('**min=11000**');
  check(
    'Keyboard price range updates URL',
    new URL(page.url()).searchParams.get('min') === '11000',
  );
  await visit('/araclar');
  await page
    .locator('.catalog-search input')
    .pressSequentially('   BMW   ', { delay: 15 });
  await page
    .locator('.desktop-filters')
    .getByRole('button', { name: 'Elektrik', exact: true })
    .click();
  await waitForRoute(
    (url) =>
      url.searchParams.get('q') === 'BMW' &&
      url.searchParams.get('yakit') === 'Elektrik',
  );
  check(
    'Fast search and filter preserve both values',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 1,
  );
  await visit('/araclar?q=BMW');
  await page
    .getByRole('button', { name: 'Liste görünümü', exact: true })
    .click();
  await waitForRoute('**view=list**');
  await page.locator('.catalog-search input').fill('Porsche');
  await waitForRoute('**q=Porsche**');
  await page.goBack();
  await waitForRoute((url) => url.searchParams.get('q') === 'BMW');
  await page.waitForFunction(
    () => document.querySelector('.catalog-search input').value === 'BMW',
  );
  check(
    'Back restores visible search text',
    (await page.locator('.catalog-search input').inputValue()) === 'BMW',
  );
  await page.locator('.catalog-search input').fill('Porsche');
  await page
    .getByRole('button', { name: 'Liste görünümü', exact: true })
    .click();
  await waitForRoute(
    (url) =>
      url.searchParams.get('q') === 'Porsche' &&
      url.searchParams.get('view') === 'list',
  );
  check(
    'Fast search and view preserve both values',
    (await page.locator('.catalog-search input').inputValue()) === 'Porsche',
  );
  await visit('/araclar');
  await page.locator('.favorite').nth(0).click();
  await page.locator('.favorite').nth(1).click();
  await page.locator('.favorite').nth(2).click();
  await page.locator('.favorite').nth(3).click();
  await visit('/favoriler');
  check(
    'Favorites persisted',
    (await page.locator('.vehicle-card').count()) === 4,
  );
  for (let i = 0; i < 3; i++)
    await page.locator('.compare-check input').nth(i).check();
  check(
    'Comparison max three',
    await page.locator('.compare-check input').nth(3).isDisabled(),
  );
  await page.reload({ waitUntil: 'networkidle' });
  check(
    'Comparison selections persist after refresh',
    (await page.locator('.compare-check input:checked').count()) === 3,
  );
  await page.locator('.favorite').nth(0).click();
  check(
    'Removing favorite also removes comparison',
    (await page.locator('.compare-table thead th').count()) === 3,
  );
  check(
    'Removed comparison is cleaned from storage',
    (
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem('vanta-compare')),
      )
    ).length === 2,
  );
  await visit('/');
  await page.locator('#fleet').scrollIntoViewIfNeeded();
  const before = await page.locator('.carousel-index b').innerText();
  await page.getByRole('button', { name: 'Sonraki araç', exact: true }).click();
  check(
    'Carousel arrows',
    before !== (await page.locator('.carousel-index b').innerText()),
  );
  const box = await page.locator('.carousel-viewport').boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + 100, { steps: 25 });
  await page.mouse.up();
  await page.waitForFunction(
    () => Number(document.querySelector('.carousel-index b').textContent) > 2,
  );
  check(
    'Mouse drag does not activate card link',
    new URL(page.url()).pathname === '/',
  );
  await page.getByRole('tab', { name: /Aylık/ }).click();
  check(
    'Package tabs',
    await page
      .getByRole('tabpanel')
      .getByText('Aylık araç tarifesi', { exact: true })
      .isVisible(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await visit('/');
  check(
    'Mobile video source',
    (await page.locator('video').evaluate((v) => v.currentSrc)).includes(
      'mobile',
    ),
  );
  await page.screenshot({ path: 'outputs/qa/mobile-hero.png' });
  await page.getByRole('button', { name: 'Menüyü aç', exact: true }).click();
  check('Mobile menu', await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#from').click();
  await page.locator('.date-panel').waitFor();
  const cal = await page.locator('.date-panel').boundingBox();
  check(
    'Mobile calendar within viewport',
    cal.x >= 0 &&
      cal.x + cal.width <= 390 &&
      cal.y >= 0 &&
      cal.y + cal.height <= 844,
  );
  await page.screenshot({ path: 'outputs/qa/mobile-calendar.png' });
  await page.keyboard.press('Escape');
  await visit('/araclar');
  await page.getByRole('button', { name: 'Filtrele', exact: false }).click();
  await page.locator('.filter-drawer').waitFor();
  await page
    .locator('.filter-drawer')
    .getByRole('button', { name: 'Electric', exact: true })
    .click();
  await waitForRoute('**sinif=Electric**');
  await page
    .locator('.filter-drawer')
    .getByText('6 araç eşleşiyor', { exact: true })
    .waitFor();
  check(
    'Drawer filter changes results',
    (await page.locator('.filter-drawer').innerText()).includes(
      '6 araç eşleşiyor',
    ),
  );
  await page.screenshot({ path: 'outputs/qa/mobile-filter.png' });
  await page
    .getByRole('button', { name: '6 Aracı Göster', exact: false })
    .click();
  check(
    'Drawer closes and results remain',
    (await page.locator('.catalog-grid .vehicle-card').count()) === 6,
  );
  await visit('/iletisim');
  await page.getByLabel('AD SOYAD').fill('Demo Kullanıcı');
  await page.getByLabel('TELEFON').fill('05550000000');
  await page.getByLabel('E-POSTA').fill('demo@example.test');
  await page.getByLabel('MESAJ').fill('Portföy testi.');
  await page.getByRole('button', { name: 'Demoyu Tamamla' }).click();
  check(
    'Contact form stays client-only',
    await page
      .getByRole('heading', { name: 'Demo form tamamlandı.' })
      .isVisible(),
  );
  for (const route of ['/kurumsal', '/soforlu-kiralama']) {
    await visit(route);
    const form = page.locator('.proposal-form');
    if (route === '/kurumsal') {
      await form.getByLabel('FİRMA ADI').fill('Demo Firma');
      await form.getByLabel('YETKİLİ').fill('Demo Kullanıcı');
      await form.getByLabel('ARAÇ SAYISI').fill('3');
    } else {
      await form.getByLabel('AD SOYAD').fill('Demo Kullanıcı');
      const date = new Date();
      date.setDate(date.getDate() + 1);
      await form
        .getByLabel('TARİH / SAAT (TR)', { exact: true })
        .fill(date.toISOString().slice(0, 10) + 'T12:00');
      await form
        .getByLabel('BAŞLANGIÇ', { exact: true })
        .fill('İstanbul Havalimanı');
      await form.getByLabel('VARIŞ', { exact: true }).fill('Levent');
      await form.getByLabel('UÇUŞ NUMARASI', { exact: true }).fill('TK1234');
    }
    await form.getByLabel('TELEFON').fill('05550000000');
    await form.getByLabel('E-POSTA').fill('demo@example.test');
    await form.getByLabel('MESAJ').fill('Portföy testi.');
    await form.getByRole('button', { name: 'Demoyu Tamamla' }).click();
    check(
      route + ' form is client-only',
      await page
        .getByRole('heading', { name: 'Demo form tamamlandı.' })
        .isVisible(),
    );
  }
  await page.evaluate(() => localStorage.setItem('vanta-booking', '{broken'));
  await visit('/rezervasyon');
  check(
    'Corrupt draft safely ignored',
    await page.locator('#flow-vehicle').isVisible(),
  );
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseURL, { waitUntil: 'networkidle' });
  await touchPage.locator('#fleet').scrollIntoViewIfNeeded();
  const touchBox = await touchPage.locator('.carousel-viewport').boundingBox();
  const cdp = await touchContext.newCDPSession(touchPage);
  const y = touchBox.y + 80;
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 325, y }],
  });
  for (let x = 300; x >= 60; x -= 20)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y }],
    });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await touchPage.waitForFunction(
    () => Number(document.querySelector('.carousel-index b').textContent) > 1,
  );
  check(
    'Real touch gesture moves carousel',
    new URL(touchPage.url()).pathname === '/',
  );
  await touchContext.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visit('/');
  check(
    'Reduced motion uses poster',
    (await page.locator('video').count()) === 0,
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  deliberateFailure = true;
  await page.route('**/assets/video/*.mp4', (r) => r.abort());
  await visit('/');
  check(
    'Unavailable video preserves hero poster',
    (
      await page
        .locator('.video-hero')
        .evaluate((e) => getComputedStyle(e).backgroundImage)
    ).includes('vanta-hero-poster'),
  );
} catch (error) {
  console.error(error);
  await page.screenshot({ path: 'outputs/qa/interaction-failure.png' });
  process.exitCode = 1;
}
await writeFile(
  'outputs/qa/interactions.json',
  JSON.stringify({ checks, errors, expectedErrors }, null, 2),
);
await browser.close();
if (errors.length) process.exitCode = 1;
