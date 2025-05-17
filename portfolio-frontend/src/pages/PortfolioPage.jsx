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

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4 text-white">Portfolio Not Found</h2>
          <p className="text-gray-300">The portfolio you're looking for doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  // Gets the sections to display in order
  const getSortedSections = () => {
    return portfolioSections
      .filter(section => section.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {profile.profile_image && (
            <img 
              src={profile.profile_image} 
              alt={`${profile.first_name} ${profile.last_name}`} 
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {profile.first_name} {profile.last_name}
            </h1>
            {profile.job_title && (
              <h2 className="text-xl text-purple-400 mb-2">{profile.job_title}</h2>
            )}
            {profile.location && (
              <p className="text-gray-300 mb-4">
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              </p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {socialLinks.map(link => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-700 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
                    title={link.platform}
                  >
                    <i className={link.icon || 'fas fa-link'} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Me Section */}
      {profile.bio && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">About Me</h2>
          <p className="text-gray-300 whitespace-pre-line">{profile.bio}</p>
        </div>
      )}

      {/* Display Sections in Order */}
      {getSortedSections().map(section => {
        // Render different content based on section type
        let sectionContent = <p className="text-gray-300">{section.description}</p>;
        
        if (section.section_type === 'skills' && skills.length > 0) {
          sectionContent = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-medium">{skill.name || `Skill ID: ${skill.skill_id}`}</span>
                    <span className="text-gray-300 text-sm">{skill.years_experience > 0 ? `${skill.years_experience} years` : ''}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{width: `${(skill.proficiency / 5) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          );
        } else if (section.section_type === 'projects' && projects.length > 0) {
          sectionContent = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  {project.thumbnail && (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}
                  <p className="text-gray-300 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.project_url && (
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        } else if (section.section_type === 'education' && education.length > 0) {
          sectionContent = (
            <div className="space-y-4">
              {education.map(item => (
                <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white">{item.institution}</h3>
                  <p className="text-purple-400">{item.degree}{item.field_of_study ? ` in ${item.field_of_study}` : ''}</p>
                  <p className="text-gray-300">
                    {new Date(item.start_date).toLocaleDateString()} - 
                    {item.currently_studying ? ' Present' : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''}
                  </p>
                  {item.location && <p className="text-gray-400">{item.location}</p>}
                </div>
              ))}
            </div>
          );
        } else if (section.section_type === 'experience' && experience.length > 0) {
          sectionContent = (
            <div className="space-y-4">
              {experience.map(item => (
                <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white">{item.position}</h3>
                  <p className="text-purple-400">{item.company}</p>
                  <p className="text-gray-300">
                    {new Date(item.start_date).toLocaleDateString()} - 
                    {item.current_job ? ' Present' : item.end_date ? ` ${new Date(item.end_date).toLocaleDateString()}` : ''}
                  </p>
                  {item.location && <p className="text-gray-400 mb-2">{item.location}</p>}
                  {item.description && <p className="text-gray-300 whitespace-pre-line">{item.description}</p>}
                </div>
              ))}
            </div>
          );
        }
        
        return (
          <div key={section.id} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
            {sectionContent}
          </div>
        );
      })}

      {/* Contact Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Contact Me</h2>
        <p className="text-gray-300 mb-4">Interested in working together? Feel free to reach out!</p>
        {socialLinks.some(link => link.platform === 'email') ? (
          <a 
            href={socialLinks.find(link => link.platform === 'email').url} 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        ) : (
          <p className="text-gray-400">Contact information not available</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;