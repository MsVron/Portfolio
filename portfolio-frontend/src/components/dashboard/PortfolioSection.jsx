import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getPortfolioSettings,
  updatePortfolioSettings,
  getPortfolioSections,
  addPortfolioSection,
  deletePortfolioSection
} from '../../services/api';

const PortfolioSection = () => {
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    theme: 'default',
    layout: 'standard',
    color_primary: '#007bff',
    color_secondary: '#6c757d',
    font_family: 'Roboto, sans-serif',
    is_public: true
  });
  const [newSection, setNewSection] = useState({ 
    section_type: 'about', 
    title: '',
    description: '',
    is_visible: true,
    display_order: 0
  });
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadSettings();
      loadSections();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const res = await getPortfolioSettings();
      if (res.data) {
        setSettings({
          theme: res.data.theme || 'default',
          layout: res.data.layout || 'standard',
          color_primary: res.data.color_primary || '#007bff',
          color_secondary: res.data.color_secondary || '#6c757d',
          font_family: res.data.font_family || 'Roboto, sans-serif',
          is_public: res.data.is_public !== undefined ? res.data.is_public : true
        });
      }
      setError('');
    } catch (err) {
      setError('Failed to load portfolio settings');
      console.error(err);
    }
  };

  const loadSections = async () => {
    try {
      const res = await getPortfolioSections();
      setSections(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load portfolio sections');
      console.error(err);
    }
  };

  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePortfolioSettings(settings);
      loadSettings();
      setError('');
      alert('Portfolio settings updated');
    } catch (err) {
      setError(err.response?.data || 'Failed to update settings');
    }
  };

  const handleSectionChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewSection({ ...newSection, [e.target.name]: value });
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPortfolioSection(newSection);
      setNewSection({ 
        section_type: 'about', 
        title: '',
        description: '',
        is_visible: true,
        display_order: 0
      });
      loadSections();
      setError('');
      alert('Portfolio section added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add portfolio section');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePortfolioSection(id);
      setSections(sections.filter(s => s.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete section');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Portfolio Settings</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Portfolio Settings Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Theme & Layout</h2>
        <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Layout</label>
            <select
              name="layout"
              value={settings.layout}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Primary Color</label>
            <input
              type="color"
              name="color_primary"
              value={settings.color_primary}
              onChange={handleSettingsChange}
              className="w-full h-10 px-1 py-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Secondary Color</label>
            <input
              type="color"
              name="color_secondary"
              value={settings.color_secondary}
              onChange={handleSettingsChange}
              className="w-full h-10 px-1 py-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm font-medium">Font Family</label>
            <select
              name="font_family"
              value={settings.font_family}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lato, sans-serif">Lato</option>
              <option value="Poppins, sans-serif">Poppins</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-300 text-sm font-medium">
              <input
                type="checkbox"
                name="is_public"
                checked={settings.is_public}
                onChange={(e) => setSettings({ ...settings, is_public: e.target.checked })}
                className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Public Portfolio
            </label>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Update Settings
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Portfolio Sections</h2>
        <form onSubmit={handleSectionSubmit} className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Section Type</label>
            <select
              name="section_type"
              value={newSection.section_type}
              onChange={handleSectionChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            >
              <option value="about">About</option>
              <option value="skills">Skills</option>
              <option value="projects">Projects</option>
              <option value="education">Education</option>
              <option value="experience">Work Experience</option>
              <option value="contact">Contact</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={newSection.title}
              onChange={handleSectionChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newSection.description}
              onChange={handleSectionChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <label className="flex items-center text-gray-300 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={newSection.is_visible}
                  onChange={handleSectionChange}
                  className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                Visible
              </label>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={newSection.display_order}
                onChange={handleSectionChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                min="0"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Section
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Portfolio Sections</h2>
        {sections.length === 0 ? (
          <p className="text-gray-400 text-sm">No sections added yet</p>
        ) : (
          <div className="space-y-2">
            {sections.map(section => (
              <div key={section.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white">{section.title}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-600 rounded-full text-xs text-gray-300">
                      {section.section_type}
                    </span>
                    {!section.is_visible && (
                      <span className="ml-2 px-2 py-0.5 bg-red-900/50 rounded-full text-xs text-red-300">
                        Hidden
                      </span>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-gray-400 text-xs mt-1 truncate">{section.description}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-4">Order: {section.display_order}</span>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection; 