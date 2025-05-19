import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getPublicProfile, 
  getPublicProjects, 
  getPublicSkills, 
  getPublicEducation,
  getPublicExperience,
  getPublicSocialLinks,
  getPublicPortfolioSections
} from '../services/api';

// Import components
import ProfileHeader from '../components/portfolio/ProfileHeader';
import AboutSection from '../components/portfolio/AboutSection';
import PortfolioSection from '../components/portfolio/PortfolioSection';
import ProjectsList from '../components/portfolio/ProjectsList';
import ContactSection from '../components/portfolio/ContactSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import NotFoundMessage from '../components/common/NotFoundMessage';
import SkillsList from '../components/portfolio/SkillsList';

const PortfolioPage = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [portfolioSections, setPortfolioSections] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'default',
    layout: 'standard',
    color_primary: '#007bff',
    color_secondary: '#6c757d',
    font_family: 'Roboto, sans-serif'
  });

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to fetch portfolio data for username:', username);

        // Fetch all portfolio data in parallel
        const [
          profileRes,
          projectsRes,
          skillsRes,
          educationRes,
          experienceRes,
          socialLinksRes,
          sectionsRes
        ] = await Promise.all([
          getPublicProfile(username).catch(err => {
            console.error('Error fetching profile:', err.response?.status, err.response?.data || err.message);
            throw err;
          }),
          getPublicProjects(username).catch(err => {
            console.error('Error fetching projects:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          }),
          getPublicSkills(username).catch(err => {
            console.error('Error fetching skills:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          }),
          getPublicEducation(username).catch(err => {
            console.error('Error fetching education:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          }),
          getPublicExperience(username).catch(err => {
            console.error('Error fetching experience:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          }),
          getPublicSocialLinks(username).catch(err => {
            console.error('Error fetching social links:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          }),
          getPublicPortfolioSections(username).catch(err => {
            console.error('Error fetching portfolio sections:', err.response?.status, err.response?.data || err.message);
            return { data: [] };
          })
        ]);
        
        console.log('Profile data received:', profileRes.data);
        console.log('Projects data received:', projectsRes.data);
        console.log('Portfolio sections received:', sectionsRes.data);
        
        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setEducation(educationRes.data);
        setExperience(experienceRes.data);
        setSocialLinks(socialLinksRes.data);
        setPortfolioSections(sectionsRes.data);

        // If portfolio settings are included in the profile response
        if (profileRes.data.settings) {
          console.log('Settings found in profile response:', profileRes.data.settings);
          setSettings(profileRes.data.settings);
        } else {
          console.log('No settings found in profile response');
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        console.error('Error details:', err.response?.status, err.response?.data);
        setError('Could not load the portfolio. It may be private or not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [username]);

  // Apply theme settings
  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--primary-color', settings.color_primary);
      document.documentElement.style.setProperty('--secondary-color', settings.color_secondary);
      document.documentElement.style.setProperty('--font-family', settings.font_family);
    }
  }, [settings]);

  // For debugging - log when portfolio sections or projects change
  useEffect(() => {
    console.log('Current portfolio sections:', portfolioSections);
    // Check if projects section exists
    const hasProjectsSection = portfolioSections.some(section => section.section_type === 'projects');
    console.log('Has projects section:', hasProjectsSection);
  }, [portfolioSections]);

  useEffect(() => {
    console.log('Current projects:', projects);
  }, [projects]);

  // Gets the sections to display in order
  const getSortedSections = () => {
    return portfolioSections
      .filter(section => section.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!profile) {
    return <NotFoundMessage />;
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileHeader profile={profile} socialLinks={socialLinks} />
      <AboutSection bio={profile.bio} />

      {/* Skills section if not in custom sections and skills exist */}
      {skills.length > 0 && !portfolioSections.some(section => section.section_type === 'skills') && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Skills & Expertise</h2>
          <SkillsList skills={skills} />
        </div>
      )}

      {/* Projects section if not in custom sections */}
      {projects.length > 0 && !portfolioSections.some(section => section.section_type === 'projects') && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Projects</h2>
          <ProjectsList projects={projects} />
        </div>
      )}

      {/* Display custom sections in order */}
      {getSortedSections().map(section => (
        <PortfolioSection 
          key={section.id}
          section={section}
          skills={skills}
          projects={projects}
          education={education}
          experience={experience}
        />
      ))}

      <ContactSection socialLinks={socialLinks} />
    </div>
  );
};

export default PortfolioPage; 