import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaUser,
  FaTrophy,
  FaPlus,
  FaListAlt,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
  FaTasks,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import Swal from 'sweetalert2';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        text: 'See you soon',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Logout failed',
      });
    }
  };

  // Menu items based on role
  const getUserMenuItems = () => {
    const commonItems = [
      { path: '/', icon: <FaHome />, label: 'Home', external: true },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { path: '/dashboard/manage-users', icon: <FaUsers />, label: 'Manage Users' },
        { path: '/dashboard/manage-contests', icon: <FaClipboardList />, label: 'Manage Contests' },
      ];
    }

    if (user?.role === 'creator') {
      return [
        ...commonItems,
        { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
        { path: '/dashboard/add-contest', icon: <FaPlus />, label: 'Add Contest' },
        { path: '/dashboard/my-contests', icon: <FaListAlt />, label: 'My Created Contests' },
        { path: '/dashboard/submissions', icon: <FaTasks />, label: 'Submitted Tasks' },
        { path: '/dashboard/profile', icon: <FaUser />, label: 'My Profile' },
      ];
    }

    // Default user
    return [
      ...commonItems,
      { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
      { path: '/dashboard/participated', icon: <FaChartBar />, label: 'My Participated' },
      { path: '/dashboard/winning', icon: <FaTrophy />, label: 'My Winning' },
      { path: '/dashboard/profile', icon: <FaUser />, label: 'My Profile' },
    ];
  };

  const menuItems = getUserMenuItems();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main Content */}
        <div className="drawer-content flex flex-col">
          {/* Mobile Header */}
          <div className="navbar bg-base-100 lg:hidden sticky top-0 z-40 shadow-md">
            <div className="flex-none">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <span className="text-xl font-bold text-[#20beff]">Dashboard</span>
            </div>
            <div className="flex-none">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.photo || 'https://via.placeholder.com/40'} alt={user?.name} />
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-50">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
            {/* Sidebar Header */}
            <div className="mb-8 p-4">
              <h2 className="text-2xl font-bold text-[#20beff] mb-2">🌐 ContestSphere</h2>
              <div className="flex items-center gap-3 mt-4 p-3 bg-base-200 rounded-lg">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={user?.photo || 'https://via.placeholder.com/48'} alt={user?.name} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{user?.name}</p>
                  <p className="text-xs text-base-content/70 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  {item.external ? (
                    <Link to={item.path} className="flex items-center gap-3 hover:bg-[#20beff] hover:text-white rounded-lg">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 hover:bg-[#20beff] hover:text-white rounded-lg"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-base-300">
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error w-full flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;