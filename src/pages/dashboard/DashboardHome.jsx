import { useAuth } from '../../contexts/AuthContext';
import { FaTrophy, FaUsers, FaClipboardList, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router';

const DashboardHome = () => {
  const { user } = useAuth();

  const getUserStats = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Total Users', value: '150', icon: <FaUsers />, color: 'text-blue-500' },
        { label: 'Total Contests', value: '45', icon: <FaClipboardList />, color: 'text-green-500' },
        { label: 'Pending Approval', value: '8', icon: <FaClipboardList />, color: 'text-yellow-500' },
        { label: 'Total Winners', value: '32', icon: <FaTrophy />, color: 'text-purple-500' },
      ];
    }

    if (user?.role === 'creator') {
      return [
        { label: 'My Contests', value: '5', icon: <FaClipboardList />, color: 'text-blue-500' },
        { label: 'Total Participants', value: '120', icon: <FaUsers />, color: 'text-green-500' },
        { label: 'Active Contests', value: '3', icon: <FaMedal />, color: 'text-yellow-500' },
        { label: 'Completed', value: '2', icon: <FaTrophy />, color: 'text-purple-500' },
      ];
    }

    return [
      { label: 'Participated', value: user?.participationCount || '0', icon: <FaClipboardList />, color: 'text-blue-500' },
      { label: 'Won Contests', value: user?.winCount || '0', icon: <FaTrophy />, color: 'text-green-500' },
      { label: 'Active Contests', value: '3', icon: <FaMedal />, color: 'text-yellow-500' },
      { label: 'Total Spent', value: '$150', icon: <FaUsers />, color: 'text-purple-500' },
    ];
  };

  const stats = getUserStats();

  return (
    <div>
      <title>Dashboard</title>
      
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p >
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold ">{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.role === 'user' && (
              <>
                <Link to="/allcontests" className="btn btn-outline btn-lg">
                  Browse Contests
                </Link>
                <Link to="/dashboard/participated" className="btn btn-outline btn-lg">
                  View My Contests
                </Link>
                <Link to="/dashboard/profile" className="btn btn-outline btn-lg">
                  Edit Profile
                </Link>
              </>
            )}

            {user?.role === 'creator' && (
              <>
                <Link to="/dashboard/add-contest" className="btn bg-[#20beff] text-white btn-lg hover:bg-[#1a9dd9]">
                  Create New Contest
                </Link>
                <Link to="/dashboard/my-contests" className="btn btn-outline btn-lg">
                  Manage Contests
                </Link>
                <Link to="/dashboard/submissions" className="btn btn-outline btn-lg">
                  View Submissions
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link to="/dashboard/manage-users" className="btn bg-[#20beff] text-white btn-lg hover:bg-[#1a9dd9]">
                  Manage Users
                </Link>
                <Link to="/dashboard/manage-contests" className="btn btn-outline btn-lg">
                  Manage Contests
                </Link>
                <Link to="/allcontests" className="btn btn-outline btn-lg">
                  View All Contests
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;