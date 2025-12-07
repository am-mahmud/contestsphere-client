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
import MyParticipated from "../pages/dashboard/user/MyParticipated";
import MyWinning from "../pages/dashboard/user/MyWinning";
import MyProfile from "../pages/dashboard/user/MyProfile";

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
      { path: '/dashboard/participated', element: <MyParticipated /> },
      { path: '/dashboard/winning', element: <MyWinning /> },
      { path: '/dashboard/profile', element: <MyProfile /> },
      // More dashboard routes will be added here
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);