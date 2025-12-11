import React from 'react';

import HomeBanner from '../components/shared/HomeBanner';
import UserType from '../components/shared/UserType';
import PopularContests from '../components/shared/PopularContest';
import WinnerAdvertisement from '../components/shared/WinnerAdvertisement';
import CommunitySection from '../components/shared/CommunitySection';
import NewsletterSection from '../components/shared/NewslatterSection';

const Home = () => {
    return (
        <div className='px-4 lg:px-8'>
           <HomeBanner></HomeBanner>
           <UserType></UserType>
           <PopularContests></PopularContests>
           <WinnerAdvertisement></WinnerAdvertisement>
           <CommunitySection></CommunitySection>
           <NewsletterSection></NewsletterSection>
        </div>
    );
};

export default Home;