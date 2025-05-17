import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center animate-fadeIn">
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <p className="text-2xl text-gray-300 mb-8">Page Not Found</p>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;