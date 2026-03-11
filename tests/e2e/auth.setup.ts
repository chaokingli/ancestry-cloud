import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const testEmail = process.env.E2E_TEST_EMAIL || 'test-e2e@example.com';
  const testPassword = process.env.E2E_TEST_PASSWORD || 'test-password-123';
  const testName = process.env.E2E_TEST_NAME || 'E2E Test User';

  await page.goto('/register');

  await page.getByLabel(/邮箱|email/i).fill(testEmail);
  await page.getByLabel(/密码|password/i).first().fill(testPassword);
  await page.getByLabel(/姓名|name/i).fill(testName);

  await page.getByRole('button', { name: /注册|register/i }).click();

  await expect(page).toHaveURL(/\/(login|register)/, { timeout: 10000 });

  await page.goto('/login');

  await page.getByLabel(/邮箱|email/i).fill(testEmail);
  await page.getByLabel(/密码|password/i).fill(testPassword);

  await page.getByRole('button', { name: /登录|login/i }).click();

  await page.waitForURL(/\/(ancestors|settings|$)/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});