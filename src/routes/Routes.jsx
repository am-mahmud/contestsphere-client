import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../components/layouts/MainLayout";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllContests from "../pages/AllContests";
import ContestDetails from "../pages/ContestDetails";
import PrivateRoute from "./PrivetRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/allcontests', element: <AllContests /> },
      {
        path: '/contest/:id', element:
          <PrivateRoute>
            <ContestDetails />
          </PrivateRoute>
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardHome /> },
      // More dashboard routes will be added here
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);