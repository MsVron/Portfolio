import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getWorkExperience, 
  addWorkExperience, 
  deleteWorkExperience 
} from '../../services/api';

const ExperienceSection = () => {
  const { user } = useContext(AuthContext);
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({ 
    company: '', 
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    current_job: false,
    location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadExperience();
    }
  }, [user]);

  const loadExperience = async () => {
    try {
      const res = await getWorkExperience();
      setExperience(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load work experience data');
      console.error(err);
    }
  };

  const handleExperienceChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewExperience({ ...newExperience, [e.target.name]: value });
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      await addWorkExperience(newExperience);
      setNewExperience({ 
        company: '', 
        position: '',
        description: '',
        start_date: '',
        end_date: '',
        current_job: false,
        location: ''
      });
      loadExperience();
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to add work experience');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkExperience(id);
      setExperience(experience.filter(e => e.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete work experience');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Work Experience</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Work Experience</h2>
        <form onSubmit={handleExperienceSubmit} className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={newExperience.company}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Position</label>
            <input
              type="text"
              name="position"
              value={newExperience.position}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newExperience.description}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={newExperience.start_date}
                onChange={handleExperienceChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                value={newExperience.end_date}
                onChange={handleExperienceChange}
                disabled={newExperience.current_job}
                className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${newExperience.current_job ? 'opacity-50' : ''}`}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-300 text-sm font-medium">
              <input
                type="checkbox"
                name="current_job"
                checked={newExperience.current_job}
                onChange={handleExperienceChange}
                className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Current Job
            </label>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={newExperience.location}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Experience
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Work Experience</h2>
        {experience.length === 0 ? (
          <p className="text-gray-400 text-sm">No work experience added yet</p>
        ) : (
          <div className="space-y-4">
            {experience.map(item => (
              <div key={item.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-white">{item.position}</h3>
                    <p className="text-gray-300 text-sm">{item.company}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">
                  {new Date(item.start_date).toLocaleDateString()} - 
                  {item.current_job 
                    ? ' Present' 
                    : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''
                  }
                </p>
                
                {item.location && <p className="text-gray-400 text-sm mb-2">{item.location}</p>}
                
                {item.description && (
                  <p className="text-gray-300 text-sm whitespace-pre-line">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection; 