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

  // Sort categories alphabetically
  const sortedCategories = Object.keys(skillsByCategory).sort();

  return (
    <div className="mb-8">
      {sortedCategories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-white">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillsByCategory[category].map(skill => (
              <div key={skill.id} className="bg-gray-700 p-4 rounded-lg transition-all hover:shadow-lg hover:bg-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{skill.skillName || `Skill ID: ${skill.skillId}`}</span>
                  <span className="text-gray-300 text-sm">
                    {skill.yearsExperience > 0 ? `${skill.yearsExperience} ${skill.yearsExperience === 1 ? 'year' : 'years'}` : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{width: `${(skill.proficiency / 5) * 100}%`}}
                  />
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
