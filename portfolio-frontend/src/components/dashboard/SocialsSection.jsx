import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getSocialLinks,
  addSocialLink,
  deleteSocialLink 
} from '../../services/api';

const SocialsSection = () => {
  const { user } = useContext(AuthContext);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState({ 
    platform: '', 
    url: '',
    icon: '',
    is_visible: true
  });
  const [error, setError] = useState('');

  // Common social media platforms
  const platformOptions = [
    { value: 'github', label: 'GitHub', icon: 'fab fa-github' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin' },
    { value: 'twitter', label: 'Twitter', icon: 'fab fa-twitter' },
    { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
    { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook' },
    { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
    { value: 'twitch', label: 'Twitch', icon: 'fab fa-twitch' },
    { value: 'medium', label: 'Medium', icon: 'fab fa-medium' },
    { value: 'dev', label: 'Dev.to', icon: 'fab fa-dev' },
    { value: 'dribbble', label: 'Dribbble', icon: 'fab fa-dribbble' },
    { value: 'behance', label: 'Behance', icon: 'fab fa-behance' },
    { value: 'stackoverflow', label: 'Stack Overflow', icon: 'fab fa-stack-overflow' },
    { value: 'website', label: 'Website', icon: 'fas fa-globe' },
    { value: 'email', label: 'Email', icon: 'fas fa-envelope' },
    { value: 'other', label: 'Other', icon: 'fas fa-link' },
  ];

  useEffect(() => {
    if (user) {
      loadSocialLinks();
    }
  }, [user]);

  const loadSocialLinks = async () => {
    try {
      const res = await getSocialLinks();
      setSocialLinks(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load social links');
      console.error(err);
    }
  };

  const handleSocialLinkChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    // If the platform changes, automatically set the icon
    if (e.target.name === 'platform') {
      const selectedPlatform = platformOptions.find(p => p.value === value);
      setNewSocialLink({ 
        ...newSocialLink, 
        platform: value,
        icon: selectedPlatform ? selectedPlatform.icon : ''
      });
    } else {
      setNewSocialLink({ ...newSocialLink, [e.target.name]: value });
    }
  };

  const handleSocialLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSocialLink(newSocialLink);
      setNewSocialLink({ 
        platform: '', 
        url: '',
        icon: '',
        is_visible: true
      });
      loadSocialLinks();
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to add social link');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSocialLink(id);
      setSocialLinks(socialLinks.filter(s => s.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete social link');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Social Links</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Social Link</h2>
        <form onSubmit={handleSocialLinkSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Platform</label>
            <select
              name="platform"
              value={newSocialLink.platform}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            >
              <option value="">Select Platform</option>
              {platformOptions.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">URL</label>
            <input
              type="text"
              name="url"
              value={newSocialLink.url}
              onChange={handleSocialLinkChange}
              placeholder={newSocialLink.platform === 'email' ? 'mailto:your.email@example.com' : 'https://'}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Icon Class</label>
            <input
              type="text"
              name="icon"
              value={newSocialLink.icon}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="e.g. fab fa-github"
            />
            <p className="text-xs text-gray-400 mt-1">Font Awesome classes (optional)</p>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-300 text-sm font-medium">
              <input
                type="checkbox"
                name="is_visible"
                checked={newSocialLink.is_visible}
                onChange={handleSocialLinkChange}
                className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Visible
            </label>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Social Link
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Social Links</h2>
        {socialLinks.length === 0 ? (
          <p className="text-gray-400 text-sm">No social links added yet</p>
        ) : (
          <div className="space-y-2">
            {socialLinks.map(link => {
              const platformInfo = platformOptions.find(p => p.value === link.platform) || { label: link.platform, icon: link.icon };
              
              return (
                <div key={link.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <i className={link.icon || platformInfo.icon || 'fas fa-link'} aria-hidden="true"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{platformInfo.label}</div>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300">
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {!link.is_visible && (
                      <span className="mr-3 px-2 py-0.5 bg-red-900/50 rounded-full text-xs text-red-300">
                        Hidden
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
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

export default SocialsSection; 