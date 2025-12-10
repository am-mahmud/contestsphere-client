import { useParams, useNavigate } from 'react-router';
import { contestAPI } from '../api/contest';
import { participationAPI } from '../api/participation';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaTrophy, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import PaymentModal from '../components/contest/PaymentModal';
import toast from 'react-hot-toast';

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedTask, setSubmittedTask] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const data = await contestAPI.getContest(id);
        setContest(data);
      
        if (user) {
          checkParticipation();
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, user]);

  const checkParticipation = async () => {
    try {
      const participations = await participationAPI.getMyParticipations();
      const hasJoinedContest = participations.some(p => p.contestId?._id === id);
      setHasJoined(hasJoinedContest);
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

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

  const handlePaymentSuccess = async () => {
    toast.success('Successfully joined the contest!');
    setHasJoined(true);
    
    try {
      const data = await contestAPI.getContest(id);
      setContest(data);
    } catch (error) {
      console.error('Error refreshing contest:', error);
    }
  };

  const handleSubmitTask = async () => {
    if (!submittedTask.trim()) {
      toast.error('Please provide your task submission');
      return;
    }

    try {
      setSubmitting(true);
      await participationAPI.submitTask(id, submittedTask);
      toast.success('✅ Task submitted successfully!');
      setShowSubmitModal(false);
      setSubmittedTask('');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contest Not Found</h2>
        <p className="text-gray-600 mb-6">The contest you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/allcontests')} className="btn btn-primary rounded-full">
          Browse All Contests
        </button>
      </div>
    );
  }

  const isExpired = new Date(contest.deadline) < new Date();

  return (
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

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{contest.name}</h1>

          <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
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

          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{contest.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="text-gray-700 whitespace-pre-line">{contest.taskInstruction}</p>
          </div>

          {contest.winnerId && (
            <div className="bg-linear-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Winner!
              </h2>
              <div className="flex items-center gap-4">
                <img src={contest.winnerId.photo} alt="" className="w-16 h-16 rounded-full" />
                <div>
                  <p className="font-bold text-xl">{contest.winnerId.name}</p>
                  <p className="text-gray-600">Won ${contest.prizeMoney}!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Time Left</h3>
              <div className={`text-3xl font-bold ${isExpired ? 'text-red-500' : 'text-[#20beff]'}`}>
                {timeLeft}
              </div>
            </div>
            <div className="divider"></div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Deadline</h3>
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
            <div className="divider"></div>

            {contest.creatorId && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Creator</h3>
                <div className="flex items-center gap-3">
                  <img src={contest.creatorId.photo} alt="" className="w-10 h-10 rounded-full" />
                  <p className="font-semibold">{contest.creatorId.name}</p>
                </div>
              </div>
            )}
            <div className="divider"></div>

            <div className="space-y-3">
              {!hasJoined ? (
                <button
                  onClick={handleRegisterClick}
                  disabled={isExpired}
                  className={`btn w-full rounded-full ${
                    isExpired
                      ? 'btn-disabled'
                      : 'bg-gray-900 hover:bg-[#20beff] text-white border-none'
                  }`}
                >
                  {isExpired ? 'Contest Ended' : `Register & Pay $${contest.price}`}
                </button>
              ) : (
                <>
                  <div className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">You're registered!</span>
                  </div>
                  {!isExpired && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="btn btn-outline w-full rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white"
                    >
                      Submit Task
                    </button>
                  )}
                </>
              )}
              {!user && (
                <p className="text-center text-sm text-gray-600">
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
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Submit Your Task</h3>
          <textarea
            className="textarea textarea-bordered w-full h-32"
            placeholder="Paste your submission link or details here..."
            value={submittedTask}
            onChange={(e) => setSubmittedTask(e.target.value)}
          ></textarea>
          <div className="modal-action">
            <button
              onClick={() => {
                setShowSubmitModal(false);
                setSubmittedTask('');
              }}
              className="btn btn-outline rounded-full"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitTask}
              className="btn bg-[#20beff] hover:bg-[#1a9fd9] text-white rounded-full border-none"
              disabled={submitting}
            >
              {submitting ? (
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
  );
};

export default ContestDetails;