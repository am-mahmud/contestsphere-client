import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to='/'>

            <h1 className='font-semibold text-sm sm:text-base md:text-lg lg:text-2xl text-gray-900 dark:text-white tracking-tight'>
                contest sphere
            </h1>
        </Link>
    );
};

export default Logo;