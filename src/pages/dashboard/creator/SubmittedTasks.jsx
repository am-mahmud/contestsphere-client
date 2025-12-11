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
            const { data } = await api.get('/api/contests/my-contests');
            return data;
        },
    });

    const { data: submissions, isLoading: loadingSubmissions } = useQuery({
        queryKey: ['submissions', selectedContest],
        queryFn: async () => {
            const { data } = await api.get(`/api/participations/contest/${selectedContest}`);
            return data;
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
        onSuccess: () => {
            queryClient.invalidateQueries(['submissions', selectedContest]);
            Swal.fire({ icon: 'success', title: 'Winner Declared!', timer: 2000 });
        },
        onError: (error) => {
            Swal.fire({ icon: 'error', title: 'Error!', text: error.response?.data?.message });
        },
    });

    const handleDeclareWinner = (participationId) => {
        Swal.fire({
            title: 'Declare Winner?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#20beff',
        }).then((result) => {
            if (result.isConfirmed) {
                declareWinnerMutation.mutate({ contestId: selectedContest, participationId });
            }
        });
    };

    const submittedTasks = submissions?.filter((s) => s.submittedTask) || [];
    const selectedContestData = contests?.find((c) => c._id === selectedContest);
    const isExpired = selectedContestData ? new Date(selectedContestData.deadline) < new Date() : false;
    const hasWinner = selectedContestData?.winnerId;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Submitted Tasks</h1>
                <p className="text-gray-600">Review and declare winners</p>
            </div>

            <select
                className="select select-bordered w-full mb-6"
                value={selectedContest}
                onChange={(e) => setSelectedContest(e.target.value)}
            >
                <option value="">Select a contest</option>
                {contests?.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name} ({c.participantCount})
                    </option>
                ))}
            </select>

            {loadingSubmissions ? (
                <div className="skeleton h-40 w-full"></div>
            ) : submittedTasks.length > 0 ? (
                <div className="space-y-4">
                    {submittedTasks.map((sub) => {
                        const isWinner = selectedContestData?.winnerId?.toString() === sub.userId._id.toString();
                        return (
                            <div key={sub._id} className={`card  shadow ${isWinner ? 'ring-2 ring-yellow-400' : ''}`}>
                                <div className="card-body p-6">
                                    <div className="flex gap-4">
                                        <img src={sub.userId.photo} alt="" className="w-12 h-12 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{sub.userId.name}</h3>
                                                {isWinner && <span className="badge badge-warning badge-sm"><FaTrophy /></span>}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{sub.userId.email}</p>
                                            <div className="bg-base-100 p-3 rounded">
                                                <p className="text-sm">{sub.submittedTask}</p>
                                            </div>
                                        </div>
                                        {!hasWinner && isExpired && (
                                            <button
                                                onClick={() => handleDeclareWinner(sub._id)}
                                                className="btn btn-warning btn-sm"
                                                disabled={declareWinnerMutation.isPending}
                                            >
                                                <FaTrophy /> Winner
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : selectedContest ? (
                <div className="text-center py-12">
                    <p className="text-6xl mb-2 flex justify-center items-center"><CiInboxIn /></p>
                    <p className="text-gray-600">No submissions yet</p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-6xl mb-2 flex items-center justify-center"><FiTarget /></p>
                    <p className="text-gray-600">Select a contest to view submissions</p>
                </div>
            )}
        </div>
    );
};

export default SubmittedTasks;

