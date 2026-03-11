import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display registration form', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByLabel(/邮箱|email/i)).toBeVisible();
    await expect(page.getByLabel(/密码|password/i).first()).toBeVisible();
    await expect(page.getByLabel(/姓名|name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /注册|register/i })).toBeVisible();
  });

  test('should register a new user successfully', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto('/register');

    await page.getByLabel(/邮箱|email/i).fill(uniqueEmail);
    await page.getByLabel(/密码|password/i).first().fill('password12345678');
    await page.getByLabel(/姓名|name/i).fill('Test User');

    await page.getByRole('button', { name: /注册|register/i }).click();

    await expect(page).toHaveURL(/\/(login|ancestors|settings)/, { timeout: 10000 });
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/邮箱|email/i).fill('invalid-email');
    await page.getByLabel(/密码|password/i).first().fill('password12345678');
    await page.getByLabel(/姓名|name/i).fill('Test User');

    await page.getByRole('button', { name: /注册|register/i }).click();

    await expect(page.getByText(/邮箱格式不正确|invalid email/i)).toBeVisible();
  });

  test('should show error for short password', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/邮箱|email/i).fill('test@example.com');
    await page.getByLabel(/密码|password/i).first().fill('short');
    await page.getByLabel(/姓名|name/i).fill('Test User');

    await page.getByRole('button', { name: /注册|register/i }).click();

    await expect(page.getByText(/密码至少需要8个字符|password.*8/i)).toBeVisible();
  });

  test('should show error for missing fields', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: /注册|register/i }).click();

    await expect(page.getByText(/请填写所有必需字段|required/i)).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    const existingEmail = 'test-e2e@example.com';

    await page.goto('/register');

    await page.getByLabel(/邮箱|email/i).fill(existingEmail);
    await page.getByLabel(/密码|password/i).first().fill('password12345678');
    await page.getByLabel(/姓名|name/i).fill('Test User');

    await page.getByRole('button', { name: /注册|register/i }).click();

    await expect(page.getByText(/该邮箱已被注册|already registered/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('User Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel(/邮箱|email/i)).toBeVisible();
    await expect(page.getByLabel(/密码|password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /登录|login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /注册|register/i })).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const testEmail = process.env.E2E_TEST_EMAIL || 'test-e2e@example.com';
    const testPassword = process.env.E2E_TEST_PASSWORD || 'test-password-123';

    await page.goto('/login');

    await page.getByLabel(/邮箱|email/i).fill(testEmail);
    await page.getByLabel(/密码|password/i).fill(testPassword);

    await page.getByRole('button', { name: /登录|login/i }).click();

    await expect(page).toHaveURL(/\/(ancestors|settings|$)/, { timeout: 15000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/邮箱|email/i).fill('nonexistent@example.com');
    await page.getByLabel(/密码|password/i).fill('wrongpassword');

    await page.getByRole('button', { name: /登录|login/i }).click();

    await expect(page.getByText(/邮箱或密码错误|invalid/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('User Logout', () => {
  test('should logout successfully', async ({ page }) => {
    await page.goto('/settings');

    const logoutButton = page.getByRole('button', { name: /退出登录|logout|sign out/i });

    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10000 });
    }
  });
});