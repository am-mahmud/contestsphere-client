import { useQuery } from '@tanstack/react-query';
import { contestAPI } from '../../api/contest';

import { Link } from 'react-router';
import ContestCard from '../contest/ContestCard';

const PopularContests = () => {
  // Fetch popular contests
  const { data, isLoading, error } = useQuery({
    queryKey: ['popularContests'],
    queryFn: () => contestAPI.getPopularContests(6),
  });

  return (
    <section className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Popular Contests
          </h2>
          {/* <p className="text-gray-600">
            Join the most participated challenges
          </p> */}
        </div>
        <Link
          to="/allcontests"
          className="btn btn-outline rounded-full border-[#20beff] text-[#20beff] hover:bg-[#20beff] hover:text-white"
        >
          View All
        </Link>
      </div>

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
        <div className="alert alert-error">
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

      {/* No Contests */}
      {data && data.contests && data.contests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No contests available yet. Check back soon!
          </p>
        </div>
      )}
    </section>
  );
};

export default PopularContests;