import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  updateProfile, getPortfolioSettings, updatePortfolioSettings,
  getProjects, addProject, updateProject, deleteProject,
  getUserSkills, addUserSkill, deleteUserSkill,
  getEducation, addEducation, updateEducation, deleteEducation,
  getWorkExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience,
  getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
  getPortfolioSections, addPortfolioSection, updatePortfolioSection, deletePortfolioSection
} from '../../services/api';

const ProfileEditor = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profileImage: '',
    jobTitle: '',
    location: ''
  });
  const [settings, setSettings] = useState({
    theme: 'default',
    layout: 'standard',
    colorPrimary: '#007bff',
    colorSecondary: '#6c757d',
    fontFamily: 'Roboto, sans-serif'
  });
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [projects, setProjects] = useState([]);
  const [newSkill, setNewSkill] = useState({ skillId: '', proficiency: 3 });
  const [skills, setSkills] = useState([]);
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '' });
  const [education, setEducation] = useState([]);
  const [newExperience, setNewExperience] = useState({ company: '', position: '' });
  const [experience, setExperience] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSection, setNewSection] = useState({ sectionType: 'about', title: '' });
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      getPortfolioSettings().then(res => setSettings(res.data || settings));
      getProjects().then(res => setProjects(res.data));
      getUserSkills().then(res => setSkills(res.data));
      getEducation().then(res => setEducation(res.data));
      getWorkExperience().then(res => setExperience(res.data));
      getSocialLinks().then(res => setSocialLinks(res.data));
      getPortfolioSections().then(res => setSections(res.data));
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        jobTitle: user.jobTitle || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
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
      await addProject(newProject);
      setNewProject({ title: '', description: '' });
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
      await addUserSkill(newSkill);
      setNewSkill({ skillId: '', proficiency: 3 });
      const res = await getUserSkills();
      setSkills(res.data);
      setError('');
      alert('Skill added');
    } catch (err) {
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
      setNewEducation({ institution: '', degree: '' });
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
      setNewExperience({ company: '', position: '' });
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
      setNewSocialLink({ platform: '', url: '' });
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
      setNewSection({ sectionType: 'about', title: '' });
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

  if (!user) return <div className="container mx-auto p-4">Please log in.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Profile Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Image URL</label>
            <input
              type="text"
              name="profileImage"
              value={profile.profileImage}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={profile.jobTitle}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Portfolio Settings Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Settings</h2>
        <form onSubmit={handleSettingsSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Theme</label>
            <input
              type="text"
              name="theme"
              value={settings.theme}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Layout</label>
            <input
              type="text"
              name="layout"
              value={settings.layout}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Primary Color</label>
            <input
              type="text"
              name="colorPrimary"
              value={settings.colorPrimary}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Secondary Color</label>
            <input
              type="text"
              name="colorSecondary"
              value={settings.colorSecondary}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Font Family</label>
            <input
              type="text"
              name="fontFamily"
              value={settings.fontFamily}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Settings
          </button>
        </form>
      </div>

      {/* Projects Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <form onSubmit={handleProjectSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newProject.title}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleProjectChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Project
          </button>
        </form>
        <div>
          {projects.map(project => (
            <div key={project.id} className="flex justify-between items-center mb-2">
              <span>{project.title}</span>
              <button
                onClick={() => handleDelete('project', project.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <form onSubmit={handleSkillSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Skill ID</label>
            <input
              type="text"
              name="skillId"
              value={newSkill.skillId}
              onChange={handleSkillChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Proficiency (1-5)</label>
            <input
              type="number"
              name="proficiency"
              value={newSkill.proficiency}
              onChange={handleSkillChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              max="5"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Skill
          </button>
        </form>
        <div>
          {skills.map(skill => (
            <div key={skill.id} className="flex justify-between items-center mb-2">
              <span>Skill ID: {skill.skillId}, Proficiency: {skill.proficiency}</span>
              <button
                onClick={() => handleDelete('skill', skill.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Education Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        <form onSubmit={handleEducationSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Institution</label>
            <input
              type="text"
              name="institution"
              value={newEducation.institution}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Degree</label>
            <input
              type="text"
              name="degree"
              value={newEducation.degree}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Education
          </button>
        </form>
        <div>
          {education.map(edu => (
            <div key={edu.id} className="flex justify-between items-center mb-2">
              <span>{edu.institution} - {edu.degree}</span>
              <button
                onClick={() => handleDelete('education', edu.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
        <form onSubmit={handleExperienceSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Company</label>
            <input
              type="text"
              name="company"
              value={newExperience.company}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={newExperience.position}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Experience
          </button>
        </form>
        <div>
          {experience.map(exp => (
            <div key={exp.id} className="flex justify-between items-center mb-2">
              <span>{exp.company} - {exp.position}</span>
              <button
                onClick={() => handleDelete('experience', exp.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Social Links</h2>
        <form onSubmit={handleSocialLinkSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Platform</label>
            <input
              type="text"
              name="platform"
              value={newSocialLink.platform}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL</label>
            <input
              type="text"
              name="url"
              value={newSocialLink.url}
              onChange={handleSocialLinkChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Social Link
          </button>
        </form>
        <div>
          {socialLinks.map(link => (
            <div key={link.id} className="flex justify-between items-center mb-2">
              <span>{link.platform}: {link.url}</span>
              <button
                onClick={() => handleDelete('socialLink', link.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Sections Form */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Sections</h2>
        <form onSubmit={handleSectionSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700">Section Type</label>
            <select
              name="sectionType"
              value={newSection.sectionType}
              onChange={handleSectionChange}
              className="w-full px-3 py-2 border rounded"
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
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newSection.title}
              onChange={handleSectionChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Section
          </button>
        </form>
        <div>
          {sections.map(section => (
            <div key={section.id} className="flex justify-between items-center mb-2">
              <span>{section.title} ({section.sectionType})</span>
              <button
                onClick={() => handleDelete('section', section.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;