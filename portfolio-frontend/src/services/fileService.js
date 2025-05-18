import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Debug function to test an uploaded file URL
export const testImageUrl = (imageUrl) => {
  console.log('Image URL to test:', imageUrl);
  // Extract just the path portion from the full URL
  try {
    const url = new URL(imageUrl);
    // Try to access just the file on the server
    const testUrl = imageUrl;
    console.log('Testing URL access:', testUrl);
    // Display this URL in the console for manual verification
    console.log('Open this URL in a new tab to verify it works:', testUrl);
    return testUrl;
  } catch (error) {
    console.error('Invalid URL format:', error);
    return null;
  }
};

// Upload a file to the server
export const uploadFile = async (formData) => {
  console.log('Uploading file to:', `${API_URL}/upload`);
  console.log('FormData contents:', formData);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    console.log('Using token:', token.substring(0, 10) + '...');
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: false
    });
    
    console.log('Upload response:', response.data);
    // Debug the image URL to verify it's accessible
    if (response.data && response.data.fileUrl) {
      testImageUrl(response.data.fileUrl);
    }
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Delete a file from the server
export const deleteFile = async (filename) => {
  console.log('Deleting file:', filename);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const response = await axios.delete(`${API_URL}/upload/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: false
    });
    
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}; 