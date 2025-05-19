// Skill data (icons removed)
const skillLogos = {
  // Programming Languages
  "JavaScript": {
    color: "#f7df1e"
  },
  "Python": {
    color: "#3776ab"
  },
  "Java": {
    color: "#007396"
  },
  "HTML": {
    color: "#e34f26"
  },
  "CSS": {
    color: "#1572b6"
  },
  "React": {
    color: "#61dafb"
  },
  // Add more skills as needed
};

// Default data for skills without specific information
const defaultLogo = {
  color: "#6c757d"
};

// Function to get the data for a given skill
export const getSkillLogo = (skillName) => {
  // Handle null or undefined skillName
  if (!skillName) return defaultLogo;
  
  // First, try direct match
  if (skillLogos[skillName]) {
    return skillLogos[skillName];
  }
  
  // If no direct match, try case-insensitive match
  const normalizedSkillName = skillName.toLowerCase();
  
  for (const key in skillLogos) {
    if (key.toLowerCase() === normalizedSkillName) {
      return skillLogos[key];
    }
  }
  
  // Check for partial matches (e.g., "JavaScript (ES6)" should match "JavaScript")
  for (const key in skillLogos) {
    if (normalizedSkillName.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedSkillName)) {
      return skillLogos[key];
    }
  }
  
  // No match found, return default
  console.log(`No data found for skill: ${skillName}`);
  return defaultLogo;
};

// Function removed since icons are no longer used
export default skillLogos;