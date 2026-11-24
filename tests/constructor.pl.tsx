import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });
});

test.describe('добавление ингредиентов в конструктор', function () {
  test('добавление булки и начинки', async ({ page }) => {
    await page.goto('/');

    const burgerConstructor = page.getByTestId('burger-constructor');

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

    await expect(burgerConstructor.getByText(`${bunName} (верх)`)).toBeVisible();

    await expect(burgerConstructor.getByText(`${bunName} (низ)`)).toBeVisible();

    await expect(burgerConstructor.getByText(mainName)).toHaveCount(1);
  });

  test('открытие и закрытие окна ингредиента крестиком', async ({ page }) => {
    await page.goto('/');

    const bunName = 'Краторная булка N-200i';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    await bunCard.getByRole('link').click();

    const modal = page.getByRole('dialog');

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(modal.getByRole('heading', { name: bunName })).toBeVisible();

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

    const modal = page.getByRole('dialog');

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
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

    const modal = page.getByRole('dialog');

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
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

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    const burgerConstructor = page.getByTestId('burger-constructor');

    const bunName = 'Краторная булка N-200i';
    const mainName = 'Говяжий метеорит (отбивная)';

    const bunCard = page.getByRole('listitem').filter({
      hasText: bunName,
    });

    const mainCard = page.getByRole('listitem').filter({
      hasText: mainName,
    });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderModal = page.getByRole('dialog');

    await expect(orderModal.getByRole('heading', { name: '1264' })).toBeVisible();

    await orderModal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(orderModal).not.toBeVisible();

    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(2);

    await expect(burgerConstructor.getByText('Выберите начинку')).toHaveCount(1);
  });
});
