import { useQuery } from '@tanstack/react-query';
import { contestAPI } from '../../api/contest';
import { FaTrophy, FaMedal, FaCrown } from 'react-icons/fa';
import { Link } from 'react-router';

const WinnerAdvertisement = () => {
  const { data: recentWinners} = useQuery({
    queryKey: ['recent-winners'],
    queryFn: async () => {
      const { data } = await contestAPI.getAllContests({
        status: 'confirmed',
        limit: 20,
      });
      return data.contests.filter(c => c.winnerId);
    },
    staleTime: 60000,
  });

  const totalWinners = recentWinners?.length || 0;
  const totalPrizeMoney = recentWinners?.reduce((sum, c) => sum + c.prizeMoney, 0) || 0;
  
  return (
    <section>
      <div className="container mx-auto px-4 lg:px-8 mb-10">
        
        <div className="mb-12">
          <div className="flex gap-3 mb-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Recent Winners
            </h2>
          </div>
          <p className="text-xl">
            Join our champions and win amazing prizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 ">
          <div className="rounded-xl shadow-sm p-6 text-center border border-gray-200">
            <FaCrown className="text-5xl text-yellow-500 mx-auto mb-3" />
            <div className="text-4xl font-bold  mb-2">{totalWinners}+</div>
            <div className=" font-semibold">Total Winners</div>
          </div>

          <div className=" rounded-xl shadow-sm p-6 text-center border border-gray-200">
            <FaTrophy className="text-5xl text-green-500 mx-auto mb-3" />
            <div className="text-4xl font-bold  mb-2">
              ${totalPrizeMoney.toLocaleString()}
            </div>
            <div className="font-semibold">Prize Money Awarded</div>
          </div>

          <div className="rounded-xl shadow-sm p-6 text-center border border-gray-200">
            <FaMedal className="text-5xl text-orange-500 mx-auto mb-3" />
            <div className="text-4xl font-bold  mb-2">100%</div>
            <div className="font-semibold">Satisfaction Rate</div>
          </div>
        </div>

        {recentWinners && recentWinners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {recentWinners.slice(0, 6).map((contest, index) => (
              <div
                key={contest._id}
                className="rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {index === 0 && (
                  <div className="px-4 py-2 font-bold text-sm flex items-center gap-2">
                    <FaCrown /> Top Winner
                  </div>
                )}

                <div className="h-48">
                  <img
                    src={contest.image}
                    alt={contest.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={contest.winnerId.photo}
                      alt={contest.winnerId.name}
                      className="w-12 h-12 rounded-full ring-2 ring-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="font-bold ">
                        {contest.winnerId.name}
                      </div>
                      <div className="text-sm ">Winner</div>
                    </div>
                    <FaMedal className="text-2xl text-yellow-500" />
                  </div>

                  <h4 className="font-bold  mb-3 line-clamp-1">
                    {contest.name}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Prize Won</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${contest.prizeMoney}
                      </div>
                    </div>
                    <Link
                      to={`/contest/${contest._id}`}
                      className="btn btn-sm bg-[#20beff] text-white rounded-full"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          <div className="rounded-xl shadow-sm p-12 text-center mb-12 border border-gray-200">
            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold  mb-2">
              First Winners Coming Soon!
            </h3>
            <p >
              Be among the first to win amazing prizes. Join a contest today!
            </p>
          </div>
        )}

    
        <div className="rounded-2xl shadow-sm p-8 text-center border border-gray-200">
          <FaTrophy className="text-5xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-3xl font-bold mb-4">
            Ready to Win?
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto ">
            Join thousands of participants and turn your skills into prizes
          </p>
          <Link
            to="/allcontests"
            className="btn btn-outline  text-[#20beff] hover:bg-gray-100 rounded-full"
          >
            Browse Contests
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WinnerAdvertisement;