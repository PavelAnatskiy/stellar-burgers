import { Preloader, IngredientDetailsUI } from '@ui';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (ingredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
