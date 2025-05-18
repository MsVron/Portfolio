import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage; 