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
import AddContest from "../pages/dashboard/creator/AddContest";
import MyCreatedContests from "../pages/dashboard/creator/MyCreatedContests";
import EditContest from "../pages/dashboard/creator/EditContest";
import SubmittedTasks from "../pages/dashboard/creator/SubmittedTasks";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageContests from "../pages/dashboard/admin/ManageContests";
import Leaderboard from "../pages/Leaderboard";
import Documentation from "../pages/Documentation";
import About from "../pages/About";
import Contact from "../pages/Contact";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/allcontests', element: <AllContests /> },
      { path: '/leaderboard', element: <Leaderboard /> },
      { path: '/documentation', element: <Documentation /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact/> },
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
      { path: '/dashboard/add-contest', element: <AddContest /> },
      { path: '/dashboard/my-contests', element: <MyCreatedContests /> },
      { path: '/dashboard/edit-contest/:id', element: <EditContest /> },
      { path: '/dashboard/submissions', element: <SubmittedTasks /> },
      { path: '/dashboard/submissions/:id', element: <SubmittedTasks /> },
      { path: '/dashboard/manage-users', element: <ManageUsers /> },
      { path: '/dashboard/manage-contests', element: <ManageContests /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);