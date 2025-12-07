// import React from 'react';
// import { CiMenuBurger } from 'react-icons/ci';
// import Logo from './Logo';
// import SphereLink from './SphereLink';

// const Navbar = () => {



//     // Links 
//     const links = (
//         <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
//             <SphereLink to="/">Home</SphereLink>
//             <SphereLink to="/allcontests">All Contests</SphereLink>
//             <SphereLink to="/leaderboard">Leaderboard</SphereLink>
//             <SphereLink to="/blog">Blog</SphereLink>

//         </div>
//     );

//     return (

//         <div className='bg-base-100 shadow-xs sticky top-0 z-50 px-4 lg:px-8'>
//             <div className="container mx-auto navbar ">
//                 <div className="navbar-start">
//                     <div className="dropdown">
//                         <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//                             <CiMenuBurger />
//                         </div>
//                         <ul
//                             tabIndex="-1"
//                             className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow">
//                             {links}
//                         </ul>
//                     </div>
//                     <Logo />
//                 </div>
//                 <div className="navbar-center hidden lg:flex">
//                     <ul className="menu menu-horizontal px-1">
//                         {links}
//                     </ul>
//                 </div>
//                 <div className="navbar-end gap-2">
//                     <a className="btn btn-outline rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white hover:border-[#20beff]">Sign In</a>
//                     <a className="btn rounded-2xl bg-gray-900 text-white border-gray-900 hover:bg-[#20beff] hover:border-[#20beff]">Register</a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;


import React from 'react';
import { Link } from 'react-router';
import { CiMenuBurger } from 'react-icons/ci';
import Logo from './Logo';
import SphereLink from './SphereLink';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, logout } = useAuth();

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

  // Links 
  const links = (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
      <SphereLink to="/">Home</SphereLink>
      <SphereLink to="/allcontests">All Contests</SphereLink>
      <SphereLink to="/leaderboard">Leaderboard</SphereLink>
      <SphereLink to="/blog">Blog</SphereLink>
    </div>
  );

  return (
    <div className='bg-base-100 shadow-xs sticky top-0 z-50 px-4 lg:px-8'>
      <div className="container mx-auto navbar ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <CiMenuBurger />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow">
              {links}
            </ul>
          </div>
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {links}
          </ul>
        </div>
        <div className="navbar-end gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img 
                    src={user.photo || 'https://ui-avatars.com/api/?name=' + user.name} 
                    alt={user.name}
                  />
                </div>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3">
                <li className="menu-title">
                  <span className="font-bold">{user.name}</span>
                </li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline rounded-2xl text-[#20beff] border-[#20beff] hover:bg-[#20beff] hover:text-white hover:border-[#20beff]">
                Sign In
              </Link>
              <Link to="/register" className="btn rounded-2xl bg-gray-900 text-white border-gray-900 hover:bg-[#20beff] hover:border-[#20beff]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;