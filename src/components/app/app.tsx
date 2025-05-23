import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Location, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch } from '@store';
import { useEffect, ReactNode } from 'react';
import { getUser } from '../../services/slices/userSlice/userSlice';
import { getIngredients } from '../../services/slices/ingredientSlice/ingredientSlice';
import { CenteringComponent } from '../centering-component/centering-component';

interface RouteConfig {
  path: string;
  element: ReactNode | ((location: Location) => ReactNode);
}

interface ModalRouteConfig extends RouteConfig {
  title: string | ((location: Location) => string);
  element: ReactNode;
  protected?: boolean;
}

interface ModalRoutesProps {
  onClose: () => void;
}

// Конфигурация маршрутов
const publicRoutes: RouteConfig[] = [
  { path: '/', element: <ConstructorPage /> },
  { path: '/feed', element: <Feed /> },
  {
    path: '/feed/:number',
    element: (location: Location) => (
      <CenteringComponent title={`#${location.pathname.match(/\d+/)}`}>
        <OrderInfo />
      </CenteringComponent>
    )
  },
  {
    path: '/ingredients/:id',
    element: () => (
      <CenteringComponent title="Детали ингредиента">
        <IngredientDetails />
      </CenteringComponent>
    )
  }
];

const unAuthRoutes: RouteConfig[] = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> }
];

const authRoutes: RouteConfig[] = [
  { path: '/profile', element: <Profile /> },
  { path: '/profile/orders', element: <ProfileOrders /> },
  {
    path: '/profile/orders/:number',
    element: (location: Location) => (
      <CenteringComponent title={`#${location.pathname.match(/\d+/)}`}>
        <OrderInfo />
      </CenteringComponent>
    )
  }
];

const modalRoutes: ModalRouteConfig[] = [
  {
    path: '/ingredients/:id',
    title: 'Детали ингредиента',
    element: <IngredientDetails />
  },
  {
    path: '/feed/:number',
    title: (location: Location) => `#${location.pathname.match(/\d+/)}`,
    element: <OrderInfo />
  },
  {
    path: '/profile/orders/:number',
    title: (location: Location) => `#${location.pathname.match(/\d+/)}`,
    element: <OrderInfo />,
    protected: true
  }
];

const ModalRoutes: React.FC<ModalRoutesProps> = ({ onClose }) => {
  const location = useLocation();
  
  return (
    <Routes>
      {modalRoutes.map(({ path, title, element, protected: isProtected }) => {
        const modalElement = (
          <Modal
            title={typeof title === 'function' ? title(location) : title}
            onClose={onClose}
          >
            {element}
          </Modal>
        );

        return isProtected ? (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute onlyUnAuth={false} element={modalElement} />
            }
          />
        ) : (
          <Route key={path} path={path} element={modalElement} />
        );
      })}
    </Routes>
  );
};

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {publicRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={typeof element === 'function' ? element(location) : element}
          />
        ))}
        
        <Route element={<ProtectedRoute onlyUnAuth />}>
          {unAuthRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route element={<ProtectedRoute onlyUnAuth={false} />}>
          {authRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={typeof element === 'function' ? element(location) : element}
            />
          ))}
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && <ModalRoutes onClose={() => history.back()} />}
    </div>
  );
};

export default App;
