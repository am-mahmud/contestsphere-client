import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { FaTrophy } from 'react-icons/fa';
import { useState } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/leaderboard');
      return data;
    },
  });

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600">Top performers ranked by contest wins</p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search users..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Failed to load leaderboard</span>
        </div>
      )}

      {/* List */}
      {filteredUsers && filteredUsers.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
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

                  return (
                    <tr key={user._id} className={rank <= 3 ? 'bg-base-200' : ''}>
                      <td className="font-bold text-lg">
                        {rank === 1 && <FaTrophy className="inline text-yellow-500 mr-2" />}
                        {rank === 2 && <FaTrophy className="inline text-gray-400 mr-2" />}
                        {rank === 3 && <FaTrophy className="inline text-amber-700 mr-2" />}
                        #{rank}
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img src={user.photo} alt={""} />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm opacity-60 capitalize">{user.role}</div>
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
          <div className="text-6xl mb-4"><FaMagnifyingGlass /></div>
          <h3 className="text-2xl font-bold mb-2">No Users Found</h3>
          <p className="text-gray-600">
            {searchQuery ? `No matches for "${searchQuery}"` : 'No users yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;