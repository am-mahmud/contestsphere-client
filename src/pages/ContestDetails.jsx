import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { contestAPI } from '../api/contest';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaTrophy, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch contest details
  const { data: contest, isLoading, error } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestAPI.getContest(id),
  });

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const calculateTimeLeft = () => {
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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  // Handle registration
  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Navigate to payment page
    alert('Payment integration coming soon!');
  };

  // Handle task submission
  const handleSubmitTask = () => {
    // TODO: Open submit task modal
    alert('Task submission coming soon!');
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
    <div className="container mx-auto px-4 lg:px-8 py-16">
      {/* Contest Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Image and Basic Info */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-96">
            <img
              src={contest.image}
              alt={contest.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#20beff] text-white px-4 py-2 rounded-full font-semibold">
              {contest.contestType}
            </div>
            {isExpired && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Contest Ended
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {contest.name}
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUsers className="text-[#20beff] text-xl" />
              <span className="font-semibold">{contest.participantCount}</span> Participants
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaTrophy className="text-yellow-500 text-xl" />
              <span className="font-semibold">${contest.prizeMoney}</span> Prize Money
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-[#20beff] text-xl" />
              <span>Entry: <span className="font-semibold">${contest.price}</span></span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Contest</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {contest.description}
            </p>
          </div>

          {/* Task Instructions */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Instructions</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {contest.taskInstruction}
            </p>
          </div>

          {/* Winner Section (if declared) */}
          {contest.winnerId && (
            <div className="bg-linear-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Winner Announced!
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={contest.winnerId.photo}
                  alt={contest.winnerId.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-bold text-xl text-gray-900">{contest.winnerId.name}</p>
                  <p className="text-gray-600">Congratulations on winning ${contest.prizeMoney}!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
            {/* Countdown Timer */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Time Remaining
              </h3>
              <div className={`text-3xl font-bold ${isExpired ? 'text-red-500' : 'text-[#20beff]'}`}>
                {timeLeft}
              </div>
            </div>

            <div className="divider"></div>

            {/* Deadline */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Deadline
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(contest.deadline).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="divider"></div>

            {/* Creator Info */}
            {contest.creatorId && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contest Creator
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={contest.creatorId.photo}
                    alt={contest.creatorId.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{contest.creatorId.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="divider"></div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRegister}
                disabled={isExpired}
                className={`btn w-full rounded-full ${
                  isExpired
                    ? 'btn-disabled bg-gray-300'
                    : 'bg-gray-900 hover:bg-[#20beff] text-white border-gray-900 hover:border-[#20beff]'
                }`}
              >
                {isExpired ? 'Contest Ended' : 'Register & Pay'}
              </button>

              {user && !isExpired && (
                <button
                  onClick={handleSubmitTask}
                  className="btn btn-outline w-full rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white"
                >
                  Submit Task
                </button>
              )}

              {!user && (
                <p className="text-center text-sm text-gray-600">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[#20beff] hover:underline font-semibold"
                  >
                    Login
                  </button>{' '}
                  to participate
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;