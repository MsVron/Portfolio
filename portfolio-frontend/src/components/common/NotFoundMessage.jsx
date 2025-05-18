import React from 'react';

const NotFoundMessage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Portfolio Not Found</h2>
        <p className="text-gray-300">The portfolio you're looking for doesn't exist or is private.</p>
      </div>
    </div>
  );
};

export default NotFoundMessage; 