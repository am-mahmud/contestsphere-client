import { FaGlobe, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function CommunitySection() {
  const categories = [
    'Programming',
    'Web Design',
    'Article Writing',
    'Business Ideas',
    'Retro Gaming',
    'Digital Art'
  ];

  const countries = [
    'USA', 'UK', 'CA', 'AU', 'IN',
    'PK', 'BD', 'DE', 'FR', 'JP'
  ];

  return (
    <div className="container mx-auto py-16 lg:py-20 px-4 lg:px-8 transition-colors duration-300">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          <div className="border border-gray-200  rounded-3xl p-8 lg:p-10 transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <FaGlobe className="text-3xl text-[#20beff]" />
              <h2 className="text-3xl lg:text-4xl font-bold">A global community</h2>
            </div>
            
            <p className="text-lg  mb-8">
              Over 10,000 talented creators from 50+ countries are competing and winning amazing prizes together.
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {countries.map((country, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-semibold  hover:bg-[#20beff] hover:text-white hover:border-[#20beff] transition-all duration-300"
                  >
                    {country}
                  </span>
                ))}
                <span className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  + 40 more
                </span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-3xl p-8 lg:p-10  transition-shadow duration-300">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Multiple Contest Categories</h2>
            
            <p className="text-lg 0 mb-8">
              Whether you're a programmer, designer, or writer, find the perfect contest that matches your skills and passion.
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((category, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-semibold text-gray-900 dark:text-white hover:bg-[#20beff] hover:text-white hover:border-[#20beff] transition-all duration-300"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <a 
                href="/allcontests"
                className="inline-flex items-center gap-2 text-[#20beff] font-semibold hover:gap-3 transition-all duration-300 text-lg"
              >
                Explore All Contests
                <FaArrowRight className="text-xl" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}