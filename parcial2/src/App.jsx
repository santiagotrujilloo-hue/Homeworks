import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import FileSystemProvider from "./context/FileSystemProvider";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExplorerPage from "./pages/ExplorerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Solo usuarios registrados pueden ver y crear carpetas / archivos */}
        <Route
          element={
            <PrivateRoute>
              <FileSystemProvider>
                <AppLayout />
              </FileSystemProvider>
            </PrivateRoute>
          }
        >
          <Route path="/explorador" element={<ExplorerPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/explorador" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
