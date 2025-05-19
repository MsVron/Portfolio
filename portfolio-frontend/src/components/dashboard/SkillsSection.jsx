import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getUserSkills,
  addUserSkill,
  deleteUserSkill,
  getAllSkills
} from '../../services/api';

const SkillsSection = () => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsLoadError, setSkillsLoadError] = useState(false);
  const [newSkill, setNewSkill] = useState({ 
    skill_id: '', 
    proficiency: 3,
    years_experience: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadSkills();
      loadAvailableSkills();
    }
  }, [user]);

  const loadSkills = async () => {
    try {
      const res = await getUserSkills();
      setSkills(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load skills data');
      console.error(err);
    }
  };

  const loadAvailableSkills = async () => {
    try {
      const res = await getAllSkills();
      // Ensure each skill has a proper skill_id
      const processedSkills = res.data.map(skill => ({
        ...skill,
        skill_id: parseInt(skill.skill_id, 10) // Ensure skill_id is a number
      }));
      console.log("Available skills loaded:", processedSkills);
      setAvailableSkills(processedSkills);
      setSkillsLoadError(false);
    } catch (err) {
      console.error('Failed to load available skills:', err);
      setSkillsLoadError(true);
    }
  };

  const handleSkillChange = (e) => {
    const { name, value, type } = e.target;
    
    // For number inputs (range and number types)
    if (type === 'range' || type === 'number') {
      setNewSkill(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
      return;
    }
    
    // For the skill select
    if (name === 'skill_id') {
      console.log("Selected skill_id raw value:", value);
      setNewSkill(prev => ({
        ...prev,
        skill_id: value
      }));
      return;
    }
    
    // For any other inputs
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Raw newSkill from form:", newSkill);
      
      // Additional validation to ensure skill_id is not empty
      if (!newSkill.skill_id) {
        setError('Skill ID is required');
        return;
      }
      
      let skillId = null;
      
      // First check if the skill_id is a number string (like "11")
      if (/^\d+$/.test(newSkill.skill_id)) {
        skillId = parseInt(newSkill.skill_id, 10);
        console.log("Parsed skill_id directly as number:", skillId);
      } 
      // If not a number, try to match against skill names
      else {
        const selectedSkillName = newSkill.skill_id;
        console.log("Looking for skill with name:", selectedSkillName);
        
        // Try to find the skill in the available skills list
        const matchedSkill = availableSkills.find(
          skill => `${skill.name} (${skill.category})` === selectedSkillName
        );
        
        if (matchedSkill) {
          skillId = parseInt(matchedSkill.skill_id, 10);
          console.log("Found matching skill:", matchedSkill.name, "with ID:", skillId);
        } else {
          console.error("Could not find matching skill for:", selectedSkillName);
          setError('Could not find a matching skill');
          return;
        }
      }
      
      // Final validation
      if (isNaN(skillId) || skillId <= 0) {
        setError('Skill ID must be a valid number');
        return;
      }
      
      // Map snake_case to camelCase and convert to correct data types for the API
      const skillData = {
        skillId: skillId,
        proficiency: Number(newSkill.proficiency),
        yearsExperience: Number(newSkill.years_experience)
      };
      
      console.log("Sending skillData to API:", skillData);
      
      await addUserSkill(skillData);
      setNewSkill({ 
        skill_id: '', 
        proficiency: 3,
        years_experience: 0
      });
      loadSkills();
      setError('');
    } catch (err) {
      console.error("Error adding skill:", err);
      setError(err.response?.data || 'Failed to add skill');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete skill');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Skills</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Skill</h2>
        <form onSubmit={handleSkillSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Skill</label>
            {availableSkills.length > 0 ? (
              <select
                name="skill_id"
                value={newSkill.skill_id}
                onChange={handleSkillChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                required
              >
                <option value="">Select a skill</option>
                {availableSkills.map((skill, index) => {
                  // Make sure each skill has a valid skill_id, or use index as fallback
                  const skillId = skill.skill_id || index + 1;
                  return (
                    <option 
                      key={`skill-${skillId}-${index}`} 
                      value={String(skillId)}
                    >
                      {skill.name} ({skill.category})
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                name="skill_id"
                value={newSkill.skill_id}
                onChange={handleSkillChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Enter skill ID"
                required
              />
            )}
            {skillsLoadError && (
              <p className="text-xs text-yellow-400 mt-1">
                Enter the skill ID. Available skills couldn't be loaded.
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Proficiency (1-5)</label>
            <input
              type="range"
              name="proficiency"
              value={newSkill.proficiency}
              onChange={handleSkillChange}
              className="w-full accent-purple-500"
              min="1"
              max="5"
              step="1"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Years of Experience</label>
            <input
              type="number"
              name="years_experience"
              value={newSkill.years_experience}
              onChange={handleSkillChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              min="0"
              step="0.5"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Skills</h2>
        {skills.length === 0 ? (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        ) : (
          <div className="space-y-2">
            {skills.map(skill => {
              // Handle both camelCase and snake_case field names
              const skillId = skill.skill_id || skill.skillId;
              const proficiency = skill.proficiency || 3;
              const yearsExperience = skill.years_experience || skill.yearsExperience || 0;
              
              // Find skill info if available
              const skillInfo = availableSkills.length > 0 
                ? availableSkills.find(s => Number(s.skill_id) === Number(skillId) || Number(s.skillId) === Number(skillId))
                : null;
              
              return (
                <div key={skill.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <div className="text-sm">
                    <span className="font-medium text-white">{skillInfo ? skillInfo.name : `Skill ID: ${skillId}`}</span>
                    <div className="flex items-center mt-1">
                      <div className="w-24 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{width: `${(proficiency / 5) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {yearsExperience > 0 ? `${yearsExperience} years` : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection; 