import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getEducation, 
  addEducation, 
  updateEducation, 
  deleteEducation 
} from '../../services/api';

const EducationSection = () => {
  const { user } = useContext(AuthContext);
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({ 
    institution: '', 
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    currently_studying: false,
    location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadEducation();
    }
  }, [user]);

  const loadEducation = async () => {
    try {
      const res = await getEducation();
      setEducation(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load education data');
      console.error(err);
    }
  };

  const handleEducationChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewEducation({ ...newEducation, [e.target.name]: value });
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEducation(newEducation);
      setNewEducation({ 
        institution: '', 
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        currently_studying: false,
        location: ''
      });
      loadEducation();
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to add education');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEducation(id);
      setEducation(education.filter(e => e.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete education');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Education</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Education</h2>
        <form onSubmit={handleEducationSubmit} className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Institution</label>
            <input
              type="text"
              name="institution"
              value={newEducation.institution}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Degree</label>
            <input
              type="text"
              name="degree"
              value={newEducation.degree}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Field of Study</label>
            <input
              type="text"
              name="field_of_study"
              value={newEducation.field_of_study}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={newEducation.start_date}
                onChange={handleEducationChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                value={newEducation.end_date}
                onChange={handleEducationChange}
                disabled={newEducation.currently_studying}
                className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${newEducation.currently_studying ? 'opacity-50' : ''}`}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-300 text-sm font-medium">
              <input
                type="checkbox"
                name="currently_studying"
                checked={newEducation.currently_studying}
                onChange={handleEducationChange}
                className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Currently Studying
            </label>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={newEducation.location}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Education
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Education</h2>
        {education.length === 0 ? (
          <p className="text-gray-400 text-sm">No education added yet</p>
        ) : (
          <div className="space-y-4">
            {education.map(item => (
              <div key={item.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">{item.institution}</h3>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  {item.degree}{item.field_of_study ? ` in ${item.field_of_study}` : ''}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(item.start_date).toLocaleDateString()} - 
                  {item.currently_studying 
                    ? ' Present' 
                    : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''
                  }
                </p>
                {item.location && <p className="text-gray-400 text-sm mt-1">{item.location}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationSection; 