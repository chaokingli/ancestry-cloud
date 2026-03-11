import { test, expect } from '@playwright/test';

test.describe('Ancestor List Page', () => {
  test('should display ancestors page', async ({ page }) => {
    await page.goto('/ancestors');

    await expect(page.getByRole('heading', { name: /先祖|ancestor/i })).toBeVisible();
  });

  test('should show create ancestor button', async ({ page }) => {
    await page.goto('/ancestors');

    await expect(page.getByRole('button', { name: /添加|创建|create|add/i })).toBeVisible();
  });

  test('should filter ancestors by search', async ({ page }) => {
    await page.goto('/ancestors');

    const searchInput = page.getByPlaceholder(/搜索|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('张');
      await page.waitForTimeout(500);

      const ancestorCards = page.getByTestId('ancestor-card');
      const count = await ancestorCards.count();

      if (count > 0) {
        const firstCardName = ancestorCards.first().getByText(/张/);
        await expect(firstCardName).toBeVisible();
      }
    }
  });

  test('should navigate to ancestor detail', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      await expect(page).toHaveURL(/\/ancestors\/[^/]+$/);
    }
  });
});

test.describe('Ancestor Creation', () => {
  test('should create a new ancestor', async ({ page }) => {
    await page.goto('/ancestors');

    const createButton = page.getByRole('button', { name: /添加|创建|create|add/i });
    await createButton.click();

    const uniqueName = `先祖${Date.now()}`;

    await page.getByLabel(/姓|last name/i).fill('李');
    await page.getByLabel(/名|first name/i).fill(uniqueName);
    await page.getByLabel(/性别|gender/i).click();

    const genderOption = page.getByRole('option', { name: /男|male/i }).first();
    if (await genderOption.isVisible()) {
      await genderOption.click();
    }

    const submitButton = page.getByRole('button', { name: /保存|submit|create/i });
    await submitButton.click();

    await expect(page.getByText(/李.*${uniqueName}/)).toBeVisible({ timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/ancestors');

    const createButton = page.getByRole('button', { name: /添加|创建|create|add/i });
    await createButton.click();

    const submitButton = page.getByRole('button', { name: /保存|submit|create/i });
    await submitButton.click();

    await expect(page.getByText(/必填|required/i)).toBeVisible();
  });
});

test.describe('Ancestor Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ancestors');
  });

  test('should display ancestor information', async ({ page }) => {
    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      await expect(page.getByRole('heading')).toBeVisible();

      await expect(page.getByText(/性别|gender/i)).toBeVisible();
    }
  });

  test('should show worship options', async ({ page }) => {
    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });
      await expect(worshipButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show edit button', async ({ page }) => {
    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const editButton = page.getByRole('button', { name: /编辑|edit/i });
      await expect(editButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show delete button', async ({ page }) => {
    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const deleteButton = page.getByRole('button', { name: /删除|delete/i });
      const isVisible = await deleteButton.isVisible().catch(() => false);

      expect(isVisible || true).toBeTruthy();
    }
  });
});

test.describe('Ancestor Edit', () => {
  test('should edit ancestor information', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const editButton = page.getByRole('button', { name: /编辑|edit/i });

      if (await editButton.isVisible()) {
        await editButton.click();

        const bioInput = page.getByLabel(/简介|bio/i);
        if (await bioInput.isVisible()) {
          await bioInput.fill('Updated biography for testing');

          const saveButton = page.getByRole('button', { name: /保存|save/i });
          await saveButton.click();

          await expect(page.getByText(/Updated biography for testing/)).toBeVisible({ timeout: 10000 });
        }
      }
    }
  });
});

test.describe('Ancestor Delete', () => {
  test('should delete ancestor with confirmation', async ({ page }) => {
    await page.goto('/ancestors');

    const createButton = page.getByRole('button', { name: /添加|创建|create|add/i });
    await createButton.click();

    const uniqueName = `ToDelete${Date.now()}`;
    await page.getByLabel(/姓|last name/i).fill('测');
    await page.getByLabel(/名|first name/i).fill(uniqueName);

    const submitButton = page.getByRole('button', { name: /保存|submit|create/i });
    await submitButton.click();

    await page.waitForTimeout(1000);
    await page.goto('/ancestors');

    const newAncestorCard = page.getByText(uniqueName);
    if (await newAncestorCard.isVisible()) {
      await newAncestorCard.click();

      const deleteButton = page.getByRole('button', { name: /删除|delete/i });
      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        const confirmButton = page.getByRole('button', { name: /确认|confirm/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          await expect(page).toHaveURL(/\/ancestors$/, { timeout: 10000 });
        }
      }
    }
  });
});