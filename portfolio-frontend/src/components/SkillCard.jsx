import React from 'react';

const SkillCard = ({ skill }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow transition-all hover:shadow-lg hover:bg-gray-600">
      <div className="flex justify-between mb-2">
        <span className="text-white font-medium">{skill.skillName || `Skill ID: ${skill.skillId}`}</span>
        <span className="text-gray-300 text-sm">{skill.yearsExperience > 0 ? `${skill.yearsExperience} years` : ''}</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all"
          style={{width: `${(skill.proficiency / 5) * 100}%`}}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Beginner</span>
        <span>Advanced</span>
      </div>
    </div>
  );
};

export default SkillCard; 