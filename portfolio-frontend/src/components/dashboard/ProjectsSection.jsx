import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getProjects,
  addProject,
  deleteProject 
} from '../../services/api';
import { uploadFile } from '../../services/fileService';
import FileUpload from '../common/FileUpload';

const ProjectsSection = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '',
    thumbnail: '',
    project_url: '',
    github_url: '',
    featured: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects data');
      console.error(err);
    }
  };

  const handleProjectChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewProject({ ...newProject, [e.target.name]: value });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProject(newProject);
      setNewProject({ 
        title: '', 
        description: '',
        thumbnail: '',
        project_url: '',
        github_url: '',
        featured: false
      });
      loadProjects();
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to add project');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Projects</h1>
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add Project</h2>
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
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm">No projects added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <div key={project.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-white">{project.title}</h3>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
                
                {project.thumbnail && (
                  <div className="mb-3">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {project.description && (
                  <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {project.project_url && (
                    <a 
                      href={project.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-xs flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Project
                    </a>
                  )}
                  
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-xs flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                      </svg>
                      GitHub Repository
                    </a>
                  )}
                  
                  {project.featured && (
                    <span className="text-yellow-400 text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection; 