import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';

// Rutas privadas del administrador: /admin/...
export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
    </Routes>
  );
}
