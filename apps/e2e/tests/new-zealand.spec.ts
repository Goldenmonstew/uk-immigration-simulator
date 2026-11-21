import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the New Zealand pilot works out dates from a resident visa', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: '打开新西兰试点' }).click();
  await expect(page).toHaveURL(/\/new-zealand/);

  // Submitting without dates moves focus to the linked summary.
  await page.getByRole('button', { name: '计算' }).click();
  const summary = page
    .getByRole('alert')
    .filter({ hasText: '请先修正标红的项目' });
  await expect(summary).toBeFocused();
  await summary.getByRole('link', { name: /出生日期/ }).click();
  await expect(page.getByLabel('出生日期')).toBeFocused();

  await page.getByLabel('模拟日期').fill('2026-11-21');
  await page.getByLabel('出生日期').fill('1990-05-01');
  await page.getByLabel('首次入境新西兰的日期').fill('2019-01-10');
  await page.getByLabel('居民签证（Resident Visa）获批日期').fill('2021-03-01');
  await page.getByLabel('永久居民签证（PRV）获批日期').fill('2023-06-01');
  await page.getByRole('button', { name: '添加出境记录' }).click();
  await page.getByLabel('离开新西兰的日期').fill('2026-05-01');
  await page.getByLabel('回到新西兰的日期').fill('2026-10-15');
  await page.getByRole('button', { name: '计算' }).click();

  await expect(page.getByRole('heading', { name: '计算结果' })).toBeFocused();
  // 166 days away in the last year: 240 days in it again from 2027-06-12.
  const citizenship = page.locator('[data-pathway="NZ-CITIZENSHIP"]');
  await expect(citizenship).toHaveAttribute('data-status', 'FUTURE');
  await expect(citizenship).toContainText('最早 2027-06-12 满足时间条件');
  await expect(page.locator('[data-pathway="NZ-PRV"]')).toHaveAttribute(
    'data-status',
    'NOT_APPLICABLE',
  );
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([]);

  // Switching language keeps the result and translates it.
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: 'Results' })).toBeVisible();
  await expect(citizenship).toContainText(
    'Time requirements met from 2027-06-12',
  );
});
