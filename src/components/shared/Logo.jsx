import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to='/'>

            <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-2xl tracking-tight transition-colors duration-300'>
                contest sphere
            </h1>
        </Link>
    );
};

export default Logo;