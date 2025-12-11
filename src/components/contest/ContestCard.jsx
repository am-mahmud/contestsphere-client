import { Link } from 'react-router';
import { FaUsers, FaTrophy, FaClock } from 'react-icons/fa';

const ContestCard = ({ contest }) => {

  const isExpired = new Date(contest.deadline) < new Date();

  return (
    <div className="card  shadow-sm transition-shadow duration-300 border border-gray-200 rounded-2xl overflow-hidden">
    
      <figure className="relative h-48 overflow-hidden">
        <img
          src={contest.image}
          alt={contest.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {isExpired && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Ended
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#20beff] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {contest.contestType}
        </div>
      </figure>

 
      <div className="card-body p-6">
  
        <h2 className="text-xl font-bold  mb-2">
          {contest.name}
        </h2>

        <p className="text-sm  line-clamp-2 mb-4">
          {contest.description}
        </p>

        <div className="flex items-center gap-4 text-sm  mb-3">
          <div className="flex items-center gap-1">
            <FaUsers className="text-[#20beff]" />
            <span>{contest.participantCount} joined</span>
          </div>
          <div className="flex items-center gap-1">
            <FaTrophy className="text-yellow-500" />
            <span className="font-semibold">${contest.prizeMoney}</span>
          </div>
        </div>


        <div className="text-sm font-semibold text-[#20beff] mb-4">
          Entry Fee: ${contest.price}
        </div>


        <div className="divider my-0"></div>


        <div className="pt-4">
          <Link
            to={`/contest/${contest._id}`}
            className={`btn w-full ${
              isExpired
                ? 'btn-disabled bg-gray-300'
                : 'bg-gray-900 hover:bg-[#20beff] text-white border-gray-900 hover:border-[#20beff]'
            } rounded-full`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;