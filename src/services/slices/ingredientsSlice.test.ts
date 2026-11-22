import { describe, expect, it } from '@jest/globals';

import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg',
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  it('должен устанавливать состояние загрузки при pending', () => {
    const action = fetchIngredients.pending('requestId');

    const state = ingredientsReducer(undefined, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  it('должен сохранять ингредиенты при fulfilled', () => {
    const action = fetchIngredients.fulfilled([mockIngredient], 'requestId');

    const state = ingredientsReducer(undefined, action);

    expect(state).toEqual({
      ingredients: [mockIngredient],
      isLoading: false,
      error: null,
    });
  });

  it('должен сохранять ошибку при rejected', () => {
    const action = fetchIngredients.rejected(new Error('Ошибка сервера'), 'requestId');

    const state = ingredientsReducer(undefined, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера',
    });
  });

  it('должен сохранять стандартное сообщение Rejected', () => {
    const action = fetchIngredients.rejected(null, 'requestId');

    const state = ingredientsReducer(undefined, action);

    expect(state.error).toBe('Rejected');
  });
});
