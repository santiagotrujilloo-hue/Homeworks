import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./components/PrivateRoute";
import PrivateLayout from "./layouts/PrivateLayout";
import LoginPage from "./pages/LoginPage";
import ExerciseOnePage from "./pages/ExerciseOnePage";
import ExerciseTwoPage from "./pages/ExerciseTwoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/exercise-one"
            element={<ExerciseOnePage />}
          />

          <Route
            path="/exercise-two"
            element={<ExerciseTwoPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;