import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FaTrophy, FaUser, FaEnvelope, FaCalendarAlt, FaLink } from 'react-icons/fa';

const SubmittedTasks = () => {
  const queryClient = useQueryClient();
  const [selectedContest, setSelectedContest] = useState('');

  // Fetch creator's contests
  const { data: contests, isLoading: loadingContests } = useQuery({
    queryKey: ['myCreatedContests'],
    queryFn: async () => {
      const { data } = await api.get('/api/contests/my-contests');
      return data;
    },
  });

  // Fetch submissions for selected contest
  const { data: submissions, isLoading: loadingSubmissions } = useQuery({
    queryKey: ['submissions', selectedContest],
    queryFn: async () => {
      const { data } = await api.get(`/api/participations/contest/${selectedContest}`);
      return data;
    },
    enabled: !!selectedContest,
  });

  // Declare winner mutation
  const declareWinnerMutation = useMutation({
    mutationFn: async ({ contestId, participationId }) => {
      const { data } = await api.post(
        `/api/participations/declare-winner/${contestId}/${participationId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['submissions', selectedContest]);
      queryClient.invalidateQueries(['myCreatedContests']);
      Swal.fire({
        icon: 'success',
        title: 'Winner Declared!',
        text: 'The winner has been successfully announced',
        showConfirmButton: false,
        timer: 2000,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to declare winner',
      });
    },
  });

  const handleDeclareWinner = (participationId) => {
    Swal.fire({
      title: 'Declare Winner?',
      text: 'This action cannot be undone. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#20beff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, declare winner!',
    }).then((result) => {
      if (result.isConfirmed) {
        declareWinnerMutation.mutate({
          contestId: selectedContest,
          participationId,
        });
      }
    });
  };

  // Filter only submitted tasks
  const submittedTasks = submissions?.filter((s) => s.submittedTask) || [];

  // Get selected contest details
  const selectedContestData = contests?.find((c) => c._id === selectedContest);
  const isExpired = selectedContestData
    ? new Date(selectedContestData.deadline) < new Date()
    : false;
  const hasWinner = selectedContestData?.winnerId;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Submitted Tasks
        </h1>
        <p className="text-gray-600">Review submissions and declare winners</p>
      </div>

      {/* Contest Selection */}
      <div className="card bg-white shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Select Contest</h2>
          {loadingContests ? (
            <div className="skeleton h-12 w-full"></div>
          ) : (
            <select
              className="select select-bordered w-full"
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
            >
              <option value="">Choose a contest to view submissions</option>
              {contests?.map((contest) => (
                <option key={contest._id} value={contest._id}>
                  {contest.name} ({contest.participantCount} participants)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Contest Info Banner */}
      {selectedContestData && (
        <div className="alert mb-6 bg-base-200">
          <div className="flex items-center gap-4 w-full">
            <img
              src={selectedContestData.image}
              alt={selectedContestData.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-grow">
              <h3 className="font-bold text-lg">{selectedContestData.name}</h3>
              <div className="flex gap-4 text-sm">
                <span>Prize: ${selectedContestData.prizeMoney}</span>
                <span>•</span>
                <span>Participants: {selectedContestData.participantCount}</span>
                <span>•</span>
                <span className={isExpired ? 'text-error' : 'text-warning'}>
                  {isExpired ? 'Ended' : 'Active'}
                </span>
              </div>
            </div>
            {hasWinner && (
              <div className="badge badge-success gap-2">
                <FaTrophy /> Winner Declared
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submissions List */}
      {selectedContest && (
        <>
          {loadingSubmissions ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-32 w-full"></div>
              ))}
            </div>
          ) : submittedTasks.length > 0 ? (
            <div className="space-y-4">
              {submittedTasks.map((submission) => {
                const isWinner =
                  selectedContestData?.winnerId &&
                  selectedContestData.winnerId.toString() === submission.userId._id.toString();

                return (
                  <div
                    key={submission._id}
                    className={`card bg-white shadow-lg ${
                      isWinner ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    <div className="card-body">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Participant Info */}
                        <div className="flex items-start gap-4 flex-grow">
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-full">
                              <img
                                src={submission.userId.photo}
                                alt={submission.userId.name}
                              />
                            </div>
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {submission.userId.name}
                              </h3>
                              {isWinner && (
                                <div className="badge badge-warning gap-1">
                                  <FaTrophy /> Winner
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <FaEnvelope />
                                <span>{submission.userId.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt />
                                <span>
                                  Submitted:{' '}
                                  {new Date(submission.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Submission Content */}

                            <div className="bg-base-200 p-4 rounded-lg">

                                
                            </div>
                           





                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2 justify-end">
                          {!hasWinner && isExpired && (
                            <button
                              onClick={() => handleDeclareWinner(submission._id)}
                              className="btn bg-yellow-500 hover:bg-yellow-600 text-white gap-2"
                              disabled={declareWinnerMutation.isPending}
                            >
                              <FaTrophy /> Declare Winner
                            </button>
                          )}
                          {!isExpired && (
                            <div className="badge badge-info">Contest Active</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Submissions Yet</h3>
                <p className="text-gray-600">
                  Participants haven't submitted their tasks yet
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* No Contest Selected */}
      {!selectedContest && !loadingContests && (
        <div className="card bg-white shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Contest</h3>
            <p className="text-gray-600">
              Choose a contest from the dropdown to view its submissions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedTasks;