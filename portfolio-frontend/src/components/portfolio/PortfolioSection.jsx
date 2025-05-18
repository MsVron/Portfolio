import React from 'react';
import SkillsList from './SkillsList';
import ProjectsList from './ProjectsList';
import EducationList from './EducationList';
import ExperienceList from './ExperienceList';

const PortfolioSection = ({ section, skills, projects, education, experience }) => {
  // Render different content based on section type
  let sectionContent = <p className="text-gray-300">{section.description}</p>;
        
  if (section.section_type === 'skills' && skills.length > 0) {
    sectionContent = <SkillsList skills={skills} />;
  } else if (section.section_type === 'projects' && projects.length > 0) {
    sectionContent = <ProjectsList projects={projects} />;
  } else if (section.section_type === 'education' && education.length > 0) {
    sectionContent = <EducationList education={education} />;
  } else if (section.section_type === 'experience' && experience.length > 0) {
    sectionContent = <ExperienceList experience={experience} />;
  }
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
      {sectionContent}
    </div>
  );
};

export default PortfolioSection; 