import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiSearch } from 'react-icons/fi';
import bannerImg from '../../assets/images/banner-img.svg'

const HomeBanner = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');  

    const handleSearch = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.append('search', searchQuery.trim());
        }

        if (selectedType) {
            params.append('contestType', selectedType);
        }

        navigate(`/allcontests?${params.toString()}`);
    };

    const handleTypeClick = (type) => {
        const params = new URLSearchParams();
        params.append('contestType', type);
        navigate(`/allcontests?${params.toString()}`);
    };

    return (
        <div>
            <div className='container mx-auto px-4 lg:px-8 py-16'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

                    <div className='space-y-8'>
                        <h1 className='font-bold text-5xl lg:text-6xl '>
                            Turn Your Skills Into Winning Moments
                        </h1>
                        <p className='text-lg text-gray-600 '>
                            Discover exciting contests across multiple categories. Participate in challenges that match your passion, compete with talented individuals worldwide, and win amazing prizes while building your reputation.
                        </p>

                  
                        <div className='space-y-4'>
                            <div className='rounded-2xl shadow-lg p-6 border border-gray-200'>
                                <div className='space-y-4'>
                                 
                                    <div className='relative'>
                                        <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
                                        <input
                                            type='text'
                                            placeholder='Search by contest name...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#20beff] focus:ring-2 focus:ring-[#20beff] focus:ring-opacity-50 transition-all'
                                        />
                                    </div>

                                    <button
                                        onClick={handleSearch}
                                        className='w-full bg-linear-to-r bg-gray-900 hover:bg-[#20beff] text-white border-gray-900 hover:border-[#20beff] py-3 px-6 rounded-full font-bold text-lg hover:shadow-lg transition-all'
                                    >
                                        Search Contests
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className='flex justify-center lg:justify-end'>
                        <img src={bannerImg} alt="Banner" className='w-full max-w-md drop-shadow-lg dark:drop-shadow-2xl' />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HomeBanner;