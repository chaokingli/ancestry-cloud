import { Page, BrowserContext } from '@playwright/test';

export const TEST_USER = {
  email: process.env.E2E_TEST_EMAIL || 'test-e2e@example.com',
  password: process.env.E2E_TEST_PASSWORD || 'test-password-123',
  name: process.env.E2E_TEST_NAME || 'E2E Test User',
};

export async function login(page: Page, email?: string, password?: string): Promise<void> {
  await page.goto('/login');

  await page.getByLabel(/邮箱|email/i).fill(email || TEST_USER.email);
  await page.getByLabel(/密码|password/i).fill(password || TEST_USER.password);

  await page.getByRole('button', { name: /登录|login/i }).click();

  await page.waitForURL(/\/(ancestors|settings|$)/, { timeout: 15000 });
}

export async function logout(page: Page): Promise<void> {
  await page.goto('/settings');

  const logoutButton = page.getByRole('button', { name: /退出登录|logout|sign out/i });

  if (await logoutButton.isVisible()) {
    await logoutButton.click();

    await page.waitForURL(/\/(login|$)/, { timeout: 10000 });
  }
}

export async function createAncestor(
  page: Page,
  data: { lastName: string; firstName: string; gender: string }
): Promise<void> {
  await page.goto('/ancestors');

  const createButton = page.getByRole('button', { name: /添加|创建|create|add/i });
  await createButton.click();

  await page.getByLabel(/姓|last name/i).fill(data.lastName);
  await page.getByLabel(/名|first name/i).fill(data.firstName);
  await page.getByLabel(/性别|gender/i).click();

  const genderOption = page.getByRole('option', { name: new RegExp(data.gender, 'i') }).first();
  if (await genderOption.isVisible()) {
    await genderOption.click();
  }

  const submitButton = page.getByRole('button', { name: /保存|submit|create/i });
  await submitButton.click();

  await page.waitForTimeout(1000);
}

export async function deleteAncestor(page: Page, ancestorName: string): Promise<void> {
  await page.goto('/ancestors');

  const ancestorCard = page.getByText(ancestorName);
  if (await ancestorCard.isVisible()) {
    await ancestorCard.click();

    const deleteButton = page.getByRole('button', { name: /删除|delete/i });
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      const confirmButton = page.getByRole('button', { name: /确认|confirm/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        await page.waitForURL(/\/ancestors$/, { timeout: 10000 });
      }
    }
  }
}

export async function performWorship(page: Page, worshipType: string): Promise<void> {
  await page.goto('/ancestors');

  const ancestorCards = page.getByTestId('ancestor-card');
  const count = await ancestorCards.count();

  if (count === 0) {
    throw new Error('No ancestors available for worship');
  }

  await ancestorCards.first().click();

  const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });
  await worshipButton.click();

  const typeButton = page.getByRole('button', { name: new RegExp(worshipType, 'i') });
  await typeButton.click();

  await page.waitForTimeout(3000);
}

export function generateUniqueEmail(): string {
  return `test-${Date.now()}@example.com`;
}

export function generateUniqueName(prefix: string = 'Test'): string {
  return `${prefix}${Date.now()}`;
}

export async function clearBrowserStorage(context: BrowserContext): Promise<void> {
  await context.clearCookies();

  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.close();
}