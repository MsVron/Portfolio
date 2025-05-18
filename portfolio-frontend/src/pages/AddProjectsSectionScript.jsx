import React, { useEffect, useState } from 'react';
import { addPortfolioSection, getPortfolioSections } from '../services/api';

const AddProjectsSectionScript = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAndAddProjectsSection = async () => {
      try {
        setLoading(true);
        
        // Check if Projects section already exists
        const sectionsResponse = await getPortfolioSections();
        const sections = sectionsResponse.data || [];
        const projectsSection = sections.find(section => section.section_type === 'projects');
        
        if (projectsSection) {
          setMessage('Projects section already exists.');
          return;
        }
        
        // Add Projects section if it doesn't exist
        const newSection = {
          section_type: 'projects',
          title: 'Projects',
          description: 'My portfolio of work',
          is_visible: true,
          display_order: sections.length // Set it as the last section
        };
        
        await addPortfolioSection(newSection);
        setMessage('Projects section added successfully!');
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Error: ${error.message || 'Failed to add Projects section'}`);
      } finally {
        setLoading(false);
      }
    };

    checkAndAddProjectsSection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg border border-purple-600 z-50">
      <h3 className="text-white font-bold mb-2">Portfolio Section Helper</h3>
      {loading ? (
        <p className="text-gray-300">Working...</p>
      ) : (
        <p className="text-gray-300">{message}</p>
      )}
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm"
      >
        Reload Page
      </button>
    </div>
  );
};

export default AddProjectsSectionScript; 