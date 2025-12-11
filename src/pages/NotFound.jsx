import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div>
                    <h1 className="text-9xl lg:text-[150px] font-bold text-[#20beff]">404</h1>
                    <p className="text-3xl lg:text-4xl font-bold  mt-4">Page Not Found</p>
                </div>

                <p className="text-gray-600 text-lg">
                    The page you're looking for doesn't exist. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link 
                        to="/" 
                        className="px-8 py-3 bg-[#20beff] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link 
                        to="/all-contests" 
                        className="px-8 py-3 border-2 border-[#20beff] text-[#20beff] font-bold rounded-lg hover:bg-[#20beff] hover:text-white transition-colors"
                    >
                        Browse Contests
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;