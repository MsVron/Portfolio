import React from 'react';

const SkillCard = ({ skill }) => {
  return (
    <div className="bg-gray-700 p-3 rounded">
      <div className="flex justify-between mb-1">
        <span className="text-white font-medium">{skill.name || `Skill ID: ${skill.skill_id}`}</span>
        <span className="text-gray-300 text-sm">{skill.years_experience > 0 ? `${skill.years_experience} years` : ''}</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div 
          className="bg-purple-500 h-2 rounded-full" 
          style={{width: `${(skill.proficiency / 5) * 100}%`}}
        ></div>
      </div>
    </div>
  );
};

export default SkillCard; 