import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getUserSkills,
  addUserSkill,
  deleteUserSkill,
  getAllSkills
} from '../../services/api';
import apiDebugger from '../../services/apiDebugger';

// Debug utility to trace skills data loading and display
const debugSkills = (label, data) => {
  console.group(`🔍 SKILLS DEBUG: ${label}`);
  console.log('Data:', data);
  if (Array.isArray(data)) {
    console.log('Count:', data.length);
    if (data.length > 0) {
      console.log('First item:', data[0]);
      console.log('Data structure:', Object.keys(data[0]).join(', '));
    } else {
      console.warn('⚠️ Empty array - No skills data!');
    }
  } else {
    console.log('Type:', typeof data);
  }
  console.groupEnd();
  return data; // Return the data to allow chaining
};

const SkillsSection = () => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsLoadError, setSkillsLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ 
    skill_id: '', 
    proficiency: 3,
    years_experience: 0
  });
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({
    apiRequests: 0,
    apiSuccesses: 0,
    apiErrors: 0,
    lastApiCall: null,
    lastResponse: null,
    renderCount: 0
  });

  // Increment render count for debugging
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1
    }));
  }, []);

  useEffect(() => {
    if (user) {
      console.log("🔑 User authenticated, loading skills data for:", user.username);
      loadSkills();
      loadAvailableSkills();
    } else {
      console.warn("⚠️ No user object available - authentication issue?");
    }
  }, [user]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setDebugInfo(prev => ({
        ...prev,
        apiRequests: prev.apiRequests + 1,
        lastApiCall: 'getUserSkills'
      }));

      console.log("📡 Fetching user skills from database...");
      const apiEntry = apiDebugger.logApiRequest('/profile/skills', 'GET');
      const res = await getUserSkills();
      apiDebugger.logApiResponse(apiEntry, res);
      
      console.log("📊 User skills response status:", res.status);
      
      // Debug the raw response data
      debugSkills('RAW API RESPONSE', res.data);
      
      // Analyze skills data quality
      const analysis = apiDebugger.analyzeSkillsData(res.data);
      if (!analysis.isValid) {
        console.error("❌ Invalid skills data format!");
      }
      
      // Ensure skills are properly formatted
      const formattedSkills = res.data.map(skill => ({
        id: skill.id,
        skillId: skill.skillId || skill.skill_id,
        skillName: skill.skillName || skill.name,
        category: skill.category || 'Other',
        proficiency: skill.proficiency || 3,
        yearsExperience: skill.yearsExperience || skill.years_experience || 0
      }));
      
      debugSkills('FORMATTED SKILLS FOR DISPLAY', formattedSkills);
      setSkills(formattedSkills);
      setError('');
      
      setDebugInfo(prev => ({
        ...prev,
        apiSuccesses: prev.apiSuccesses + 1,
        lastResponse: {
          timestamp: new Date().toISOString(),
          status: res.status,
          dataCount: res.data.length
        }
      }));
      
      // Log database-to-UI mapping stats
      console.log(`🔄 Skills data transformation complete: ${res.data.length} items from DB → ${formattedSkills.length} items for UI`);
      
      // Check for any potentially problematic data
      const missingNames = formattedSkills.filter(s => !s.skillName).length;
      if (missingNames > 0) {
        console.warn(`⚠️ Found ${missingNames} skills without names that might not display correctly`);
      }
      
    } catch (err) {
      console.error("❌ Error in loadSkills:", err);
      setError('Failed to load skills data');
      setDebugInfo(prev => ({
        ...prev,
        apiErrors: prev.apiErrors + 1,
        lastResponse: {
          timestamp: new Date().toISOString(),
          error: err.message,
          status: err.response?.status
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSkills = async () => {
    try {
      console.log("📡 Fetching available skills catalog...");
      setDebugInfo(prev => ({
        ...prev,
        apiRequests: prev.apiRequests + 1,
        lastApiCall: 'getAllSkills'
      }));
      
      const apiEntry = apiDebugger.logApiRequest('/skills', 'GET');
      const res = await getAllSkills();
      apiDebugger.logApiResponse(apiEntry, res);
      
      // Debug the raw response data
      debugSkills('AVAILABLE SKILLS CATALOG', res.data);
      
      // Ensure each skill has a proper skill_id
      const processedSkills = res.data.map(skill => ({
        ...skill,
        skill_id: parseInt(skill.skill_id, 10) || parseInt(skill.skillId, 10) // Ensure skill_id is a number
      }));
      
      debugSkills('PROCESSED AVAILABLE SKILLS', processedSkills);
      setAvailableSkills(processedSkills);
      setSkillsLoadError(false);
      
      setDebugInfo(prev => ({
        ...prev,
        apiSuccesses: prev.apiSuccesses + 1,
        lastResponse: {
          timestamp: new Date().toISOString(),
          status: res.status,
          dataCount: res.data.length
        }
      }));
    } catch (err) {
      console.error('❌ Failed to load available skills:', err);
      setSkillsLoadError(true);
      setDebugInfo(prev => ({
        ...prev,
        apiErrors: prev.apiErrors + 1,
        lastResponse: {
          timestamp: new Date().toISOString(),
          error: err.message,
          status: err.response?.status
        }
      }));
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

  // Add a debug display function for the component
  const renderDebugInfo = () => {
    const apiHistory = apiDebugger.getApiDebugHistory();
    
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-xs text-gray-400 mb-6 font-mono">
        <h3 className="text-purple-400 text-sm mb-2">Skills Debug Panel</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <div>API Requests: {debugInfo.apiRequests}</div>
          <div>API Successes: {debugInfo.apiSuccesses}</div>
          <div>API Errors: {debugInfo.apiErrors}</div>
          <div>Last API Call: {debugInfo.lastApiCall || 'None'}</div>
          <div>Render Count: {debugInfo.renderCount}</div>
          <div>User Skills: {skills.length}</div>
          <div>Available Skills: {availableSkills.length}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
        </div>
        
        <div className="border-t border-gray-700 mt-3 pt-3">
          <h4 className="text-purple-400 mb-2">Recent API Calls</h4>
          <div className="max-h-40 overflow-y-auto bg-gray-800 rounded p-2">
            {apiHistory.length === 0 ? (
              <div className="text-gray-500">No API calls logged yet</div>
            ) : (
              apiHistory.slice(0, 5).map((entry, index) => (
                <div key={index} className={`mb-2 pb-2 ${index < apiHistory.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex justify-between">
                    <span className={
                      entry.status === 'success' 
                        ? 'text-green-400' 
                        : entry.status === 'error' 
                          ? 'text-red-400' 
                          : 'text-yellow-400'
                    }>
                      {entry.method} {entry.endpoint}
                    </span>
                    <span>{entry.status}</span>
                  </div>
                  {entry.status === 'success' && (
                    <div className="text-gray-500">
                      Status: {entry.response?.status} | 
                      Data Count: {Array.isArray(entry.response?.data) ? entry.response.data.length : 'N/A'}
                    </div>
                  )}
                  {entry.status === 'error' && (
                    <div className="text-red-400">
                      {entry.error?.message}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex mt-3 gap-2">
          <button 
            onClick={() => {
              console.clear();
              apiDebugger.clearApiDebugHistory();
              loadSkills();
              loadAvailableSkills();
            }}
            className="bg-purple-600 text-white text-xs px-2 py-1 rounded mt-2 hover:bg-purple-700"
          >
            Reload Skills Data
          </button>
          
          <button 
            onClick={() => {
              // Copy debug data to clipboard as JSON
              const debugData = {
                user: user ? { id: user.id, username: user.username } : null,
                skills: skills,
                availableSkills: availableSkills.length,
                apiHistory: apiDebugger.getApiDebugHistory(),
                debugInfo: debugInfo
              };
              
              navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
                .then(() => alert('Debug data copied to clipboard!'))
                .catch(err => console.error('Failed to copy debug data:', err));
            }}
            className="bg-blue-600 text-white text-xs px-2 py-1 rounded mt-2 hover:bg-blue-700"
          >
            Copy Debug Data
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Skills</h1>
      
      {/* Debug panel - can be toggled with a URL parameter or env variable */}
      {(window.location.search.includes('debug=true') || process.env.REACT_APP_DEBUG === 'true') && 
        renderDebugInfo()
      }
      
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
        
        {loading ? (
          <p className="text-gray-400 text-sm">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        ) : (
          <div className="space-y-2">
            {skills.map(skill => {
              // Debug output to inspect skill data
              console.log("Rendering skill:", skill);
              
              // Handle both camelCase and snake_case field names
              const skillId = skill.skillId || skill.skill_id;
              const proficiency = skill.proficiency || 3;
              const yearsExperience = skill.yearsExperience || skill.years_experience || 0;
              
              // Find skill info if available
              const skillInfo = availableSkills.length > 0 
                ? availableSkills.find(s => Number(s.skill_id) === Number(skillId) || Number(s.skillId) === Number(skillId))
                : null;
              
              console.log("Skill info found:", skillInfo);
              
              // Add data- attributes for debugging in the DOM
              return (
                <div 
                  key={skill.id} 
                  className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600"
                  data-skill-id={skillId}
                  data-skill-db-id={skill.id}
                  data-has-info={!!skillInfo}
                >
                  <div className="text-sm">
                    <span className="font-medium text-white">
                      {skill.skillName || (skillInfo ? skillInfo.name : `Skill ID: ${skillId}`)}
                    </span>
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500" title="Category">
                      {skill.category || (skillInfo ? skillInfo.category : 'Unknown')}
                    </span>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                      aria-label={`Delete ${skill.skillName || 'skill'}`}
                    >
                      Delete
                    </button>
                  </div>
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