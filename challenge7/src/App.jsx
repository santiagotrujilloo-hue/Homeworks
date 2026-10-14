import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AppLayout from "./layouts/AppLayout";
import TasksProvider from "./context/TasksProvider";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Solo para quien NO ha iniciado sesión */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protegidas: requieren sesión de Firebase */}
        <Route
          element={
            <PrivateRoute>
              <TasksProvider>
                <AppLayout />
              </TasksProvider>
            </PrivateRoute>
          }
        >
          <Route path="/tasks" element={<TasksPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
