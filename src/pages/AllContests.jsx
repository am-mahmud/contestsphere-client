import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contestAPI } from '../api/contest';
import ContestCard from '../components/contest/ContestCard';
import { FiSearch } from 'react-icons/fi';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const AllContests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const contestTypes = [
    { id: 'all', label: 'All Contests' },
    { id: 'Programming', label: 'Programming' },
    { id: 'Article Writing', label: 'Article Writing' },
    { id: 'Retro Gaming', label: 'Retro Gaming' },
    { id: 'Business Ideas', label: 'Business Ideas' },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['contests', activeTab, searchQuery],
    queryFn: async () => {
      const params = {};
      if (activeTab !== 'all') {
        params.contestType = activeTab;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      return await contestAPI.getAllContests(params);
    },
    staleTime: 30000, 
    keepPreviousData: true, 
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          All Contests
        </h1>
        <p className="text-xl ">
          Explore all available contests and find your next challenge
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contests by name or description..."
            className="input input-bordered w-full pl-12 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" />
        </div>
      </div>

  
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

      {data && (
        <div className="mb-6 text-gray-600">
          Found <span className="font-semibold">{data.total}</span> contest
          {data.total !== 1 ? 's' : ''}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-lg"></div>
          ))}
        </div>
      )}


      {error && (
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>
            {error.response?.data?.message || 
             'Failed to load contests. Please try again later.'}
          </span>
        </div>
      )}

      {data && data.contests && data.contests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.contests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      )}

      {data && data.contests && data.contests.length === 0 && (
        <div className="text-center flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4 ">
            <FaMagnifyingGlass />
          </div>
          <h3 className="text-2xl font-bold  mb-2">
            No contests found
          </h3>
          <p className=" mb-6">
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