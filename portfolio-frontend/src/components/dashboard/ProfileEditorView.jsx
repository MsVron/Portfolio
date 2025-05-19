import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateProfile, getProfile } from '../../services/api';
import { uploadFile } from '../../services/fileService';
import FileUpload from '../common/FileUpload';
import Notification from '../common/Notification';

const ProfileEditorView = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
    profile_image: '',
    job_title: '',
    location: '',
    cv_url: '',
  });
  
  // Edit mode states for each section
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    bio: false,
    contact: false
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Get the user profile data
      getProfile().then(res => {
        setProfile({
          username: res.data.username || '',
          email: res.data.email || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          bio: res.data.bio || '',
          profile_image: res.data.profile_image || '',
          job_title: res.data.job_title || '',
          location: res.data.location || '',
          cv_url: res.data.cv_url || '',
        });
      }).catch(err => {
        setError('Failed to load profile data');
        console.error(err);
      });
    }
  }, [user]);

  const toggleEditMode = (section) => {
    setEditMode({ ...editMode, [section]: !editMode[section] });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmitSection = async (section) => {
    try {
      // Convert snake_case to camelCase for the API
      const profileData = {
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio,
        profileImage: profile.profile_image,
        jobTitle: profile.job_title,
        location: profile.location,
        cvUrl: profile.cv_url
      };
      
      await updateProfile(profileData);
      setError('');
      setSuccessMessage('Profile updated successfully');
      
      // Close edit mode for the section
      setEditMode({ ...editMode, [section]: false });
      
      // Clear success message after 3 seconds is now handled by the Notification component
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
    }
  };

  if (!user) return <div className="container mx-auto p-4 text-white">Please log in.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">My Profile</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <Notification 
        type="success" 
        message={successMessage} 
        onClose={() => setSuccessMessage('')} 
        duration={3000}
      />
      
      {/* Personal Information Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Personal Information</h2>
          <button 
            onClick={() => toggleEditMode('personalInfo')} 
            className="text-purple-400 hover:text-purple-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {editMode.personalInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={profile.job_title}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-300 mb-2 text-sm font-medium">CV/Resume Link (Google Drive or similar)</label>
              <input
                type="url"
                name="cv_url"
                value={profile.cv_url}
                onChange={handleProfileChange}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <p className="text-gray-400 text-xs mt-1">Add a link to your CV/resume that will be available for download on your portfolio page</p>
            </div>
            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                onClick={() => handleSubmitSection('personalInfo')}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => toggleEditMode('personalInfo')}
                className="ml-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Full Name</p>
              <p className="text-white">{profile.first_name} {profile.last_name || '(Not specified)'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Username</p>
              <p className="text-white">{profile.username}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Job Title</p>
              <p className="text-white">{profile.job_title || '(Not specified)'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Location</p>
              <p className="text-white">{profile.location || '(Not specified)'}</p>
            </div>
            {profile.cv_url && (
              <div className="col-span-1 md:col-span-2 mt-2">
                <p className="text-gray-400 text-sm mb-1">CV/Resume</p>
                <a 
                  href={profile.cv_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Download CV/Resume
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bio Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">About Me</h2>
          <button 
            onClick={() => toggleEditMode('bio')} 
            className="text-purple-400 hover:text-purple-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {editMode.bio ? (
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows="4"
            />
            <div className="mt-4">
              <button
                onClick={() => handleSubmitSection('bio')}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => toggleEditMode('bio')}
                className="ml-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {profile.bio ? (
              <p className="text-white whitespace-pre-line">{profile.bio}</p>
            ) : (
              <p className="text-gray-400 italic">No bio information added yet. Click the edit button to add your bio.</p>
            )}
          </div>
        )}
      </div>

      {/* Profile Image Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Image</h2>
          <button 
            onClick={() => toggleEditMode('profileImage')} 
            className="text-purple-400 hover:text-purple-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {editMode.profileImage ? (
          <div>
            <FileUpload
              label="Profile Image"
              currentImage={profile.profile_image}
              onFileSelect={async (file, formData) => {
                if (!file) {
                  setProfile({ ...profile, profile_image: '' });
                  return;
                }
                
                try {
                  setError(''); // Clear any previous errors
                  const result = await uploadFile(formData);
                  
                  if (result && result.fileUrl) {
                    setProfile({ ...profile, profile_image: result.fileUrl });
                    
                    // Immediately save the profile with the new image
                    const profileData = {
                      firstName: profile.first_name,
                      lastName: profile.last_name,
                      bio: profile.bio,
                      profileImage: result.fileUrl,
                      jobTitle: profile.job_title,
                      location: profile.location,
                      cvUrl: profile.cv_url
                    };
                    
                    await updateProfile(profileData);
                    setSuccessMessage('Profile image updated successfully');
                  } else {
                    setError('Failed to get image URL from server');
                  }
                } catch (err) {
                  console.error('Error uploading profile image:', err);
                  setError('Failed to upload image. Please try again.');
                }
              }}
            />
            <div className="mt-4">
              <button
                onClick={() => toggleEditMode('profileImage')}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            {profile.profile_image ? (
              <img 
                src={profile.profile_image} 
                alt="Profile" 
                className="w-48 h-48 object-cover rounded-full border-4 border-purple-600"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-700 rounded-full border-4 border-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Information - If you want to add more sections */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Contact Information</h2>
          <button 
            onClick={() => toggleEditMode('contact')} 
            className="text-purple-400 hover:text-purple-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {editMode.contact ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm opacity-70"
              />
              <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => toggleEditMode('contact')}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white">{profile.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditorView; 