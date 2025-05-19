import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error(`API Error: ${error.config?.method?.toUpperCase() || 'UNKNOWN'} ${error.config?.url || 'UNKNOWN'}`, 
      error.response?.status || 'No status', 
      error.response?.data || error.message || 'No error message'
    );
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getUser = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const getProfile = () => api.get('/profile');
export const getPortfolioSettings = () => api.get('/profile/settings');
export const updatePortfolioSettings = (data) => api.put('/profile/settings', data);
export const getProjects = () => api.get('/profile/projects');
export const addProject = (data) => api.post('/profile/projects', data);
export const updateProject = (id, data) => api.put(`/profile/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/profile/projects/${id}`);
export const getUserSkills = () => api.get('/profile/skills');
export const addUserSkill = (data) => {
  console.log("In API service, sending skill data:", data);
  console.log("skillId type:", typeof data.skillId, "value:", data.skillId);
  return api.post('/profile/skills', data);
};
export const deleteUserSkill = (id) => api.delete(`/profile/skills/${id}`);
export const getAllSkills = () => api.get('/skills');
export const getEducation = () => api.get('/profile/education');
export const addEducation = (data) => api.post('/profile/education', data);
export const updateEducation = (id, data) => api.put(`/profile/education/${id}`, data);
export const deleteEducation = (id) => api.delete(`/profile/education/${id}`);
export const getWorkExperience = () => api.get('/profile/experience');
export const addWorkExperience = (data) => api.post('/profile/experience', data);
export const updateWorkExperience = (id, data) => api.put(`/profile/experience/${id}`, data);
export const deleteWorkExperience = (id) => api.delete(`/profile/experience/${id}`);
export const getSocialLinks = () => api.get('/profile/social-links');
export const addSocialLink = (data) => api.post('/profile/social-links', data);
export const updateSocialLink = (id, data) => api.put(`/profile/social-links/${id}`, data);
export const deleteSocialLink = (id) => api.delete(`/profile/social-links/${id}`);
export const getPortfolioSections = () => api.get('/profile/sections');
export const addPortfolioSection = (data) => api.post('/profile/sections', data);
export const updatePortfolioSection = (id, data) => api.put(`/profile/sections/${id}`, data);
export const deletePortfolioSection = (id) => api.delete(`/profile/sections/${id}`);

// Public portfolio endpoints (no auth required)
export const getPublicProfile = (username) => api.get(`/portfolios/${username}`);
export const getPublicProjects = (username) => api.get(`/portfolios/${username}/projects`);
export const getPublicSkills = (username) => api.get(`/portfolios/${username}/skills`);
export const getPublicEducation = (username) => api.get(`/portfolios/${username}/education`);
export const getPublicExperience = (username) => api.get(`/portfolios/${username}/experience`);
export const getPublicSocialLinks = (username) => api.get(`/portfolios/${username}/social-links`);
export const getPublicPortfolioSections = (username) => api.get(`/portfolios/${username}/sections`);

export default api;