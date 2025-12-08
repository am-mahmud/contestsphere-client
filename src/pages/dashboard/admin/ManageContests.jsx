import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

const ManageContests = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all contests
  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['allContests', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/api/contests${params}`);
      return data.contests;
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ contestId, status }) => {
      const { data } = await api.put(`/api/contests/${contestId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allContests']);
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update status',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (contestId) => {
      const { data } = await api.delete(`/api/contests/${contestId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allContests']);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Contest deleted successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete contest',
      });
    },
  });

  const handleApprove = (contestId, contestName) => {
    Swal.fire({
      title: 'Approve Contest?',
      text: `Approve "${contestName}" and make it live?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ contestId, status: 'confirmed' });
      }
    });
  };

  const handleReject = (contestId, contestName) => {
    Swal.fire({
      title: 'Reject Contest?',
      text: `Reject "${contestName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ contestId, status: 'rejected' });
      }
    });
  };

  const handleDelete = (contestId, contestName) => {
    Swal.fire({
      title: 'Delete Contest?',
      text: `Permanently delete "${contestName}"? This cannot be undone!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(contestId);
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      rejected: 'badge-error',
    };
    return badges[status] || 'badge-ghost';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Manage Contests
        </h1>
        <p className="text-gray-600">
          Approve, reject, or delete contests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All Contests
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`btn ${statusFilter === 'pending' ? 'btn-warning' : 'btn-outline'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`btn ${statusFilter === 'confirmed' ? 'btn-success' : 'btn-outline'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`btn ${statusFilter === 'rejected' ? 'btn-error' : 'btn-outline'}`}
        >
          Rejected
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span>Failed to load contests. Please try again.</span>
        </div>
      )}

      {/* Contests Table */}
      {contests && (
        <div className="card bg-white shadow-lg overflow-x-auto">
          <table className="table">
            {/* Table Head */}
            <thead>
              <tr>
                <th>Contest</th>
                <th>Creator</th>
                <th>Type</th>
                <th>Status</th>
                <th>Prize</th>
                <th>Participants</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id} className="hover">
                  {/* Contest Info */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={contest.image} alt={contest.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{contest.name}</div>
                        <div className="text-sm opacity-50">
                          {contest.description.slice(0, 40)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Creator */}
                  <td>
                    {contest.creatorId ? (
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img src={contest.creatorId.photo} alt={contest.creatorId.name} />
                          </div>
                        </div>
                        <span className="text-sm">{contest.creatorId.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown</span>
                    )}
                  </td>

                  {/* Type */}
                  <td>
                    <span className="badge badge-ghost">{contest.contestType}</span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge ${getStatusBadge(contest.status)} capitalize`}>
                      {contest.status}
                    </span>
                  </td>

                  {/* Prize */}
                  <td className="font-semibold text-[#20beff]">
                    ${contest.prizeMoney}
                  </td>

                  {/* Participants */}
                  <td className="text-center font-semibold">
                    {contest.participantCount}
                  </td>

                  {/* Deadline */}
                  <td className="text-sm">
                    {new Date(contest.deadline).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex gap-1">
                      {contest.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(contest._id, contest.name)}
                            className="btn btn-sm btn-ghost text-green-600"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(contest._id, contest.name)}
                            className="btn btn-sm btn-ghost text-yellow-600"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(contest._id, contest.name)}
                        className="btn btn-sm btn-ghost text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {contests && contests.length === 0 && (
        <div className="card bg-white shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Contests Found
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? 'No contests have been created yet'
                : `No ${statusFilter} contests`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContests;