import React from 'react';
import { NavLink } from 'react-router';

const SphereLink = ({to, className, children}) => {
    return (
        <NavLink to={to} className={({isActive}) => isActive ? "text-[#20beff]" : `${className} font-semibold`}>
                    {children}
        </NavLink>
    );
};

export default SphereLink;