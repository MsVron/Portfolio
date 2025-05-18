import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

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