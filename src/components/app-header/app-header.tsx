import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

type TLocationState = {
  background?: {
    pathname?: string;
  };
};

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector((state) => state.user.user?.name?.split(' ')[0]);
  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  const isConstructorActive =
    location.pathname === '/' ||
    (location.pathname.startsWith('/ingredients/') &&
      locationState?.background?.pathname === '/');

  return <AppHeaderUI userName={userName} isConstructorActive={isConstructorActive} />;
};
