-- Users table to store basic authentication and personal info
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    profile_image VARCHAR(255),
    job_title VARCHAR(100),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portfolio settings and customization
CREATE TABLE portfolio_settings (
    settings_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    theme VARCHAR(50) DEFAULT 'default',
    layout VARCHAR(50) DEFAULT 'standard',
    color_primary VARCHAR(20) DEFAULT '#007bff',
    color_secondary VARCHAR(20) DEFAULT '#6c757d',
    font_family VARCHAR(100) DEFAULT 'Roboto, sans-serif',
    custom_domain VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    custom_css TEXT,
    custom_js TEXT,
    meta_description TEXT,
    meta_keywords VARCHAR(255),
    google_analytics_id VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Projects table to showcase developer work
CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Project media (screenshots, videos)
CREATE TABLE project_media (
    media_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    media_type ENUM('image', 'video', 'document') NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Skills and technologies
CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50)
);

-- User skills (many-to-many relationship)
CREATE TABLE user_skills (
    user_skill_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency TINYINT DEFAULT 3, -- Scale of 1-5
    years_experience DECIMAL(4,1),
    display_order INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, skill_id)
);

-- Project technologies (many-to-many relationship)
CREATE TABLE project_skills (
    project_skill_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    UNIQUE KEY (project_id, skill_id)
);

-- Education and certifications
CREATE TABLE education (
    education_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    institution VARCHAR(100) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    currently_studying BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Work experience
CREATE TABLE work_experience (
    experience_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    current_job BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Responsibilities/achievements for work experience
CREATE TABLE experience_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    experience_id INT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (experience_id) REFERENCES work_experience(experience_id) ON DELETE CASCADE
);

-- Social links and contact info
CREATE TABLE social_links (
    link_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL, -- GitHub, LinkedIn, Twitter, etc.
    url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    icon VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Portfolio sections (customizable sections and their ordering)
CREATE TABLE portfolio_sections (
    section_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    section_type ENUM('about', 'projects', 'skills', 'experience', 'education', 'contact', 'custom') NOT NULL,
    title VARCHAR(100),
    description TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    custom_content TEXT, -- For custom section content (HTML)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Reset password tokens
CREATE TABLE password_reset_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Session management
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
---
-- Insert some initial skill categories
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming Languages'),
('Python', 'Programming Languages'),
('Java', 'Programming Languages'),
('C#', 'Programming Languages'),
('PHP', 'Programming Languages'),
('HTML', 'Frontend'),
('CSS', 'Frontend'),
('React', 'Frontend Frameworks'),
('Angular', 'Frontend Frameworks'),
('Vue.js', 'Frontend Frameworks'),
('Node.js', 'Backend'),
('Express', 'Backend Frameworks'),
('Django', 'Backend Frameworks'),
('Laravel', 'Backend Frameworks'),
('Spring Boot', 'Backend Frameworks'),
('MySQL', 'Databases'),
('PostgreSQL', 'Databases'),
('MongoDB', 'Databases'),
('Redis', 'Databases'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Google Cloud', 'Cloud'),
('Git', 'Tools'),
('GitHub', 'Tools'),
('GitLab', 'Tools'),
('Jira', 'Tools'),
('Figma', 'Design'),
('Adobe XD', 'Design');