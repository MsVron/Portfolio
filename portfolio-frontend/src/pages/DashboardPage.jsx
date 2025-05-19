import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProfileEditorView from '../components/dashboard/ProfileEditorView';
import Sidebar from '../components/dashboard/Sidebar';
import EducationSection from '../components/dashboard/EducationSection';
import SkillsSection from '../components/dashboard/SkillsSection';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ExperienceSection from '../components/dashboard/ExperienceSection';
import SocialsSection from '../components/dashboard/SocialsSection';
import AddProjectsSectionScript from './AddProjectsSectionScript';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState('profile');

  if (!user) return <div className="container mx-auto p-4">Please log in.</div>;

  // Render the active component based on the selected sidebar item
  const renderContent = () => {
    switch (activeItem) {
      case 'profile':
        return <ProfileEditorView />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'socials':
        return <SocialsSection />;
      default:
        return <ProfileEditorView />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Profile Management</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>
        
        {/* Content Area */}
        <div className="md:w-3/4 flex-1">
          {renderContent()}
          <AddProjectsSectionScript />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;