import React from 'react';

const AboutSection = ({ bio }) => {
  if (!bio) return null;
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">About Me</h2>
      <p className="text-gray-300 whitespace-pre-line">{bio}</p>
    </div>
  );
};

export default AboutSection; 