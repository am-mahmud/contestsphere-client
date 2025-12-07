import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../components/layouts/MainLayout";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllContests from "../pages/AllContests";
import ContestDetails from "../pages/ContestDetails";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/allcontests', element: <AllContests /> },
      { path: '/contest/:id',element: <ContestDetails />},
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);