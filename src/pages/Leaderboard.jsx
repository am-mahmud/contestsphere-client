import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../api/user';
import { FaTrophy, FaMagnifyingGlass } from 'react-icons/fa6';
import { useState } from 'react';

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: userAPI.getLeaderboard,
    staleTime: 60000,
  });

  const participants = users?.filter(u => u.participationCount > 0);
  const filteredUsers = participants?.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="loading loading-spinner loading-lg text-[#20beff]"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>
            {error.response?.data?.message || 'Failed to load leaderboard'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
    <title>Leaderboard</title>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers ranked by contest wins</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>


        {filteredUsers && filteredUsers.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg shadow overflow-hidden">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-20">Rank</th>
                    <th>User</th>
                    <th className="text-center">Wins</th>
                    <th className="text-center">Contests</th>
                    <th className="text-center">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const rank = index + 1;
                    const winRate =
                      user.participationCount > 0
                        ? ((user.winCount / user.participationCount) * 100).toFixed(0)
                        : 0;
                    const medals = {
                      1: 'text-yellow-500',
                      2: 'text-gray-400',
                      3: 'text-amber-700',
                    };

                    return (
                      <tr key={user._id} className={rank <= 3 ? 'bg-base-200' : ''}>
                        <td className="font-bold text-lg">
                          {rank <= 3 && (
                            <FaTrophy className={`inline mr-2 ${medals[rank]}`} />
                          )}
                          #{rank}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img
                                  src={user.photo || '/default-avatar.png'}
                                  alt={user.name}
                                  onError={(e) => (e.target.src = '/default-avatar.png')}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm opacity-60 capitalize">
                                {user.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center font-bold text-green-600">
                          {user.winCount}
                        </td>
                        <td className="text-center">{user.participationCount}</td>
                        <td className="text-center font-semibold">{winRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {filteredUsers && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 flex items-center justify-center text-gray-400">
              <FaMagnifyingGlass />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Participants</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No matches for "${searchQuery}"`
                : 'No participants yet. Be the first to join a contest!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-outline rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white mt-4"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Leaderboard;