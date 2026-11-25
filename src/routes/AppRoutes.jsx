import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Menu from '../pages/Menu/Menu';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import RequireAuth from '../components/Shared/RequireAuth';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route
        path="/cuenta/*"
        element={
          <RequireAuth>
            <UserRoutes />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RequireAuth admin>
            <AdminRoutes />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
