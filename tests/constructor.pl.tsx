import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/fixtures/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });
});

test.describe('добавление ингредиентов в конструктор', function () {
  test('добавление булки и начинки', async ({ page }) => {
    await page.goto('/');

    const bunName = 'Краторная булка N-200i';
    const mainName = 'Говяжий метеорит (отбивная)';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({
      hasText: mainName,
    });

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(page.getByText(mainName)).toHaveCount(2);
  });

  test('открытие и закрытие окна ингредиента крестиком', async ({ page }) => {
    await page.goto('/');

    const bunName = 'Краторная булка N-200i';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('link').click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: bunName })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('закрытие окна ингредиента клавишей Escape', async ({ page }) => {
    await page.goto('/');

    const bunName = 'Краторная булка N-200i';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('link').click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('закрытие окна ингредиента кликом по оверлею', async ({ page }) => {
    await page.goto('/');

    const bunName = 'Краторная булка N-200i';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('link').click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('успешное оформление заказа', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
        }),
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный бургер',
          order: {
            _id: 'test-order-id',
            status: 'done',
            name: 'Краторный бургер',
            createdAt: '2026-11-20T06:00:00.000Z',
            updatedAt: '2026-11-20T06:00:00.000Z',
            number: 12345,
            ingredients: [
              '6acd6b8163765e371c0bd9eb',
              '6acd6b8163765e9acf0bd9ef',
              '6acd6b8163765e371c0bd9eb',
            ],
          },
        }),
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    const bunName = 'Краторная булка N-200i';
    const mainName = 'Говяжий метеорит (отбивная)';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({
      hasText: mainName,
    });

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByRole('heading', { name: '12345' })).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);

    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('heading', { name: '12345' })).not.toBeVisible();
  });
});
