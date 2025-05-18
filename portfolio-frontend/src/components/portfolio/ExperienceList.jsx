import React from 'react';

const ExperienceList = ({ experience }) => {
  return (
    <div className="space-y-4">
      {experience.map(item => (
        <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-white">{item.position}</h3>
          <p className="text-purple-400">{item.company}</p>
          <p className="text-gray-300">
            {new Date(item.start_date).toLocaleDateString()} - 
            {item.current_job ? ' Present' : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''}
          </p>
          {item.location && <p className="text-gray-400 mb-2">{item.location}</p>}
          {item.description && <p className="text-gray-300 whitespace-pre-line">{item.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default ExperienceList; 