import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

import DashboardLayout from "./layouts/DashboardLayout";
import menuTree from "./data/menuTree";

function createRoutes(items) {
  const routes = [];

  items.forEach((item) => {
    if (item.link && item.component) {
      const Component = item.component;

      routes.push(
        <Route
          key={item.link}
          path={item.link}
          element={<Component />}
        />
      );
    }

    if (item.children?.length > 0) {
      routes.push(
        ...createRoutes(item.children)
      );
    }
  });

  return routes;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {createRoutes(menuTree)}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;