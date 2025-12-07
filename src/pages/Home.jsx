import React from 'react';

import HomeBanner from '../components/shared/HomeBanner';
import UserType from '../components/shared/UserType';
import PopularContests from '../components/shared/PopularContest';

const Home = () => {
    return (
        <div>
           <HomeBanner></HomeBanner>
           <UserType></UserType>
           <PopularContests></PopularContests>
        </div>
    );
};

export default Home;