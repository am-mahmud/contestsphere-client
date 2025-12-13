import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

const SubmittedTasks = () => {
    const queryClient = useQueryClient();
    const [selectedContest, setSelectedContest] = useState('');

    const { data: contests } = useQuery({
        queryKey: ['myCreatedContests'],
        queryFn: async () => {
            const { data } = await api.get('/api/contests/creator/my-contests');
            return data;
        },
    });

    const { data: submissions } = useQuery({
        queryKey: ['submissions', selectedContest],
        queryFn: async () => {
            const { data } = await api.get(`/api/participations/contest/${selectedContest}/submissions`);
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['submissions', selectedContest] });
            queryClient.invalidateQueries({ queryKey: ['myCreatedContests'] });
            Swal.fire({
                icon: 'success',
                title: 'Winner Declared!',
                text: `${data.contest.winnerId.name} is the winner`,
                timer: 2000,
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
            title: 'Declare Winner?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#20beff',
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
            <h1 className="text-3xl font-bold mb-6">Submitted Tasks</h1>

            <select
                className="select select-bordered w-full mb-6"
                value={selectedContest}
                onChange={(e) => setSelectedContest(e.target.value)}
            >
                <option value="">Select a contest</option>
                {contests?.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>
            
            {submittedTasks.length > 0 ? (
                <div className="space-y-4">
                    {submittedTasks.map((sub) => {
                        const isWinner = selectedContestData?.winnerId?.toString() === sub.userId._id.toString();
                        return (
                            <div key={sub._id} className="card  shadow-md p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                                    <div>
                                        <p className="text-xs font-bold text-gray-600 mb-2">PARTICIPANT</p>
                                        <div className="flex gap-3">
                                            <img
                                                src={sub.userId.photo}
                                                alt={sub.userId.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-bold">{sub.userId.name}</p>
                                                <p className="text-sm text-gray-600">{sub.userId.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                
                                    <div>
                                        <p className="text-xs font-bold text-gray-600 mb-2">SUBMISSION</p>
                                        <p className="text-sm line-clamp-3">{sub.submittedTask}</p>
                                    </div>

                                    
                                    <div className="flex items-center justify-end">
                                        {isWinner ? (
                                            <div className="badge badge-warning gap-2">
                                                <FaTrophy /> Winner
                                            </div>
                                        ) : !hasWinner && isExpired ? (
                                            <button
                                                onClick={() => handleDeclareWinner(sub._id)}
                                                disabled={declareWinnerMutation.isPending}
                                                className="btn btn-warning btn-sm"
                                            >
                                                <FaTrophy /> Declare Winner
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                {!isExpired ? 'Pending' : 'Winner set'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : selectedContest ? (
                <p className="text-center py-8 text-gray-500">No submissions yet</p>
            ) : (
                <p className="text-center py-8 text-gray-500">Select a contest to view submissions</p>
            )}
        </div>
    );
};

export default SubmittedTasks;