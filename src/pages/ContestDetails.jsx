import { useParams, useNavigate } from 'react-router';
import { contestAPI } from '../api/contest';
import { participationAPI } from '../api/participation';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaTrophy, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import PaymentModal from '../components/contest/PaymentModal';

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [timeLeft, setTimeLeft] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedTask, setSubmittedTask] = useState('');

  const {
    data: contest,
    isLoading,
    error
  } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestAPI.getContest(id),
    enabled: !!id,
    staleTime: 30000
  });

  const {
    data: participations = [],
    isLoading: isParticipationsLoading
  } = useQuery({
    queryKey: ['myParticipations', user?.id],
    queryFn: () => participationAPI.getMyParticipations(),
    enabled: !!user,
    staleTime: 30000
  });

  const hasJoined = participations.some(p => p.contestId?._id === id);

  const submitTaskMutation = useMutation({
    mutationFn: (task) => participationAPI.submitTask(id, task),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Task submitted successfully!',
        confirmButtonColor: '#20beff',
        timer: 2000,
        timerProgressBar: true
      });
      setShowSubmitModal(false);
      setSubmittedTask('');
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Failed to submit task',
        confirmButtonColor: '#20beff'
      });
    }
  });

  useEffect(() => {
    if (!contest) return;

    const updateTimer = () => {
      const deadline = new Date(contest.deadline);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Contest Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    window.openPaymentModal();
  };

  const handlePaymentSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'Welcome!',
      text: 'Successfully joined the contest!',
      confirmButtonColor: '#20beff',
      timer: 2000,
      timerProgressBar: true
    });
    queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
    queryClient.invalidateQueries({ queryKey: ['contest', id] });
  };

  const handleSubmitTask = async () => {
    if (!submittedTask.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide your task submission',
        confirmButtonColor: '#20beff'
      });
      return;
    }

    submitTaskMutation.mutate(submittedTask);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="skeleton h-96 w-full rounded-lg"></div>
          <div className="skeleton h-12 w-3/4"></div>
          <div className="skeleton h-6 w-1/2"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Contest Not Found</h2>
        <p className="mb-6">The contest you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/allcontests')}
          className="btn btn-primary rounded-full"
        >
          Browse All Contests
        </button>
      </div>
    );
  }

  const isExpired = new Date(contest.deadline) < new Date();

  return (
    <>
    <title>Contest Details</title>
      <div className="bg-base-100 min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden mb-6 h-96">
                <img src={contest.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-[#20beff] text-white px-4 py-2 rounded-full font-semibold text-sm">
                  {contest.contestType}
                </div>
                {isExpired && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    Ended
                  </div>
                )}
                {hasJoined && !isExpired && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    ✓ Joined
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{contest.name}</h1>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-[#20beff]" />
                  <span className="font-semibold">{contest.participantCount}</span> Participants
                </div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  <span className="font-semibold">${contest.prizeMoney}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#20beff]" />
                  Entry: <span className="font-semibold">${contest.price}</span>
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-md mb-6 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="whitespace-pre-line dark:text-gray-300">{contest.description}</p>
              </div>

              <div className=" rounded-2xl p-6 shadow-md mb-6 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <p className="whitespace-pre-line dark:text-gray-300">{contest.taskInstruction}</p>
              </div>

              {contest.winnerId && (
                <div className="bg-yellow-50 dark:bg-gray-800 rounded-2xl p-6 transition-colors duration-300">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" /> Winner!
                  </h2>
                  <div className="flex items-center gap-4">
                    <img src={contest.winnerId.photo} alt="" className="w-16 h-16 rounded-full" />
                    <div>
                      <p className="font-bold text-xl">{contest.winnerId.name}</p>
                      <p className="dark:text-gray-300">Won ${contest.prizeMoney}!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className=" rounded-2xl p-6 shadow-lg sticky top-24 transition-colors duration-300">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Time Left</h3>
                  <div
                    className={`text-3xl font-bold ${isExpired ? 'text-red-500' : 'text-[#20beff]'
                      }`}
                  >
                    {timeLeft}
                  </div>
                </div>
                <div className="divider dark:divider-gray-700"></div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Deadline</h3>
                  <p className="font-semibold">
                    {new Date(contest.deadline).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="divider dark:divider-gray-700"></div>

                {contest.creatorId && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Creator</h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={contest.creatorId.photo}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-semibold">{contest.creatorId.name}</p>
                    </div>
                  </div>
                )}
                <div className="divider dark:divider-gray-700"></div>

                <div className="space-y-3">
                  {!hasJoined ? (
                    <button
                      onClick={handleRegisterClick}
                      disabled={isExpired}
                      className={`btn w-full rounded-full ${isExpired
                          ? 'btn-disabled'
                          : 'bg-gray-900 dark:bg-gray-700 hover:bg-[#20beff] text-white border-none'
                        }`}
                    >
                      {isExpired ? 'Contest Ended' : `Register & Pay $${contest.price}`}
                    </button>
                  ) : (
                    <>
                      <div className="alert alert-success">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">You're registered!</span>
                      </div>
                      {!isExpired && (
                        <button
                          onClick={() => setShowSubmitModal(true)}
                          className="btn btn-outline w-full rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white dark:border-[#20beff] dark:text-[#20beff]"
                        >
                          Submit Task
                        </button>
                      )}
                    </>
                  )}
                  {!user && (
                    <p className="text-center text-sm">
                      <button
                        onClick={() => navigate('/login')}
                        className="text-[#20beff] hover:underline font-semibold"
                      >
                        Login
                      </button>{' '}
                      to join
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <PaymentModal
            contestId={id}
            contestName={contest.name}
            onSuccess={handlePaymentSuccess}
          />

          <dialog id="submit_task_modal" className={`modal ${showSubmitModal ? 'modal-open' : ''}`}>
            <div className="modal-box bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-4">Submit Your Task</h3>
              <textarea
                className="textarea textarea-bordered w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your submission link or details here..."
                value={submittedTask}
                onChange={(e) => setSubmittedTask(e.target.value)}
                disabled={submitTaskMutation.isPending}
              ></textarea>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmittedTask('');
                  }}
                  className="btn btn-outline dark:border-gray-600 dark:text-gray-300 rounded-full"
                  disabled={submitTaskMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  className="btn bg-[#20beff] hover:bg-[#1a9fd9] text-white rounded-full border-none"
                  disabled={submitTaskMutation.isPending}
                >
                  {submitTaskMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setShowSubmitModal(false)}>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </>

  );
};

export default ContestDetails;