import { test, expect } from '@playwright/test';
import { TEST_USER, login } from './test-utils';

test.describe('Families Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
    await page.waitForTimeout(1000);
  });

  test('should display families page with authentication', async ({ page }) => {
    await page.goto('/families');

    // Wait for authentication and page load
    await expect(page.getByRole('heading', { name: /我的家族|my families/i })).toBeVisible({ timeout: 10000 });
  });

  test('should display create family button', async ({ page }) => {
    await page.goto('/families');

    await expect(page.getByRole('button', { name: /创建新家族|create.*family/i })).toBeVisible({ timeout: 10000 });
  });

  test('should show create family modal', async ({ page }) => {
    await page.goto('/families');

    const createButton = page.getByRole('button', { name: /创建新家族|create.*family/i });
    await createButton.click();

    await expect(page.getByRole('heading', { name: /创建新家族|create.*family/i })).toBeVisible();
    await expect(page.locator('input[placeholder*="家族名称"]')).toBeVisible();
  });

  test('should create a new family successfully', async ({ page }) => {
    await page.goto('/families');

    const createButton = page.getByRole('button', { name: /创建新家族|create.*family/i });
    await createButton.click();

    const uniqueFamilyName = `测试家族${Date.now()}`;

    // Fill family name
    const nameInput = page.locator('input[placeholder*="家族名称"]').first();
    await nameInput.fill(uniqueFamilyName);

    // Try to fill description if textarea exists
    const descTextarea = page.locator('textarea[placeholder*="家族"]').first();
    if (await descTextarea.isVisible()) {
      await descTextarea.fill('这是一个测试家族');
    }

    const submitButton = page.getByRole('button', { name: /创建家族/i });
    await submitButton.click();

    // Wait for family to be created and displayed
    await expect(page.getByText(uniqueFamilyName)).toBeVisible({ timeout: 10000 });
  });

  test('should display family list or empty state', async ({ page }) => {
    await page.goto('/families');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: /我的家族/i })).toBeVisible({ timeout: 10000 });

    // Should show either family cards or empty state
    await page.waitForTimeout(2000);
    const hasContent = await page.locator('a[href^="/families/"], button').first().isVisible();
    expect(hasContent).toBeTruthy();
  });

  test('should close create modal with cancel button', async ({ page }) => {
    await page.goto('/families');

    const createButton = page.getByRole('button', { name: /创建新家族/i });
    await createButton.click();

    const cancelButton = page.getByRole('button', { name: /取消/i });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Modal should be closed
      await page.waitForTimeout(500);
      const modalClosed = await page.getByRole('heading', { name: /创建新家族/i }).isVisible();
      expect(!modalClosed).toBeTruthy();
    }
  });
});
