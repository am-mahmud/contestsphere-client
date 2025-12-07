import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestAPI } from '../../../api/contest';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import api from '../../../utils/api';

const MyCreatedContests = () => {
  const queryClient = useQueryClient();

  // Fetch creator's contests
  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['myCreatedContests'],
    queryFn: async () => {
      const { data } = await api.get('/api/contests/my-contests');
      return data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: contestAPI.deleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries(['myCreatedContests']);
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

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#20beff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Created Contests
          </h1>
          <p className="text-gray-600">Manage and track all your contests</p>
        </div>
        <Link to="/dashboard/add-contest" className="btn bg-[#20beff] text-white rounded-full">
          + Create New Contest
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span>Failed to load contests. Please try again.</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && contests && contests.length === 0 && (
        <div className="card bg-white shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Contests Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first contest!
            </p>
            <Link to="/dashboard/add-contest" className="btn bg-[#20beff] text-white rounded-full">
              Create Contest
            </Link>
          </div>
        </div>
      )}

      {/* Contests Table */}
      {contests && contests.length > 0 && (
        <div className="card bg-white shadow-lg overflow-x-auto">
          <table className="table">
            {/* Table Head */}
            <thead>
              <tr>
                <th>Contest</th>
                <th>Type</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Prize</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {contests.map((contest) => {
                const isPending = contest.status === 'pending';
                const isExpired = new Date(contest.deadline) < new Date();

                return (
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
                            {contest.description.slice(0, 30)}...
                          </div>
                        </div>
                      </div>
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

                    {/* Participants */}
                    <td className="text-center font-semibold">
                      {contest.participantCount}
                    </td>

                    {/* Prize */}
                    <td className="font-semibold text-[#20beff]">
                      ${contest.prizeMoney}
                    </td>

                    {/* Deadline */}
                    <td>
                      <div className="text-sm">
                        {new Date(contest.deadline).toLocaleDateString()}
                      </div>
                      {isExpired && (
                        <span className="badge badge-error badge-sm">Expired</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/submissions/${contest._id}`}
                          className="btn btn-sm btn-ghost"
                          title="See Submissions"
                        >
                          <FaEye />
                        </Link>
                        {isPending && (
                          <>
                            <Link
                              to={`/dashboard/edit-contest/${contest._id}`}
                              className="btn btn-sm btn-ghost text-blue-500"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(contest._id)}
                              className="btn btn-sm btn-ghost text-red-500"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                        {!isPending && (
                          <span className="badge badge-sm badge-info">
                            {contest.status === 'confirmed' ? 'Live' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCreatedContests;