import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  // If user is authenticated, show personalized content
  if (user) {
    return (
      <div className="container mx-auto px-4 py-12 animate-fadeIn">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-purple-400">{user.first_name && user.last_name|| user.username}</span>
          </h1>
          <p className="text-lg text-gray-300">
            Manage your portfolio and showcase your professional journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dashboard</h3>
            <p className="text-gray-300 mb-4">Manage all aspects of your portfolio in one place.</p>
            <Link 
              to="/dashboard" 
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">View Portfolio</h3>
            <p className="text-gray-300 mb-4">See how your portfolio looks to others.</p>
            <Link 
              to={`/portfolio/${user.username}`} 
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
            >
              View Portfolio
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
            <p className="text-gray-300 mb-4">Update your personal information and portfolio settings.</p>
            <Link 
              to="/dashboard" 
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Add Projects</h3>
            <p className="text-gray-300 mb-4">Showcase your work by adding new projects to your portfolio.</p>
            <Link 
              to="/dashboard" 
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
            >
              Manage Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For non-authenticated users, show the original content
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Create Your Professional
          <span className="text-purple-400"> Portfolio</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Showcase your skills, projects, and experience with a beautiful, customizable portfolio.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link 
            to="/register" 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium text-white transition-colors"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium text-white transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Showcase Projects</h3>
          <p className="text-gray-300">Display your best work with detailed project descriptions, images, and links.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Highlight Skills</h3>
          <p className="text-gray-300">Show off your technical abilities and expertise with a visually appealing skills section.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Secure & Professional</h3>
          <p className="text-gray-300">Create a professional online presence with a secure, customizable platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;