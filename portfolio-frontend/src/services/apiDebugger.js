/**
 * API Debugging Utility
 * 
 * This utility helps trace and debug API calls related to user skills
 * and other database interactions.
 */

let debugHistory = [];
const MAX_HISTORY = 50;

/**
 * Logs API request details and adds them to history
 * 
 * @param {string} endpoint - The API endpoint being called
 * @param {string} method - HTTP method being used
 * @param {object} data - Request data (if applicable)
 */
export const logApiRequest = (endpoint, method, data = null) => {
  const entry = {
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    data,
    status: 'pending'
  };
  
  debugHistory.unshift(entry);
  if (debugHistory.length > MAX_HISTORY) {
    debugHistory = debugHistory.slice(0, MAX_HISTORY);
  }
  
  console.group(`📡 API Request: ${method} ${endpoint}`);
  console.log('Timestamp:', entry.timestamp);
  if (data) console.log('Request Data:', data);
  console.groupEnd();
  
  return entry;
};

/**
 * Updates the history entry with response data
 * 
 * @param {object} entry - The original request entry
 * @param {object} response - The API response
 */
export const logApiResponse = (entry, response) => {
  entry.status = 'success';
  entry.response = {
    status: response.status,
    statusText: response.statusText,
    data: response.data
  };
  
  console.group(`✅ API Response: ${entry.method} ${entry.endpoint}`);
  console.log('Status:', response.status);
  console.log('Data:', response.data);
  
  // Specific tracing for skills-related endpoints
  if (entry.endpoint.includes('/skills')) {
    if (Array.isArray(response.data)) {
      console.log('Skills Count:', response.data.length);
      if (response.data.length > 0) {
        console.log('First Skill Item:', response.data[0]);
        console.log('Skills Structure:', Object.keys(response.data[0]).join(', '));
      }
    }
  }
  
  console.groupEnd();
};

/**
 * Logs API errors
 * 
 * @param {object} entry - The original request entry
 * @param {object} error - The error object
 */
export const logApiError = (entry, error) => {
  entry.status = 'error';
  entry.error = {
    message: error.message,
    responseStatus: error.response?.status,
    responseData: error.response?.data
  };
  
  console.group(`❌ API Error: ${entry.method} ${entry.endpoint}`);
  console.error('Error Message:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Response Data:', error.response.data);
  }
  console.groupEnd();
};

/**
 * Gets all logged API history
 */
export const getApiDebugHistory = () => debugHistory;

/**
 * Clears all API debug history
 */
export const clearApiDebugHistory = () => {
  debugHistory = [];
};

/**
 * Specific function to check for user_skills table data
 * 
 * @param {Array} data - The skills data array to analyze
 * @returns {object} Analysis of the skills data
 */
export const analyzeSkillsData = (data) => {
  if (!Array.isArray(data)) {
    console.error('❌ Skills data is not an array!', data);
    return {
      isValid: false,
      error: 'Data is not an array'
    };
  }
  
  const analysis = {
    isValid: true,
    count: data.length,
    hasData: data.length > 0,
    fields: data.length > 0 ? Object.keys(data[0]) : [],
    hasRequiredFields: false,
    missingSkillNames: 0,
    missingCategories: 0,
    missingIds: 0
  };
  
  if (data.length > 0) {
    // Check if the data has all required fields
    const requiredFields = ['id', 'skillId', 'skillName', 'proficiency'];
    const sample = data[0];
    const hasAllRequired = requiredFields.every(field => 
      sample[field] !== undefined || 
      sample[field.replace(/([A-Z])/g, '_$1').toLowerCase()] !== undefined
    );
    
    analysis.hasRequiredFields = hasAllRequired;
    
    // Count missing data
    analysis.missingSkillNames = data.filter(s => !s.skillName && !s.name).length;
    analysis.missingCategories = data.filter(s => !s.category).length;
    analysis.missingIds = data.filter(s => (!s.skillId && !s.skill_id) || (!s.id)).length;
  }
  
  // Log the analysis
  console.group('🔍 Skills Data Analysis');
  console.log(analysis);
  console.groupEnd();
  
  return analysis;
};

export default {
  logApiRequest,
  logApiResponse,
  logApiError,
  getApiDebugHistory,
  clearApiDebugHistory,
  analyzeSkillsData
}; 