import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contestAPI } from '../api/contest';
import ContestCard from '../components/contest/ContestCard';
import { FiSearch } from 'react-icons/fi';

const AllContests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Contest types for tabs
  const contestTypes = [
    { id: 'all', label: 'All Contests' },
    { id: 'Image Design', label: 'Image Design' },
    { id: 'Article Writing', label: 'Article Writing' },
    { id: 'Gaming Review', label: 'Gaming Review' },
    { id: 'Business Ideas', label: 'Business Ideas' },
  ];

  // Fetch contests with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['allContests', activeTab, searchQuery],
    queryFn: () => {
      const params = {};
      if (activeTab !== 'all') {
        params.contestType = activeTab;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      return contestAPI.getAllContests(params);
    },
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          All Contests
        </h1>
        <p className="text-xl text-gray-600">
          Explore all available contests and find your next challenge
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contests by name or description..."
            className="input input-bordered w-full pl-12 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Contest Type Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {contestTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === type.id
                ? 'bg-[#20beff] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {data && (
        <div className="mb-6 text-gray-600">
          Found <span className="font-semibold">{data.total}</span> contest
          {data.total !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-lg"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Failed to load contests. Please try again later.</span>
        </div>
      )}

      {/* Contests Grid */}
      {data && data.contests && data.contests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.contests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      )}

      {/* No Results */}
      {data && data.contests && data.contests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No contests found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No contests match "${searchQuery}". Try a different search.`
              : 'No contests available in this category yet.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-outline rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllContests;