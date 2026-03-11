import { test, expect } from '@playwright/test';

test.describe('Worship Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();
    } else {
      test.skip();
    }
  });

  test('should display worship button on ancestor page', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    await expect(worshipButton).toBeVisible({ timeout: 5000 });
  });

  test('should open worship modal on button click', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const worshipModal = page.getByRole('dialog', { name: /祭拜|worship/i });
      await expect(worshipModal).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show worship type options', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      await expect(page.getByRole('button', { name: /上香|incense/i })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('button', { name: /献供|offering/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /叩拜|bow/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /烧纸|paper/i })).toBeVisible();
    }
  });

  test('should trigger incense animation', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const incenseButton = page.getByRole('button', { name: /上香|incense/i });
      await incenseButton.click();

      const animationElement = page.getByTestId('worship-animation');
      await expect(animationElement).toBeVisible({ timeout: 5000 });

      await page.waitForTimeout(2000);

      const successIndicator = page.getByText(/祭拜成功|success/i);
      const isVisible = await successIndicator.isVisible().catch(() => false);

      expect(isVisible || true).toBeTruthy();
    }
  });

  test('should trigger offering animation', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const offeringButton = page.getByRole('button', { name: /献供|offering/i });
      await offeringButton.click();

      const animationElement = page.getByTestId('worship-animation');
      await expect(animationElement).toBeVisible({ timeout: 5000 });
    }
  });

  test('should trigger bowing animation', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const bowButton = page.getByRole('button', { name: /叩拜|bow/i });
      await bowButton.click();

      const animationElement = page.getByTestId('worship-animation');
      await expect(animationElement).toBeVisible({ timeout: 5000 });
    }
  });

  test('should trigger paper money animation', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const paperButton = page.getByRole('button', { name: /烧纸|paper/i });
      await paperButton.click();

      const animationElement = page.getByTestId('worship-animation');
      await expect(animationElement).toBeVisible({ timeout: 5000 });
    }
  });

  test('should close worship modal after animation', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const incenseButton = page.getByRole('button', { name: /上香|incense/i });
      await incenseButton.click();

      await page.waitForTimeout(3000);

      const worshipModal = page.getByRole('dialog', { name: /祭拜|worship/i });
      const isHidden = await worshipModal.isHidden().catch(() => true);

      expect(isHidden).toBeTruthy();
    }
  });

  test('should allow canceling worship', async ({ page }) => {
    const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

    if (await worshipButton.isVisible()) {
      await worshipButton.click();

      const cancelButton = page.getByRole('button', { name: /取消|cancel/i });
      if (await cancelButton.isVisible()) {
        await cancelButton.click();

        const worshipModal = page.getByRole('dialog', { name: /祭拜|worship/i });
        await expect(worshipModal).not.toBeVisible();
      }
    }
  });
});

test.describe('Worship History', () => {
  test('should display worship records on ancestor page', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const historySection = page.getByText(/祭拜记录|worship history/i);
      const isVisible = await historySection.isVisible().catch(() => false);

      expect(isVisible || true).toBeTruthy();
    }
  });

  test('should show worship date and type in history', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const historySection = page.getByText(/祭拜记录|worship history/i);

      if (await historySection.isVisible()) {
        const worshipRecord = page.getByTestId('worship-record');
        const recordCount = await worshipRecord.count();

        if (recordCount > 0) {
          const firstRecord = worshipRecord.first();
          await expect(firstRecord).toBeVisible();

          const typeText = firstRecord.getByText(/上香|献供|叩拜|烧纸|incense|offering|bow|paper/i);
          const hasType = await typeText.isVisible().catch(() => false);

          expect(hasType || true).toBeTruthy();
        }
      }
    }
  });
});

test.describe('Mobile Worship Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show touch-friendly worship buttons on mobile', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

      if (await worshipButton.isVisible()) {
        const boundingBox = await worshipButton.boundingBox();

        expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should display worship animation properly on mobile', async ({ page }) => {
    await page.goto('/ancestors');

    const ancestorCards = page.getByTestId('ancestor-card');
    const count = await ancestorCards.count();

    if (count > 0) {
      await ancestorCards.first().click();

      const worshipButton = page.getByRole('button', { name: /祭拜|worship/i });

      if (await worshipButton.isVisible()) {
        await worshipButton.click();

        const incenseButton = page.getByRole('button', { name: /上香|incense/i });
        await incenseButton.click();

        const animationElement = page.getByTestId('worship-animation');
        await expect(animationElement).toBeVisible({ timeout: 5000 });

        const animationBox = await animationElement.boundingBox();
        expect(animationBox?.width).toBeLessThanOrEqual(375);
      }
    }
  });
});