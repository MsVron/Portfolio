import React from 'react';

const SkillsList = ({ skills }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Sort categories to ensure consistent display order
  const sortedCategories = Object.keys(skillsByCategory).sort();

  return (
    <div className="space-y-6">
      {sortedCategories.map(category => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsByCategory[category].map(skill => (
              <div key={skill.id} className="bg-gray-700 p-4 rounded-lg transition-all hover:shadow-lg hover:bg-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{skill.name || `Skill ID: ${skill.skill_id}`}</span>
                  <span className="text-gray-300 text-sm">
                    {skill.years_experience > 0 ? `${skill.years_experience} ${skill.years_experience === 1 ? 'year' : 'years'}` : ''}
                  </span>
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
