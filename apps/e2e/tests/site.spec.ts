import { expect, test } from '@playwright/test';
import { completedDraft as draft } from './helpers';

test(
  'home page leads into the questionnaire',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot('home.png');
    await page.getByRole('link', { name: '开始模拟' }).click();
    await expect(page).toHaveURL(/\/simulate/);
    await expect(page.getByRole('heading', { name: '基本信息' })).toBeVisible();
    await expect(page).toHaveScreenshot('simulate-step-1.png');
  },
);

test(
  'a completed timeline shows both assessment columns',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      (value) =>
        localStorage.setItem('uk-immigration-draft-v1', JSON.stringify(value)),
      draft,
    );
    await page.goto('/result');
    await expect(
      page.getByRole('heading', { name: '你的路径模拟' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '现行法律' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /已公布改革/ }).first(),
    ).toBeVisible();
  },
);

for (const path of ['/policy', '/about']) {
  test(`${path} renders`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('the service worker keeps the site pages available offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  for (const path of [
    '/result',
    '/whatif',
    '/policy',
    '/australia',
    '/new-zealand',
  ]) {
    expect((await page.goto(path))?.ok()).toBe(true);
  }
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
