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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      setMobileMenuOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Logout failed',
      });
    }
  };

  const links = (
    <>
      <SphereLink to="/">Home</SphereLink>
      <SphereLink to="/allcontests">All Contests</SphereLink>
      <SphereLink to="/leaderboard">Leaderboard</SphereLink>
      <SphereLink to="/documentation">Documentation</SphereLink>
      <SphereLink to="/About">About</SphereLink>
    </>
  );

  return (
    <div className='bg-base-100 dark:bg-gray-900 shadow-sm sticky top-0 z-50 px-4 lg:px-8 transition-colors duration-300'>
      <div className="container mx-auto">
        <div className="navbar py-2 lg:py-4 px-0">
          
          
          <div className="navbar-start gap-2">
      
            <button 
              className="btn btn-ghost btn-sm lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <IoClose className="text-2xl" /> : <CiMenuBurger className="text-2xl" />}
            </button>
            
  
            <Logo />
          </div>

   
          <div className="navbar-center hidden lg:flex">
            <div className="flex gap-2">
              {links}
            </div>
          </div>

        
          <div className="navbar-end gap-2">
           
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm lg:btn-md btn-circle"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? (
                <MdDarkMode className="text-xl" />
              ) : (
                <MdLightMode className="text-xl" />
              )}
            </button>

            {user ? (
            
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm lg:btn-md">
                  <div className="w-8 lg:w-10 rounded-full ring ring-[#20beff] ring-offset-1">
                    <img
                      src={user.photo}
                      alt={""}
                    />
                  </div>
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52 z-50">
                  <li className="menu-title">
                    <span className="font-bold text-sm">{user.name}</span>
                  </li>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
          
              <div className="hidden sm:flex gap-1 lg:gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline btn-xs sm:btn-sm rounded-full text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-xs sm:btn-sm rounded-full bg-gray-900 dark:bg-gray-700 text-white border-gray-900 dark:border-gray-700 hover:bg-[#20beff] hover:border-[#20beff]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 pt-4">
            
              <div className="flex flex-col gap-2">
                {links}
              </div>

              <div className="divider my-1"></div>

             
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm font-bold px-3">{user.name}</p>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm w-full btn-ghost rounded-full text-[#20beff]"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-sm w-full btn-outline rounded-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm w-full btn-outline rounded-full text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm w-full rounded-full text-white hover:bg-[#20beff] hover:border-[#20beff]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;