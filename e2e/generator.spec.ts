import { test, expect } from '@playwright/test';

test('has title and loads generator', async ({ page }) => {
  await page.goto('/');

  // Should redirect or have standard layout
  await expect(page).toHaveTitle(/SmartQR Studio/i);

  // Navigate to generator
  await page.goto('/');
  await expect(page.locator('h1').filter({ hasText: 'QR Generator' })).toBeVisible();
});

test('can switch QR content type tabs', async ({ page }) => {
  await page.goto('/');
  
  // Click URL tab
  await page.click('button[role="tab"]:has-text("URL")');
  await expect(page.locator('input[type="url"]')).toBeVisible();

  // Click Text tab
  await page.click('button[role="tab"]:has-text("Text")');
  await expect(page.locator('textarea')).toBeVisible();
});

test('analytics and projects pages load', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.locator('h1').filter({ hasText: 'Usage Analytics' })).toBeVisible();

  await page.goto('/projects');
  await expect(page.locator('h1').filter({ hasText: 'My Projects' })).toBeVisible();
});
