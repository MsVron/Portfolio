import React from 'react';

const EducationList = ({ education }) => {
  return (
    <div className="space-y-4">
      {education.map(item => (
        <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-white">{item.institution}</h3>
          <p className="text-purple-400">{item.degree}{item.field_of_study ? ` in ${item.field_of_study}` : ''}</p>
          <p className="text-gray-300">
            {new Date(item.start_date).toLocaleDateString()} - 
            {item.currently_studying ? ' Present' : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''}
          </p>
          {item.location && <p className="text-gray-400">{item.location}</p>}
        </div>
      ))}
    </div>
  );
};

export default EducationList; 