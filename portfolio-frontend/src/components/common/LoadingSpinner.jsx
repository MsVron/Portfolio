import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 