import React from 'react';

const ContactSection = ({ socialLinks }) => {
  return (
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
  );
};

export default ContactSection; 