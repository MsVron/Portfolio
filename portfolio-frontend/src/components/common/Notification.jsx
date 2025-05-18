import React, { useEffect } from 'react';

const Notification = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-900/90 border-green-600' 
    : 'bg-red-900/90 border-red-600';
  
  const textColor = type === 'success' ? 'text-green-200' : 'text-red-200';
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full animate-fadeIn">
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-md shadow-lg border flex items-center justify-between`}>
        <div>{message}</div>
        <button 
          onClick={onClose} 
          className="ml-4 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification; 