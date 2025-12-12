import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CiMenuBurger } from 'react-icons/ci';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import Logo from './Logo';
import SphereLink from './SphereLink';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };


  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        text: 'See you soon',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Logout failed',
      });
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const links = (
    <>
      <li onClick={handleLinkClick}>
        <SphereLink to="/">Home</SphereLink>
      </li>
      <li onClick={handleLinkClick}>
        <SphereLink to="/allcontests">All Contests</SphereLink>
      </li>
      <li onClick={handleLinkClick}>
        <SphereLink to="/leaderboard">Leaderboard</SphereLink>
      </li>
      <li onClick={handleLinkClick}>
        <SphereLink to="/documentation">Documentation</SphereLink>
      </li>
      <li onClick={handleLinkClick}>
        <SphereLink to="/About">About</SphereLink>
      </li>
    </>
  );

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="navbar py-3">
          
       
          <div className="navbar-start">
            <div className="dropdown">
              <button
                tabIndex={0}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn btn-ghost lg:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <IoClose className="text-2xl" />
                ) : (
                  <CiMenuBurger className="text-2xl" />
                )}
              </button>

      
              {isMenuOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-50 w-64 p-4 shadow-lg mt-3 border border-base-300"
                >
                  {links}


                  <li className="mt-4 pt-4 border-t border-base-300">
                    <button
                      onClick={() => {
                        toggleTheme();
                        handleLinkClick();
                      }}
                      className="flex items-center gap-3"
                    >
                      {theme === 'light' ? (
                        <>
                          <MdDarkMode className="text-xl" />
                          <span>Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <MdLightMode className="text-xl" />
                          <span>Light Mode</span>
                        </>
                      )}
                    </button>
                  </li>

                  {!user && (
                    <li className="mt-4 pt-4 border-t border-base-300 space-y-2">
                      <Link
                        to="/login"
                        onClick={handleLinkClick}
                        className="btn btn-outline w-full rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={handleLinkClick}
                        className="btn w-full rounded-2xl bg-gray-900 text-white hover:bg-[#20beff]"
                      >
                        Register
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Logo */}
            <Logo />
          </div>

          {/* Navbar Center - Desktop Links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2">
              {links}
            </ul>
          </div>

          <div className="navbar-end gap-2">
            
          
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle hidden lg:flex"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <MdDarkMode className="text-xl" />
              ) : (
                <MdLightMode className="text-xl" />
              )}
            </button>

  
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-[#20beff] ring-offset-2">
                    <img
                      src={user.photo}
                      alt={user.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-3 border border-base-300"
                >
                  <li className="menu-title px-4 py-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{user.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden lg:flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white hover:border-[#20beff]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn rounded-2xl bg-gray-900 text-white border-gray-900 hover:bg-[#20beff] hover:border-[#20beff]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;