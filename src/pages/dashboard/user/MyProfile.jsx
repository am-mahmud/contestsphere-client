import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import api from '../../../utils/api';

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      photo: user?.photo || '',
      bio: user?.bio || '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate win percentage
  const winPercentage = user?.participationCount > 0
    ? ((user.winCount / user.participationCount) * 100).toFixed(1)
    : 0;

  // Chart data
  const chartData = [
    { name: 'Wins', value: user?.winCount || 0, color: '#22c55e' },
    { name: 'Losses', value: (user?.participationCount || 0) - (user?.winCount || 0), color: '#ef4444' },
  ];

  // Update profile
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.put('/api/users/me', data);
      setUser(response.data.user);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and track your performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Update Profile</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="input input-bordered rounded-full"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                    })}
                  />
                  {errors.name && (
                    <span className="text-error text-sm mt-1">{errors.name.message}</span>
                  )}
                </div>

                {/* Photo URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered rounded-full"
                    {...register('photo', {
                      required: 'Photo URL is required',
                      pattern: {
                        value: /^https?:\/\/.+\..+/i,
                        message: 'Invalid URL',
                      },
                    })}
                  />
                  {errors.photo && (
                    <span className="text-error text-sm mt-1">{errors.photo.message}</span>
                  )}
                </div>

                {/* Bio (Extra Field) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Bio (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered h-24"
                    {...register('bio')}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn bg-[#20beff] text-white rounded-full hover:bg-[#1a9dd9]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stats & Chart Sidebar */}
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-[#20beff] ring-offset-2">
                  <img src={user?.photo} alt={user?.name} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <div className="badge badge-primary mt-2 capitalize">{user?.role}</div>
            </div>
          </div>

          {/* Win Rate Chart */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Performance Stats</h3>

              {/* Win Percentage */}
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-[#20beff]">{winPercentage}%</p>
                <p className="text-sm text-gray-600">Win Rate</p>
              </div>

              {/* Pie Chart */}
              {user?.participationCount > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No contest data yet</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{user?.participationCount || 0}</p>
                  <p className="text-xs text-gray-600">Participated</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">{user?.winCount || 0}</p>
                  <p className="text-xs text-gray-600">Won</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;