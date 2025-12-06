import React from 'react';
import bannerImg from '../../assets/images/banner-img.svg'

const HomeBanner = () => {
    return (
        <div className='container mx-auto px-4 lg:px-8 py-16'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

                <div className='space-y-6'>
                    <h1 className='font-bold text-5xl lg:text-6xl text-gray-900'>Turn Your Skills Into Winning Moments</h1>
                    <p className='text-lg text-gray-600'>Discover exciting contests across multiple categories. Participate in challenges that match your passion, compete with talented individuals worldwide, and win amazing prizes while building your reputation.</p>
                </div>

                <div className='flex justify-center lg:justify-end'>
                    <img src={bannerImg} alt="Banner" className='w-full max-w-md' />
                </div>

            </div>
        </div>
    );
};

export default HomeBanner;