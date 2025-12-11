import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ManageContests = () => {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const {
    data: contests = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contests', filter],
    queryFn: async () => {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const { data } = await api.get('/api/contests', { params });
      return data.contests;
    },
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/api/contests/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contests']);
      Swal.fire({
        icon: 'success',
        title: 'Contest Approved!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to approve contest',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.put(`/api/contests/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contests']);
      Swal.fire({
        icon: 'success',
        title: 'Contest Rejected!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to reject contest',
      });
    },
  });


  const deleteContestMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/contests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contests']);
      Swal.fire({
        icon: 'success',
        title: 'Contest Deleted!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
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

  const handleApprove = (id, name) => {
    Swal.fire({
      title: 'Approve Contest?',
      text: `"${name}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(id);
      }
    });
  };

  const handleReject = (id, name) => {
    Swal.fire({
      title: 'Reject Contest?',
      text: `"${name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(id);
      }
    });
  };

  const handleDeleteContest = (id, name) => {
    Swal.fire({
      title: 'Delete Contest?',
      html: `<p>"${name}"</p><p class="text-red-600 font-semibold mt-2">This cannot be undone!</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContestMutation.mutate(id);
      }
    });
  };

  const badges = {
    pending: 'badge-warning',
    confirmed: 'badge-success',
    rejected: 'badge-error',
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg text-[#20beff]"></span>
        <p className="mt-4 text-gray-600">Loading contests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="alert alert-error max-w-md mx-auto">
          <span>
            {error.response?.data?.message || 'Failed to load contests. Please try again.'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
          Manage Contests
        </h1>
        <p className="text-gray-600">
          Review, approve, reject, or delete contests
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm rounded-full ${
              filter === s
                ? 'bg-[#20beff] text-white border-none'
                : 'btn-outline border-gray-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {contests.length === 0 ? (
        <div className="card  shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold  mb-2">
              No Contests Found
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No contests have been created yet.'
                : `No ${filter} contests at the moment.`}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{contests.length}</span>{' '}
              {filter === 'all' ? '' : filter} contest{contests.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="overflow-x-auto  rounded-lg shadow">
            <table className="table">
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
              <tbody>
                {contests.map((c) => (
                  <tr key={c._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-bold text-sm">{c.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {c.description.slice(0, 40)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {c.creatorId ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={c.creatorId.photo}
                            alt={c.creatorId.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm">{c.creatorId.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unknown</span>
                      )}
                    </td>

                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {c.contestType}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${badges[c.status]} badge-sm`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="font-semibold text-[#20beff]">
                      ${c.prizeMoney}
                    </td>

                
                    <td className="text-center font-semibold">
                      {c.participantCount}
                    </td>

                    <td>
                      <div className="text-sm">
                        {new Date(c.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      {new Date(c.deadline) < new Date() && (
                        <span className="badge badge-error badge-xs mt-1">
                          Expired
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-1">
                        {c.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(c._id, c.name)}
                              disabled={approveMutation.isPending}
                              className="btn btn-sm btn-ghost text-green-600 hover:bg-green-50 disabled:opacity-50"
                              title="Approve Contest"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(c._id, c.name)}
                              disabled={rejectMutation.isPending}
                              className="btn btn-sm btn-ghost text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
                              title="Reject Contest"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteContest(c._id, c.name)}
                          disabled={deleteContestMutation.isPending}
                          className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Delete Contest"
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
        </>
      )}
    </div>
  );
};

export default ManageContests;