import React from 'react';

const ExperienceItem = ({ experience }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-xl font-bold text-white">{experience.position}</h3>
      <p className="text-purple-400">{experience.company}</p>
      <p className="text-gray-300">
        {new Date(experience.start_date).toLocaleDateString()} - 
        {experience.current_job ? ' Present' : experience.end_date ? ` ${new Date(experience.end_date).toLocaleDateString()}` : ''}
      </p>
      {experience.location && <p className="text-gray-400 mb-2">{experience.location}</p>}
      {experience.description && <p className="text-gray-300 whitespace-pre-line">{experience.description}</p>}
    </div>
  );
};

export default ExperienceItem; 