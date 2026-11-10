import { LoginUI } from '@ui-pages';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { SyntheticEvent } from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: Location;
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(
        () => {
          const from = locationState?.from;
          void navigate(from ?? '/', { replace: true });
        },
        () => undefined
      );
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
