import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://127.0.0.1:3001';
const engines = (process.env.MENU_BROWSERS || 'chromium').split(',');
const out = 'outputs/menu';
await mkdir(out, { recursive: true });
const checks = [],
  failures = [],
  runtimeErrors = [],
  measurements = [];
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
};
const frames = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
const read = (page) =>
  page.evaluate(() => {
    const dialog = document.querySelector('.garage-panel');
    const content = dialog?.querySelector('.panel-links');
    const rect = (el) => el?.getBoundingClientRect().toJSON();
    return {
      viewport: {
        width: innerWidth,
        height: innerHeight,
        visualWidth: visualViewport.width,
        visualHeight: visualViewport.height,
      },
      popup: rect(dialog),
      head: rect(dialog?.querySelector('.panel-head')),
      close: rect(dialog?.querySelector('[aria-label="Menüyü kapat"]')),
      content: rect(content),
      contentScrollWidth: content?.scrollWidth,
      contentClientWidth: content?.clientWidth,
      contentScrollTop: content?.scrollTop,
      contentScrollHeight: content?.scrollHeight,
      contentClientHeight: content?.clientHeight,
      translate: dialog && getComputedStyle(dialog).translate,
      bodyPadding: getComputedStyle(document.body).paddingLeft,
      bodyOverflow: getComputedStyle(document.body).overflowY,
      htmlOverflow: getComputedStyle(document.documentElement).overflowY,
      documentWidth: document.documentElement.scrollWidth,
      scrollY,
      pageTop: document.querySelector('#main-content').getBoundingClientRect()
        .top,
    };
  });

for (const engine of engines) {
  assert.ok(
    ['chromium', 'webkit'].includes(engine),
    'Supported browser engine',
  );
  const browser = await { chromium, webkit }[engine].launch({ headless: true });
  for (const [width, height] of [
    [320, 740],
    [360, 780],
    [390, 844],
    [430, 932],
    [844, 390],
    [1440, 900],
  ]) {
    const mobile = width !== 1440;
    const context = await browser.newContext({
      ...(mobile ? devices[engine === 'webkit' ? 'iPhone 13' : 'Pixel 5'] : {}),
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      timezoneId: 'Europe/Istanbul',
    });
    const page = await context.newPage();
    const scrollInput = async () => {
      // Mobile WebKit does not implement Playwright's wheel command.
      // PageDown exercises its native scrolling while retaining the mobile profile.
      if (engine === 'webkit' && mobile) await page.keyboard.press('PageDown');
      else await page.mouse.wheel(0, 400);
    };
    const label = `${engine} ${width}x${height}`;
    page.on('pageerror', (error) =>
      runtimeErrors.push({ label, message: error.message }),
    );
    const popup = page.locator('.garage-panel');
    const trigger = page.locator(
      mobile ? '#mobile-menu-trigger' : '#desktop-menu-trigger',
    );
    const assertFit = async (state) => {
      await frames(page);
      const m = await read(page);
      check(
        `${label} ${state}: viewport fit`,
        Math.abs(m.popup.x) <= 1 &&
          Math.abs(m.popup.y) <= 1 &&
          Math.abs(m.popup.right - m.viewport.width) <= 1 &&
          Math.abs(m.popup.bottom - m.viewport.height) <= 1,
      );
      check(
        `${label} ${state}: title and close visible`,
        m.head.top >= 0 &&
          m.head.bottom <= m.viewport.height &&
          m.close.x >= 0 &&
          m.close.right <= m.viewport.width &&
          m.close.height >= 44 &&
          m.close.width >= 44,
      );
      check(
        `${label} ${state}: no horizontal overflow`,
        m.contentScrollWidth <= m.contentClientWidth + 1 &&
          m.documentWidth <= m.viewport.width + 1,
      );
      measurements.push({ label, state, ...m });
      return m;
    };
    const open = async () => {
      await trigger.click();
      await popup.waitFor();
      await page.waitForFunction(() =>
        document
          .querySelector('.garage-panel')
          ?.contains(document.activeElement),
      );
    };
    const close = async (method) => {
      if (method === 'escape') await page.keyboard.press('Escape');
      else await popup.getByRole('button', { name: 'Menüyü kapat' }).click();
      await popup.waitFor({ state: 'hidden' });
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        mobile ? 'mobile-menu-trigger' : 'desktop-menu-trigger',
      );
      await frames(page);
    };
    try {
      const response = await page.goto(base + '/', {
        waitUntil: 'networkidle',
      });
      check(label + ': homepage HTTP 200', response.status() === 200);
      await page.evaluate(() => document.fonts.ready);
      check(
        label + ': correct navigation trigger visible',
        await trigger.isVisible(),
      );
      if (!mobile)
        check(
          label + ': desktop rail preserved',
          (await page.locator('.rail').boundingBox()).width === 84,
        );
      await page.evaluate(() =>
        window.scrollTo({ top: 700, behavior: 'instant' }),
      );
      const before = await read(page);
      await open();
      const opened = await assertFit('scrolled page open');
      check(
        label + ': no opening page jump',
        Math.abs(opened.pageTop - before.pageTop) <= 1,
      );
      check(
        label + ': modal background lock retained',
        /hidden|clip/.test(opened.bodyOverflow + opened.htmlOverflow),
      );
      await page.screenshot({
        path: `${out}/${engine}-${width}x${height}-open.png`,
      });
      // Wheel outside the content must not scroll the background.
      await page.mouse.move(opened.head.x + 5, opened.head.y + 5);
      await scrollInput();
      await frames(page);
      check(
        label + ': background does not scroll',
        Math.abs((await read(page)).pageTop - before.pageTop) <= 1,
      );
      // Exercise the scroll container, including an attempted overscroll at its end.
      const content = popup.locator('.panel-links');
      if (opened.contentScrollHeight > opened.contentClientHeight + 1) {
        await content.hover();
        if (engine === 'webkit' && mobile)
          await content.locator('a').first().focus();
        await scrollInput();
        await page.waitForFunction(
          () => document.querySelector('.panel-links').scrollTop > 0,
        );
        check(
          label + ': menu content scrolls',
          (await read(page)).contentScrollTop > 0,
        );
        if (engine === 'chromium' && mobile) {
          await content.evaluate((el) => {
            el.scrollTop = 0;
          });
          const box = await content.boundingBox();
          const cdp = await context.newCDPSession(page);
          const x = box.x + box.width / 2;
          const y = box.y + box.height - 30;
          const distance = Math.min(200, box.height - 60);
          await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x, y }],
          });
          for (let step = 1; step <= 10; step++) {
            await cdp.send('Input.dispatchTouchEvent', {
              type: 'touchMove',
              touchPoints: [{ x, y: y - (distance * step) / 10 }],
            });
            await page.waitForTimeout(25);
          }
          await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: [],
          });
          await page.waitForFunction(
            () => document.querySelector('.panel-links').scrollTop > 0,
          );
          check(
            label + ': touch swipe scrolls menu',
            (await read(page)).contentScrollTop > 0,
          );
          await cdp.detach();
        }
        await content.evaluate((el) => {
          el.scrollTop = el.scrollHeight;
        });
        await scrollInput();
        await frames(page);
        check(
          label + ': menu overscroll does not move page',
          Math.abs((await read(page)).pageTop - before.pageTop) <= 1,
        );
        await assertFit('content bottom');
        check(
          label + ': final reservation link reachable',
          await popup
            .getByRole('link', { name: 'Rezervasyonu Deneyin' })
            .isVisible(),
        );
      }
      for (let i = 0; i < 16; i++) {
        await page.keyboard.press(i < 8 ? 'Tab' : 'Shift+Tab');
        await page.waitForFunction(() =>
          document
            .querySelector('.garage-panel')
            ?.contains(document.activeElement),
        );
      }
      check(
        label + ': forward/reverse keyboard focus remains trapped',
        await popup.evaluate((el) => el.contains(document.activeElement)),
      );
      await close('escape');
      const closed = await read(page);
      check(
        label + ': Escape restores trigger and page position',
        Math.abs(closed.scrollY - before.scrollY) <= 1,
      );
      check(
        label + ': original scroll styles and rail padding restored',
        closed.bodyOverflow === before.bodyOverflow &&
          closed.htmlOverflow === before.htmlOverflow &&
          closed.bodyPadding === before.bodyPadding,
      );
      await open();
      await assertFit('reopened');
      await close('button');
      check(
        label + ': close button restores page position',
        Math.abs((await read(page)).scrollY - before.scrollY) <= 1,
      );
      await page.mouse.move(width / 2, height / 2);
      await scrollInput();
      await page.waitForFunction(
        (y) => Math.abs(scrollY - y) > 10,
        before.scrollY,
      );
      check(label + ': background scrolling restored', true);
      if (width === 390) {
        await open();
        await page.setViewportSize({ width, height: height - 140 });
        await assertFit('shorter browser viewport');
        await page.setViewportSize({ width: 844, height: 390 });
        await assertFit('rotated landscape');
        await page.setViewportSize({ width, height });
        await assertFit('rotated portrait');
        if (engine === 'chromium') {
          const cdp = await context.newCDPSession(page);
          await cdp.send('Emulation.setSafeAreaInsetsOverride', {
            insets: { top: 44, bottom: 34, left: 0, right: 0 },
          });
          const safe = await assertFit('simulated notch');
          check(
            label + ': safe area header and content inset',
            safe.head.top >= 44 && safe.content.bottom <= height - 34 + 1,
          );
          await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: {} });
          await cdp.detach();
        }
        await close('escape');
      }
      await open();
      await popup
        .getByRole('navigation', { name: 'Tüm sayfalar' })
        .locator('a[href="/araclar"]')
        .click();
      await page.waitForURL('**/araclar');
      await page.waitForLoadState('networkidle');
      await popup.waitFor({ state: 'hidden' });
      check(
        label + ': menu navigation reaches catalog',
        (await page.locator('.catalog-grid .vehicle-card').count()) === 20,
      );
      check(
        label + ': navigation releases scroll lock',
        !/hidden|clip/.test(
          (await read(page)).bodyOverflow + (await read(page)).htmlOverflow,
        ),
      );
      await open();
      await assertFit('catalog reopen');
      await close('button');
      console.log('PASS', label);
    } catch (error) {
      failures.push({ label, message: String(error), stack: error.stack });
      console.error(label, error.stack);
      await page.screenshot({ path: `${out}/${engine}-${width}-failure.png` });
    } finally {
      await context.close();
    }
  }
  await browser.close();
}
await writeFile(
  out + '/menu-results.json',
  JSON.stringify(
    {
      base,
      engines,
      checkedAt: new Date().toISOString(),
      checks,
      failures,
      runtimeErrors,
      measurements,
      limitations:
        'Playwright browser engines and emulated mobile viewports; no physical iOS Safari or Android Chrome device. Viewport height and Chromium safe-area overrides simulate toolbar/notch changes.',
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({ checks: checks.length, failures, runtimeErrors }, null, 2),
);
if (failures.length || runtimeErrors.length) process.exitCode = 1;
