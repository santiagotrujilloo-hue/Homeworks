import { Route, Routes } from 'react-router-dom';
import Orders from '../pages/Orders/Orders';
import OrderTracking from '../pages/OrderTracking/OrderTracking';

// Rutas privadas del cliente: /cuenta/...
export default function UserRoutes() {
  return (
    <Routes>
      <Route path="pedidos" element={<Orders />} />
      <Route path="pedidos/:id" element={<OrderTracking />} />
    </Routes>
  );
}
