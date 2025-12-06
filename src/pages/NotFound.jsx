import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
         <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
      </div>
    </div>
    );
};

export default NotFound;