import { describe, expect, it } from '@jest/globals';

import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

describe('constructorSlice', () => {
  const mockBun = {
    _id: 'bun-1',
    id: 'constructor-bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'bun.jpg',
    image_large: 'bun-large.jpg',
    image_mobile: 'bun-mobile.jpg',
  };

  const mockMain = {
    _id: 'main-1',
    id: 'constructor-main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 200,
    price: 200,
    image: 'main.jpg',
    image_large: 'main-large.jpg',
    image_mobile: 'main-mobile.jpg',
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('должен добавлять булку в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state.bun).toEqual(
      expect.objectContaining({
        ...mockBun,
        id: expect.any(String),
      })
    );
  });

  it('должен добавлять начинку в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mockMain,
        id: expect.any(String),
      })
    );
  });

  it('должен удалять начинку по id', () => {
    const stateWithIngredient = constructorReducer(undefined, addIngredient(mockMain));

    const ingredientId = stateWithIngredient.ingredients[0].id;

    const state = constructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен перемещать начинку в конструкторе', () => {
    const stateWithFirst = constructorReducer(undefined, addIngredient(mockMain));
    const stateWithTwo = constructorReducer(
      stateWithFirst,
      addIngredient({
        ...mockMain,
        _id: 'main-2',
        name: 'Вторая начинка',
      })
    );

    const state = constructorReducer(stateWithTwo, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0].name).toBe('Вторая начинка');
    expect(state.ingredients[1].name).toBe('Тестовая начинка');
  });

  it('должен очищать конструктор', () => {
    const stateWithBun = constructorReducer(undefined, addIngredient(mockBun));
    const stateWithIngredients = constructorReducer(
      stateWithBun,
      addIngredient(mockMain)
    );

    const state = constructorReducer(stateWithIngredients, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
