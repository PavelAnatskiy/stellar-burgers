import { RegisterUI } from '@ui-pages';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { SyntheticEvent } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(registerUser({ email, password, name: userName }))
      .unwrap()
      .then(
        () => {
          void navigate('/', { replace: true });
        },
        () => undefined
      );
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
