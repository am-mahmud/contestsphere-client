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

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="navbar py-2">
          
          {/* Mobile: Logo & Menu */}
          <div className="navbar-start">
            {/* Mobile Drawer */}
            <div className="drawer lg:hidden">
              <input id="mobile-menu" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label htmlFor="mobile-menu" className="btn btn-ghost">
                  <CiMenuBurger className="text-2xl" />
                </label>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="mobile-menu" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-100">
                  
                  {/* Close Button */}
                  <label htmlFor="mobile-menu" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <IoClose className="text-2xl" />
                  </label>

                  {/* Logo in Drawer */}
                  <div className="mb-6 mt-4">
                    <Logo />
                  </div>

                  {/* Navigation Links */}
                  <ul className="space-y-2">
                    <li>
                      <Link to="/" className="btn btn-ghost w-full justify-start">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/allcontests" className="btn btn-ghost w-full justify-start">
                        All Contests
                      </Link>
                    </li>
                    <li>
                      <Link to="/leaderboard" className="btn btn-ghost w-full justify-start">
                        Leaderboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/documentation" className="btn btn-ghost w-full justify-start">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="btn btn-ghost w-full justify-start">
                        About
                      </Link>
                    </li>
                  </ul>

                  <div className="divider"></div>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="btn btn-ghost w-full justify-start gap-3"
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

                  <div className="divider"></div>

                  {/* Auth Section */}
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="w-12 h-12 rounded-full ring ring-[#20beff] ring-offset-2"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="btn btn-ghost w-full justify-start"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn btn-ghost w-full justify-start text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="btn btn-outline w-full text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="btn w-full bg-gray-900 text-white hover:bg-[#20beff]"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logo - Always Visible */}
            <div className="ml-2">
              <Logo />
            </div>
          </div>

          {/* Desktop Center - Navigation Links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2">
              <li><SphereLink to="/">Home</SphereLink></li>
              <li><SphereLink to="/allcontests">All Contests</SphereLink></li>
              <li><SphereLink to="/leaderboard">Leaderboard</SphereLink></li>
              <li><SphereLink to="/documentation">Documentation</SphereLink></li>
              <li><SphereLink to="/about">About</SphereLink></li>
            </ul>
          </div>

          {/* Desktop End - Theme & Auth */}
          <div className="navbar-end gap-2">
            
            {/* Desktop Theme Toggle */}
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

            {/* Desktop Auth */}
            {user ? (
              <div className="dropdown dropdown-end hidden lg:block">
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
                  <div className="divider my-0"></div>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden lg:flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn rounded-2xl bg-gray-900 text-white hover:bg-[#20beff]"
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