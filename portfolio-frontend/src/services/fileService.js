import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Upload a file to the server
export const uploadFile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete a file from the server
export const deleteFile = async (filename) => {
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
    
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}; 