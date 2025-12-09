import { useQuery } from '@tanstack/react-query';
import { participationAPI } from '../../../api/participation';
import { Link } from 'react-router';
import { FaTrophy, FaClock, FaCalendarAlt, FaRegClipboard } from 'react-icons/fa';

const MyParticipated = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myParticipations'],
    queryFn: participationAPI.getMyParticipations,
  });

  const sortedContests = data?.sort((a, b) => {
    return new Date(a.contest?.deadline) - new Date(b.contest?.deadline);
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          My Participated Contests
        </h1>
        <p className="text-gray-600">Track all contests you've registered for</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-lg"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>Failed to load your contests. Please try again.</span>
        </div>
      )}

      {!isLoading && sortedContests && sortedContests.length === 0 && (
        <div className="card bg-white shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4 flex items-center justify-center"><FaRegClipboard /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Participated Contests Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start participating in contests to see them here!
            </p>
            <Link to="/allcontests" className="btn bg-[#20beff] text-white rounded-full">
              Browse Contests
            </Link>
          </div>
        </div>
      )}

      {sortedContests && sortedContests.length > 0 && (
        <div className="space-y-4">
          {sortedContests.map((participation) => {
            const contest = participation.contest;
            if (!contest) return null;

            const isExpired = new Date(contest.deadline) < new Date();
            const hasSubmitted = !!participation.submittedTask;

            return (
              <div
                key={participation._id}
                className="card bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={contest.image}
                        alt={contest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {contest.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="badge badge-primary">{contest.contestType}</span>
                            {isExpired && <span className="badge badge-error">Ended</span>}
                            {hasSubmitted && (
                              <span className="badge badge-success">Submitted</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#20beff]">
                            ${contest.prizeMoney}
                          </div>
                          <div className="text-xs text-gray-600">Prize Money</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[#20beff]" />
                          <span>
                            Deadline:{' '}
                            {new Date(contest.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-yellow-500" />
                          <span>Paid: ${contest.price}</span>
                        </div>
                        {participation.submittedAt && (
                          <div className="flex items-center gap-1">
                            <FaTrophy className="text-green-500" />
                            <span>
                              Submitted:{' '}
                              {new Date(participation.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/contest/${contest._id}`}
                          className="btn btn-sm btn-outline rounded-full"
                        >
                          View Contest
                        </Link>
                        {!isExpired && !hasSubmitted && (
                          <button className="btn btn-sm bg-[#20beff] text-white rounded-full hover:bg-[#1a9dd9]">
                            Submit Task
                          </button>
                        )}
                        {hasSubmitted && (
                          <button className="btn btn-sm btn-outline btn-success rounded-full">
                            View Submission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyParticipated;