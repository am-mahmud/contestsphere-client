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
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/api/contests${params}`);
      return data.contests;
    },
    staleTime: 30000,
    gcTime: 1000 * 60 * 5 
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/api/contests/${id}/status`, { status }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['contests', filter], (oldData) =>
        oldData.map(c => c._id === variables.id ? { ...c, status: variables.status } : c)
      );
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        timer: 1500,
        timerProgressBar: true
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update contest'
      });
    }
  });


  const deleteContestMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/contests/${id}`),
    onSuccess: (data, deletedId) => {
      queryClient.setQueryData(['contests', filter], (oldData) =>
        oldData.filter(c => c._id !== deletedId)
      );
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        timer: 1500,
        timerProgressBar: true
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete contest'
      });
    }
  });

  const handleUpdateStatus = (id, status, name) => {
    Swal.fire({
      title: status === 'confirmed' ? 'Approve Contest?' : 'Reject Contest?',
      text: `"${name}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: status === 'confirmed' ? '#10b981' : '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ id, status });
      }
    });
  };


  const handleDeleteContest = (id, name) => {
    Swal.fire({
      title: 'Delete Contest?',
      text: `"${name}" - This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContestMutation.mutate(id);
      }
    });
  };

  const badges = {
    pending: 'badge-warning',
    confirmed: 'badge-success',
    rejected: 'badge-error'
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Failed to load contests. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Contests</h1>

  
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No contests found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                <tr key={c._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <img src={c.image} alt="" className="w-10 h-10 rounded" />
                      <div>
                        <div className="font-bold text-sm">{c.name}</div>
                        <div className="text-xs opacity-60">
                          {c.description.slice(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {c.creatorId ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={c.creatorId.photo}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{c.creatorId.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-ghost text-xs">
                      {c.contestType}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${badges[c.status]} text-xs`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="font-semibold text-[#20beff]">
                    ${c.prizeMoney}
                  </td>
                  <td className="text-center">{c.participantCount}</td>
                  <td className="text-sm">
                    {new Date(c.deadline).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {c.status === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(c._id, 'confirmed', c.name)
                            }
                            disabled={updateStatusMutation.isPending}
                            className="btn btn-sm btn-ghost text-green-600 disabled:opacity-50"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(c._id, 'rejected', c.name)
                            }
                            disabled={updateStatusMutation.isPending}
                            className="btn btn-sm btn-ghost text-yellow-600 disabled:opacity-50"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteContest(c._id, c.name)}
                        disabled={deleteContestMutation.isPending}
                        className="btn btn-sm btn-ghost text-red-600 disabled:opacity-50"
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
    </div>
  );
};

export default ManageContests;