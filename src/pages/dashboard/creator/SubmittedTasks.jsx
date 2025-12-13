import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
import { CiInboxIn } from 'react-icons/ci';

const SubmittedTasks = () => {
    const queryClient = useQueryClient();
    const [selectedContest, setSelectedContest] = useState('');

    const { data: contests, isLoading: loadingContests } = useQuery({
        queryKey: ['myCreatedContests'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/api/contests/creator/my-contests');
                console.log('Contests fetched:', data);
                return data;
            } catch (error) {
                console.error('Error fetching contests:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load contests'
                });
                return [];
            }
        },
    });


    const { data: submissions, isLoading: loadingSubmissions, error: submissionsError } = useQuery({
        queryKey: ['submissions', selectedContest],
        queryFn: async () => {
            try {
                console.log('Fetching submissions for contest:', selectedContest);
                const { data } = await api.get(`/api/participations/contest/${selectedContest}/submissions`);
                console.log('Submissions fetched:', data);
                return data;
            } catch (error) {
                console.error('Error fetching submissions:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to load submissions'
                });
                return [];
            }
        },
        enabled: !!selectedContest,
    });

    const declareWinnerMutation = useMutation({
        mutationFn: async ({ contestId, participationId }) => {
            const { data } = await api.post('/api/participations/declare-winner', {
                contestId,
                participationId
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['submissions', selectedContest] });
            queryClient.invalidateQueries({ queryKey: ['myCreatedContests'] });
            Swal.fire({
                icon: 'success',
                title: 'Winner Declared!',
                text: `${data.contest.winnerId.name} has been declared as winner`,
                timer: 2000,
                timerProgressBar: true
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to declare winner'
            });
        },
    });

    const handleDeclareWinner = (participationId) => {
        Swal.fire({
            title: 'Declare as Winner?',
            text: 'This user will be marked as the contest winner',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#20beff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Declare Winner'
        }).then((result) => {
            if (result.isConfirmed) {
                declareWinnerMutation.mutate({
                    contestId: selectedContest,
                    participationId
                });
            }
        });
    };

    const submittedTasks = submissions?.filter((s) => s.submittedTask && s.submittedTask.trim() !== '') || [];
    const selectedContestData = contests?.find((c) => c._id === selectedContest);
    const isExpired = selectedContestData ? new Date(selectedContestData.deadline) < new Date() : false;
    const hasWinner = selectedContestData?.winnerId;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Submitted Tasks
                </h1>
                <p className="text-gray-600">
                    Review submissions and declare contest winners
                </p>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-semibold mb-3 ">Select Contest</label>
                <select
                    className="select select-bordered w-full"
                    value={selectedContest}
                    onChange={(e) => setSelectedContest(e.target.value)}
                >
                    <option value="">-- Select a contest to view submissions --</option>
                    {loadingContests ? (
                        <option disabled>Loading contests...</option>
                    ) : contests && contests.length > 0 ? (
                        contests.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name} ({c.participantCount || 0} participants)
                            </option>
                        ))
                    ) : (
                        <option disabled>No contests found</option>
                    )}
                </select>
            </div>

            {selectedContestData && (
                <div className="rounded-lg p-4 mb-6 border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Contest Name</p>
                            <p className="font-bold ">{selectedContestData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Participants</p>
                            <p className="font-bold ">{selectedContestData.participantCount || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`badge ${isExpired ? 'badge-error' : 'badge-success'}`}>
                                    {isExpired ? 'Expired' : 'Active'}
                                </span>
                                {hasWinner && <span className="badge badge-warning">Winner Declared</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loadingSubmissions ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-40 w-full rounded-lg"></div>
                    ))}
                </div>
            ) : submittedTasks.length > 0 ? (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                        Showing <span className="font-bold">{submittedTasks.length}</span> submission(s)
                    </div>

                    {submittedTasks.map((sub, idx) => {
                        const isWinner = selectedContestData?.winnerId?.toString() === sub.userId._id.toString();
                        return (
                            <div
                                key={sub._id}
                                className={` rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 ${
                                    isWinner ? 'border-yellow-400 ring-2 ring-yellow-200 ' : 'border-gray-200 '
                                }`}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                                    <div className="flex gap-4 items-start">
                                        <img
                                            src={sub.userId.photo}
                                            alt={""}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold">
                                                    {sub.userId.name}
                                                </h3>
                                                {isWinner && (
                                                    <span className="badge badge-warning badge-sm flex gap-1">
                                                        <FaTrophy /> Winner
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm">
                                                {sub.userId.email}
                                            </p>
                                        </div>
                                    </div>

        
                                    <div className="lg:col-span-2">
                                        <p className="text-xs font-semibold  mb-2">
                                            SUBMISSION
                                        </p>
                                        <div className=" p-3 rounded wrap-break-words max-h-24 overflow-y-auto">
                                            <p className="text-sm  whitespace-pre-wrap">
                                                {sub.submittedTask}
                                            </p>
                                        </div>
                                    </div>

                
                                    <div className="flex gap-2 lg:justify-end items-start pt-2 lg:pt-0">
                                        {isWinner ? (
                                            <div className="bg-yellow-50 text-yellow-800  px-4 py-2 rounded-lg text-sm font-semibold text-center whitespace-nowrap">
                                                Winner
                                            </div>
                                        ) : !hasWinner && isExpired ? (
                                            <button
                                                onClick={() => handleDeclareWinner(sub._id)}
                                                disabled={declareWinnerMutation.isPending}
                                                className="btn btn-warning btn-sm flex gap-2 whitespace-nowrap"
                                            >
                                                {declareWinnerMutation.isPending ? (
                                                    <>
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaTrophy />
                                                        Winner
                                                    </>
                                                )}
                                            </button>
                                        ) : !isExpired ? (
                                            <div className="text-xs text-gray-500 text-center">
                                                Active
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500  text-center">
                                                Winner Set
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : selectedContest ? (
                <div className="text-center py-12  rounded-lg">
                    <p className="text-5xl mb-4 flex justify-center">
                        <CiInboxIn className="text-gray-400" />
                    </p>
                    <p className="text-gray-600  font-semibold mb-2">
                        No Submissions Yet
                    </p>
                    <p className="text-sm text-gray-500 ">
                        Participants haven't submitted their tasks yet
                    </p>
                </div>
            ) : (
                <div className="text-center py-12  rounded-lg">
                    <p className="text-5xl mb-4 flex justify-center">
                        <FiTarget className="text-gray-400" />
                    </p>
                    <p className="text-gray-600  font-semibold mb-2">
                        Select a Contest
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Choose a contest from the dropdown to view submissions
                    </p>
                </div>
            )}

            {submissionsError && (
                <div className="alert alert-error mt-6">
                    <span>Error loading submissions: {submissionsError.message}</span>
                </div>
            )}
        </div>
    );
};

export default SubmittedTasks;