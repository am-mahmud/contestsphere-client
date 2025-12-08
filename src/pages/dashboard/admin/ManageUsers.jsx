import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { FaUserShield, FaUser, FaPencilAlt } from 'react-icons/fa';
import { MdWorkspacePremium } from 'react-icons/md';
import { useState } from 'react';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch all users
  const { data, isLoading, error } = useQuery({
    queryKey: ['allUsers', page],
    queryFn: async () => {
      const { data } = await api.get(`/api/users?page=${page}&limit=${limit}`);
      return data;
    },
  });

  // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await api.put(`/api/users/${userId}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      Swal.fire({
        icon: 'success',
        title: 'Role Updated!',
        text: 'User role has been changed successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update role',
      });
    },
  });

  const handleRoleChange = (userId, currentRole, userName) => {
    Swal.fire({
      title: 'Change User Role',
      html: `
        <p>Change role for <strong>${userName}</strong></p>
        <select id="roleSelect" class="swal2-select">
          <option value="user" ${currentRole === 'user' ? 'selected' : ''}>User</option>
          <option value="creator" ${currentRole === 'creator' ? 'selected' : ''}>Creator</option>
          <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonColor: '#20beff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update Role',
      preConfirm: () => {
        const role = document.getElementById('roleSelect').value;
        return role;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        changeRoleMutation.mutate({ userId, role: result.value });
      }
    });
  };

  const getRoleBadge = (role) => {
    const badges = {
      user: { color: 'badge-info', icon: <FaUser /> },
      creator: { color: 'badge-primary', icon: <MdWorkspacePremium /> },
      admin: { color: 'badge-error', icon: <FaUserShield /> },
    };
    return badges[role] || badges.user;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Manage Users
        </h1>
        <p className="text-gray-600">
          View all users and manage their roles
        </p>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{data.total}</p>
                </div>
                <FaUser className="text-4xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Page</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.page} / {data.pages}
                  </p>
                </div>
                <MdWorkspacePremium className="text-4xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Per Page</p>
                  <p className="text-3xl font-bold text-gray-900">{limit}</p>
                </div>
                <FaUserShield className="text-4xl text-red-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span>Failed to load users. Please try again.</span>
        </div>
      )}

      {/* Users Table */}
      {data && data.users && (
        <>
          <div className="card bg-white shadow-lg overflow-x-auto">
            <table className="table">
              {/* Table Head */}
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Participations</th>
                  <th>Wins</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {data.users.map((user) => {
                  const badge = getRoleBadge(user.role);
                  return (
                    <tr key={user._id} className="hover">
                      {/* User Info */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={user.photo} alt={user.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span className="text-sm">{user.email}</span>
                      </td>

                      {/* Role */}
                      <td>
                        <span className={`badge ${badge.color} gap-1 capitalize`}>
                          {badge.icon} {user.role}
                        </span>
                      </td>

                      {/* Participations */}
                      <td className="text-center font-semibold">
                        {user.participationCount || 0}
                      </td>

                      {/* Wins */}
                      <td className="text-center font-semibold text-green-600">
                        {user.winCount || 0}
                      </td>

                      {/* Joined Date */}
                      <td>
                        <span className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          onClick={() => handleRoleChange(user._id, user.role, user.name)}
                          className="btn btn-sm btn-ghost text-blue-500"
                          title="Change Role"
                        >
                          <FaPencilAlt /> Change Role
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {page} of {data.pages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;