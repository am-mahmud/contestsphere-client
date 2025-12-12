import { useQuery } from '@tanstack/react-query';
import { participationAPI } from '../../../api/participation';
import { Link } from 'react-router';
import { FaTrophy, FaMedal, FaCrown } from 'react-icons/fa';

const MyWinning = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myWinnings'],
    queryFn: participationAPI.getMyWinnings,
  });

  const totalWinnings = data?.reduce((sum, win) => {
    return sum + (win.contest?.prizeMoney || 0);
  }, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
          My Winning Contests 
        </h1>
        <p className="text-gray-600">Celebrate your achievements and victories!</p>
      </div>

      {data && data.length > 0 && (
        <div className="card bg-linear-to-r from-yellow-400 to-yellow-600 text-white shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Prize Money Won</p>
                <p className="text-4xl font-bold">${totalWinnings}</p>
                <p className="text-sm opacity-90 mt-1">from {data.length} contest{data.length > 1 ? 's' : ''}</p>
              </div>
              <FaCrown className="text-6xl opacity-50" />
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-48 w-full rounded-lg"></div>
          ))}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>Failed to load your winning contests. Please try again.</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="card bg-white shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4 flex items-center justify-center"><FaTrophy /></div>
            <h3 className="text-2xl font-bold  mb-2">
              No Wins Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Keep participating! Your first win is just around the corner.
            </p>
            <Link to="/allcontests" className="btn bg-[#20beff] text-white rounded-full">
              Browse Contests
            </Link>
          </div>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((win, index) => {
            const contest = win.contest;
            if (!contest) return null;

            return (
              <div
                key={win._id}
                className="card bg-white shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-10">
                  {index === 0 ? (
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                      <FaCrown /> Top Win
                    </div>
                  ) : (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                      <FaTrophy /> Winner
                    </div>
                  )}
                </div>

                <figure className="h-48">
                  <img
                    src={contest.image}
                    alt={contest.name}
                    className="w-full h-full object-cover"
                  />
                </figure>

                <div className="card-body">
                  <h3 className="card-title text-xl ">{contest.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">{contest.contestType}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {contest.description}
                  </p>


                  <div className="bg-linear-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Prize Won</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          ${contest.prizeMoney}
                        </p>
                      </div>
                      <FaMedal className="text-5xl text-yellow-500" />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      Won on:{' '}
                      {new Date(win.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="card-actions justify-end">
                    <Link
                      to={`/contest/${contest._id}`}
                      className="btn btn-sm btn-outline rounded-full"
                    >
                      View Contest
                    </Link>
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

export default MyWinning;