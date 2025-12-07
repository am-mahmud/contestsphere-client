import React from 'react';

import HomeBanner from '../components/shared/HomeBanner';
import UserType from '../components/shared/UserType';

const Home = () => {
    return (
        <div>
           <HomeBanner></HomeBanner>
           <UserType></UserType>
        </div>
    );
};

export default Home;