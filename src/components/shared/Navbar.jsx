import React from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import Logo from './Logo';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 lg:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <CiMenuBurger />
                    </div>
                    <ul
                        tabIndex="-1"
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow">
                        <li><a>Home</a></li>
                        <li><a>All Contests</a></li>
                        <li><a>Leaderboard</a></li>
                        <li><a>Blog</a></li>
                    </ul>
                </div>
                <Logo/>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Home</a></li>
                    <li><a>All Contests</a></li>
                    <li><a>Leaderboard</a></li>
                    <li><a>Blog</a></li>
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <a className="btn btn-outline rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white hover:border-[#20beff]">Sign In</a>
                <a className="btn rounded-2xl bg-gray-900 text-white border-gray-900 hover:bg-[#20beff] hover:border-[#20beff]">Register</a>
            </div>
        </div>
    );
};

export default Navbar;