import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.userOrders.orders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
