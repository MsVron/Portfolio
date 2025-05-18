import React from 'react';

const EducationItem = ({ education }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-xl font-bold text-white">{education.institution}</h3>
      <p className="text-purple-400">
        {education.degree}
        {education.field_of_study ? ` in ${education.field_of_study}` : ''}
      </p>
      <p className="text-gray-300">
        {new Date(education.start_date).toLocaleDateString()} - 
        {education.currently_studying ? ' Present' : education.end_date ? ` ${new Date(education.end_date).toLocaleDateString()}` : ''}
      </p>
      {education.location && <p className="text-gray-400">{education.location}</p>}
    </div>
  );
};

export default EducationItem; 