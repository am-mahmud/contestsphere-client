import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { useState } from 'react';

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch leaderboard (users sorted by wins)
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/leaderboard');
      return data;
    },
  });

  // Filter users by search
  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-2xl" />;
    if (rank === 3) return <FaMedal className="text-amber-700 text-2xl" />;
    return <FaAward className="text-blue-500 text-xl" />;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-50';
    if (rank === 3) return 'bg-gradient-to-r from-amber-100 to-amber-50';
    return 'bg-white';
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          🏆 Leaderboard
        </h1>
        <p className="text-xl text-gray-600">
          Top performers ranked by contest wins
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search for a user..."
          className="input input-bordered w-full rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Failed to load leaderboard. Please try again.</span>
        </div>
      )}

      {/* Leaderboard List */}
      {filteredUsers && filteredUsers.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredUsers.map((user, index) => {
            const rank = index + 1;
            const winRate =
              user.participationCount > 0
                ? ((user.winCount / user.participationCount) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={user._id}
                className={`card shadow-lg hover:shadow-xl transition-shadow ${getRankBg(
                  rank
                )}`}
              >
                <div className="card-body">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex flex-col items-center justify-center w-16">
                      {getRankIcon(rank)}
                      <span className="font-bold text-lg mt-1">#{rank}</span>
                    </div>

                    {/* User Avatar */}
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring ring-[#20beff] ring-offset-2">
                        <img src={user.photo} alt={user.name} />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {user.name}
                      </h3>
                      <div className="flex gap-2">
                        <span className="badge badge-primary capitalize">{user.role}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 text-center">
                      {/* Wins */}
                      <div>
                        <p className="text-3xl font-bold text-green-600">
                          {user.winCount}
                        </p>
                        <p className="text-xs text-gray-600">Wins</p>
                      </div>

                      {/* Participations */}
                      <div>
                        <p className="text-3xl font-bold text-blue-600">
                          {user.participationCount}
                        </p>
                        <p className="text-xs text-gray-600">Contests</p>
                      </div>

                      {/* Win Rate */}
                      <div>
                        <p className="text-3xl font-bold text-purple-600">{winRate}%</p>
                        <p className="text-xs text-gray-600">Win Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {filteredUsers && filteredUsers.length === 0 && (
        <div className="card bg-white shadow-lg max-w-2xl mx-auto">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No users match "${searchQuery}"`
                : 'No users on the leaderboard yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;