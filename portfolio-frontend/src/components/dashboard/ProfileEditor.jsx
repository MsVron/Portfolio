import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  updateProfile, getPortfolioSettings, updatePortfolioSettings,
  getProjects, addProject, updateProject, deleteProject,
  getUserSkills, addUserSkill, deleteUserSkill, getAllSkills,
  getEducation, addEducation, updateEducation, deleteEducation,
  getWorkExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience,
  getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
  getPortfolioSections, addPortfolioSection, updatePortfolioSection, deletePortfolioSection
} from '../../services/api';
import { uploadFile } from '../../services/fileService';
import FileUpload from '../common/FileUpload';

const ProfileEditor = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    password_hash: '',
    first_name: '',
    last_name: '',
    bio: '',
    profile_image: '',
    job_title: '',
    location: '',
    created_at: null,
    updated_at: null
  });
  const [settings, setSettings] = useState({
    theme: 'default',
    layout: 'standard',
    color_primary: '#007bff',
    color_secondary: '#6c757d',
    font_family: 'Roboto, sans-serif',
    is_public: true,
    updated_at: null
  });
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '',
    thumbnail: '',
    project_url: '',
    github_url: '',
    featured: false
  });
  const [projects, setProjects] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsLoadError, setSkillsLoadError] = useState(false);
  const [newSkill, setNewSkill] = useState({ 
    skill_id: '', 
    proficiency: 3,
    years_experience: 0
  });
  const [skills, setSkills] = useState([]);
  const [newEducation, setNewEducation] = useState({ 
    institution: '', 
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    currently_studying: false,
    location: ''
  });
  const [education, setEducation] = useState([]);
  const [newExperience, setNewExperience] = useState({ 
    company: '', 
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    current_job: false,
    location: ''
  });
  const [experience, setExperience] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState({ 
    platform: '', 
    url: '',
    icon: '',
    is_visible: true
  });
  const [socialLinks, setSocialLinks] = useState([]);
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
      getPortfolioSettings().then(res => setSettings(res.data || settings));
      getProjects().then(res => setProjects(res.data));
      getUserSkills().then(res => setSkills(res.data));
      
      // Try to load all skills, but don't break if it fails
      getAllSkills()
        .then(res => setAvailableSkills(res.data))
        .catch(err => {
          console.error("Failed to load skills list:", err);
          setSkillsLoadError(true);
        });
      
      getEducation().then(res => setEducation(res.data));
      getWorkExperience().then(res => setExperience(res.data));
      getSocialLinks().then(res => setSocialLinks(res.data));
      getPortfolioSections().then(res => setSections(res.data));
      setProfile({
        username: user.username || '',
        email: user.email || '',
        password_hash: user.password_hash || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        profile_image: user.profile_image || '',
        job_title: user.job_title || '',
        location: user.location || '',
        created_at: user.created_at || null,
        updated_at: user.updated_at || null
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert snake_case to camelCase for the API
      const profileData = {
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio,
        profileImage: profile.profile_image,
        jobTitle: profile.job_title,
        location: profile.location
      };
      
      await updateProfile(profileData);
      setError('');
      alert('Profile updated');
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
    }
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePortfolioSettings(settings);
      setError('');
      alert('Settings updated');
    } catch (err) {
      setError(err.response?.data || 'Failed to update settings');
    }
  };

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map any snake_case to camelCase if needed by the API
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        thumbnail: newProject.thumbnail,
        projectUrl: newProject.project_url, // Convert to camelCase for API if needed
        githubUrl: newProject.github_url, // Convert to camelCase for API if needed
        featured: newProject.featured
      };
      
      await addProject(projectData);
      setNewProject({ 
        title: '', 
        description: '',
        thumbnail: '',
        project_url: '',
        github_url: '',
        featured: false
      });
      const res = await getProjects();
      setProjects(res.data);
      setError('');
      alert('Project added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add project');
    }
  };

  const handleSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting skill:", newSkill);
      
      // Additional validation to ensure skill_id is not empty
      if (!newSkill.skill_id) {
        setError('Skill ID is required');
        return;
      }
      
      // Map snake_case to camelCase for the API
      const skillData = {
        skillId: Number(newSkill.skill_id), // Convert to number
        proficiency: Number(newSkill.proficiency), // Convert to number
        yearsExperience: Number(newSkill.years_experience) // Convert to number
      };
      
      console.log("Transformed skill data:", skillData);
      
      // Extra check to ensure skillId is a valid number
      if (isNaN(skillData.skillId) || skillData.skillId === 0) {
        setError('Skill ID must be a valid number');
        return;
      }
      
      const response = await addUserSkill(skillData);
      console.log("Skill added response:", response);
      
      setNewSkill({ skill_id: '', proficiency: 3, years_experience: 0 });
      const res = await getUserSkills();
      setSkills(res.data);
      setError('');
      alert('Skill added');
    } catch (err) {
      console.error("Error adding skill:", err);
      setError(err.response?.data || 'Failed to add skill');
    }
  };

  const handleEducationChange = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEducation(newEducation);
      setNewEducation({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', currently_studying: false, location: '' });
      const res = await getEducation();
      setEducation(res.data);
      setError('');
      alert('Education added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add education');
    }
  };

  const handleExperienceChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      await addWorkExperience(newExperience);
      setNewExperience({ company: '', position: '', description: '', start_date: '', end_date: '', current_job: false, location: '' });
      const res = await getWorkExperience();
      setExperience(res.data);
      setError('');
      alert('Work experience added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add work experience');
    }
  };

  const handleSocialLinkChange = (e) => {
    setNewSocialLink({ ...newSocialLink, [e.target.name]: e.target.value });
  };

  const handleSocialLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSocialLink(newSocialLink);
      setNewSocialLink({ platform: '', url: '', icon: '', is_visible: true });
      const res = await getSocialLinks();
      setSocialLinks(res.data);
      setError('');
      alert('Social link added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add social link');
    }
  };

  const handleSectionChange = (e) => {
    setNewSection({ ...newSection, [e.target.name]: e.target.value });
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPortfolioSection(newSection);
      setNewSection({ section_type: 'about', title: '', description: '', is_visible: true, display_order: 0 });
      const res = await getPortfolioSections();
      setSections(res.data);
      setError('');
      alert('Portfolio section added');
    } catch (err) {
      setError(err.response?.data || 'Failed to add portfolio section');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      switch (type) {
        case 'project':
          await deleteProject(id);
          setProjects(projects.filter(p => p.id !== id));
          break;
        case 'skill':
          await deleteUserSkill(id);
          setSkills(skills.filter(s => s.id !== id));
          break;
        case 'education':
          await deleteEducation(id);
          setEducation(education.filter(e => e.id !== id));
          break;
        case 'experience':
          await deleteWorkExperience(id);
          setExperience(experience.filter(e => e.id !== id));
          break;
        case 'socialLink':
          await deleteSocialLink(id);
          setSocialLinks(socialLinks.filter(s => s.id !== id));
          break;
        case 'section':
          await deletePortfolioSection(id);
          setSections(sections.filter(s => s.id !== id));
          break;
        default:
          throw new Error('Invalid type');
      }
      setError('');
      alert(`${type} deleted`);
    } catch (err) {
      setError(err.response?.data || `Failed to delete ${type}`);
    }
  };

  if (!user) return <div className="container mx-auto p-4 text-white">Please log in.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Edit Profile</h1>
      {error && <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">{error}</div>}

      {/* Profile Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              disabled
            />
          </div>
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
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="job_title"
              value={profile.job_title}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
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
            <FileUpload
              label="Profile Image"
              currentImage={profile.profile_image}
              onFileSelect={async (file, formData) => {
                if (!file) {
                  setProfile({ ...profile, profile_image: '' });
                  return;
                }
                
                try {
                  const result = await uploadFile(formData);
                  setProfile({ ...profile, profile_image: result.fileUrl });
                } catch (err) {
                  console.error('Error uploading profile image:', err);
                }
              }}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows="4"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Portfolio Settings Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Portfolio Settings</h2>
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

      {/* Projects Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Projects</h2>
        <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm font-medium">Project Title</label>
            <input
              type="text"
              name="title"
              value={newProject.title}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows="3"
            />
          </div>
          <div>
            <FileUpload
              label="Project Thumbnail"
              currentImage={newProject.thumbnail}
              onFileSelect={async (file, formData) => {
                if (!file) {
                  setNewProject({ ...newProject, thumbnail: '' });
                  return;
                }
                
                try {
                  const result = await uploadFile(formData);
                  setNewProject({ ...newProject, thumbnail: result.fileUrl });
                } catch (err) {
                  console.error('Error uploading project thumbnail:', err);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Live Project URL</label>
            <input
              type="text"
              name="project_url"
              value={newProject.project_url}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">GitHub URL</label>
            <input
              type="text"
              name="github_url"
              value={newProject.github_url}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-300 text-sm font-medium">
              <input
                type="checkbox"
                name="featured"
                checked={newProject.featured}
                onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                className="mr-2 form-checkbox bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              Featured Project
            </label>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
            >
              Add Project
            </button>
          </div>
        </form>
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Projects</h3>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-sm">No projects added yet</p>
          ) : (
            <div className="space-y-2">
              {projects.map(project => (
                <div key={project.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <span className="text-sm text-white">{project.title}</span>
                <button
                  onClick={() => handleDelete('project', project.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Skills</h2>
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
                {availableSkills.map(skill => (
                  <option key={skill.skill_id} value={skill.skill_id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
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
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Skills</h3>
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
                      onClick={() => handleDelete('skill', skill.id)}
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

      {/* Education Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Education</h2>
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
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
          >
            Add Education
          </button>
        </form>
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Education</h3>
          {education.length === 0 ? (
            <p className="text-gray-400 text-sm">No education added yet</p>
          ) : (
            <div className="space-y-2">
          {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <span className="text-sm text-white">{edu.institution} - {edu.degree}</span>
              <button
                onClick={() => handleDelete('education', edu.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Work Experience</h2>
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
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
          >
            Add Experience
          </button>
        </form>
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Work Experience</h3>
          {experience.length === 0 ? (
            <p className="text-gray-400 text-sm">No experience added yet</p>
          ) : (
            <div className="space-y-2">
          {experience.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <span className="text-sm text-white">{exp.company} - {exp.position}</span>
              <button
                onClick={() => handleDelete('experience', exp.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>

      {/* Social Links Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Social Links</h2>
        <form onSubmit={handleSocialLinkSubmit} className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Platform</label>
            <input
              type="text"
              name="platform"
              value={newSocialLink.platform}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">URL</label>
            <input
              type="text"
              name="url"
              value={newSocialLink.url}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
          >
            Add Social Link
          </button>
        </form>
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Social Links</h3>
          {socialLinks.length === 0 ? (
            <p className="text-gray-400 text-sm">No social links added yet</p>
          ) : (
            <div className="space-y-2">
          {socialLinks.map(link => (
                <div key={link.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <span className="text-sm text-white">{link.platform}: {link.url}</span>
              <button
                onClick={() => handleDelete('socialLink', link.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Sections Form */}
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
            >
              <option value="about">About</option>
              <option value="projects">Projects</option>
              <option value="skills">Skills</option>
              <option value="experience">Experience</option>
              <option value="education">Education</option>
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
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
          >
            Add Section
          </button>
        </form>
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">Your Portfolio Sections</h3>
          {sections.length === 0 ? (
            <p className="text-gray-400 text-sm">No sections added yet</p>
          ) : (
            <div className="space-y-2">
          {sections.map(section => (
                <div key={section.id} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                  <span className="text-sm text-white">{section.title} ({section.section_type})</span>
              <button
                onClick={() => handleDelete('section', section.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;