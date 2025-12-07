import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col">

                    {/* Main Content */}
                    <div className="drawer-content flex flex-col">
                        {/* Mobile Header */}
                        <div className="navbar bg-base-100 lg:hidden sticky top-0 z-40 shadow-md">
                            <div className="flex-none">
                                <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-6 h-6 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        ></path>
                                    </svg>
                                </label>
                            </div>
                            <div className="flex-1">
                                <span className="text-xl font-bold text-[#20beff]">Dashboard</span>
                            </div>
                            <div className="flex-none">
                                <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={user?.photo || 'https://via.placeholder.com/40'} alt={user?.name} />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>



                </div>
            </div>
            );
};

            export default DashboardLayout;