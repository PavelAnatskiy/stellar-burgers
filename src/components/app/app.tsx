import {
  AppHeader,
  ProtectedRouter,
  Modal,
  IngredientDetails,
  OrderInfo,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { checkUserAuth } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

import '../../index.css';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationState = location.state as TLocationState | null;
  const background = locationState?.background;

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main>
        <Routes location={background ?? location}>
          <Route path="/" element={<ConstructorPage />} />
          <Route path="/feed" element={<Feed />} />

          <Route
            path="/login"
            element={
              <ProtectedRouter onlyUnAuth>
                <Login />
              </ProtectedRouter>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRouter onlyUnAuth>
                <Register />
              </ProtectedRouter>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRouter onlyUnAuth>
                <ForgotPassword />
              </ProtectedRouter>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRouter onlyUnAuth>
                <ResetPassword />
              </ProtectedRouter>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRouter>
                <Profile />
              </ProtectedRouter>
            }
          />
          <Route
            path="/profile/orders"
            element={
              <ProtectedRouter>
                <ProfileOrders />
              </ProtectedRouter>
            }
          />
          <Route path="/ingredients/:id" element={<IngredientDetails />} />
          <Route path="/feed/:number" element={<OrderInfo />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRouter>
                <OrderInfo />
              </ProtectedRouter>
            }
          />

          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title="Детали ингредиента"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={
              <Modal
                title="Информация о заказе"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRouter>
                <Modal
                  title="Информация о заказе"
                  onClose={() => {
                    void navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRouter>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
