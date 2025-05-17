package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.model.*;
import com.example.portfoliobackend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PortfolioSettingsRepository portfolioSettingsRepository;
    private final ProjectRepository projectRepository;
    private final UserSkillRepository userSkillRepository;
    private final EducationRepository educationRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final PortfolioSectionRepository portfolioSectionRepository;

    public ProfileController(UserRepository userRepository,
                             PortfolioSettingsRepository portfolioSettingsRepository,
                             ProjectRepository projectRepository,
                             UserSkillRepository userSkillRepository,
                             EducationRepository educationRepository,
                             WorkExperienceRepository workExperienceRepository,
                             SocialLinkRepository socialLinkRepository,
                             PortfolioSectionRepository portfolioSectionRepository) {
        this.userRepository = userRepository;
        this.portfolioSettingsRepository = portfolioSettingsRepository;
        this.projectRepository = projectRepository;
        this.userSkillRepository = userSkillRepository;
        this.educationRepository = educationRepository;
        this.workExperienceRepository = workExperienceRepository;
        this.socialLinkRepository = socialLinkRepository;
        this.portfolioSectionRepository = portfolioSectionRepository;
    }

    // User Profile Update
    @GetMapping
    public ResponseEntity<?> getProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        
        // Create a custom response map with snake_case keys to match frontend expectations
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("first_name", user.getFirstName());
        response.put("last_name", user.getLastName());
        response.put("bio", user.getBio());
        response.put("profile_image", user.getProfileImage());
        response.put("job_title", user.getJobTitle());
        response.put("location", user.getLocation());
        response.put("created_at", user.getCreatedAt());
        response.put("updated_at", user.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        user.setProfileImage(request.getProfileImage());
        user.setJobTitle(request.getJobTitle());
        user.setLocation(request.getLocation());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // Portfolio Settings
    @GetMapping("/settings")
    public ResponseEntity<?> getPortfolioSettings() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        
        PortfolioSettings settings = portfolioSettingsRepository.findByUserId(user.getId())
                .orElse(null);
                
        // If settings don't exist, create default settings
        if (settings == null) {
            settings = new PortfolioSettings();
            settings.setUserId(user.getId());
            settings.setTheme("default");
            settings.setLayout("standard");
            settings.setColorPrimary("#007bff");
            settings.setColorSecondary("#6c757d");
            settings.setFontFamily("Roboto, sans-serif");
            settings.setIsPublic(true); // Set portfolio to public by default
            settings.setUpdatedAt(LocalDateTime.now());
            portfolioSettingsRepository.save(settings);
        }
        
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updatePortfolioSettings(@Valid @RequestBody PortfolioSettings settings) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        PortfolioSettings existingSettings = portfolioSettingsRepository.findByUserId(user.getId())
                .orElse(new PortfolioSettings());
        existingSettings.setUserId(user.getId());
        existingSettings.setTheme(settings.getTheme());
        existingSettings.setLayout(settings.getLayout());
        existingSettings.setColorPrimary(settings.getColorPrimary());
        existingSettings.setColorSecondary(settings.getColorSecondary());
        existingSettings.setFontFamily(settings.getFontFamily());
        existingSettings.setIsPublic(settings.getIsPublic());
        existingSettings.setUpdatedAt(LocalDateTime.now());
        portfolioSettingsRepository.save(existingSettings);
        return ResponseEntity.ok("Settings updated");
    }

    // Projects
    @GetMapping("/projects")
    public ResponseEntity<?> getProjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Project> projects = projectRepository.findByUserId(user.getId());
        return ResponseEntity.ok(projects);
    }

    @PostMapping("/projects")
    public ResponseEntity<?> addProject(@Valid @RequestBody Project project) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        project.setUserId(user.getId());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
        return ResponseEntity.ok("Project added");
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Project existingProject = projectRepository.findById(id)
                .filter(p -> p.getUserId().equals(user.getId()))
                .orElse(null);
        if (existingProject == null) {
            return ResponseEntity.status(404).body("Project not found or unauthorized");
        }
        existingProject.setTitle(project.getTitle());
        existingProject.setDescription(project.getDescription());
        existingProject.setThumbnail(project.getThumbnail());
        existingProject.setProjectUrl(project.getProjectUrl());
        existingProject.setGithubUrl(project.getGithubUrl());
        existingProject.setFeatured(project.getFeatured());
        existingProject.setDisplayOrder(project.getDisplayOrder());
        existingProject.setStartDate(project.getStartDate());
        existingProject.setEndDate(project.getEndDate());
        existingProject.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(existingProject);
        return ResponseEntity.ok("Project updated");
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUserId().equals(user.getId()))
                .orElse(null);
        if (project == null) {
            return ResponseEntity.status(404).body("Project not found or unauthorized");
        }
        projectRepository.delete(project);
        return ResponseEntity.ok("Project deleted");
    }

    // User Skills
    @GetMapping("/skills")
    public ResponseEntity<?> getUserSkills() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addUserSkill(@Valid @RequestBody UserSkill userSkill) {
        try {
            System.out.println("Received skill: " + userSkill.getSkillId() + ", Proficiency: " + userSkill.getProficiency() + ", Years: " + userSkill.getYearsExperience());
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            // Ensure all required fields are present
            if (userSkill.getSkillId() == null) {
                return ResponseEntity.badRequest().body("Skill ID is required");
            }
            
            userSkill.setUserId(user.getId());
            
            // Set default values if not provided
            if (userSkill.getProficiency() == null) {
                userSkill.setProficiency(3);
            }
            
            if (userSkill.getYearsExperience() == null) {
                userSkill.setYearsExperience(0f);
            }
            
            UserSkill savedSkill = userSkillRepository.save(userSkill);
            System.out.println("Saved skill with ID: " + savedSkill.getId());
            
            return ResponseEntity.ok("Skill added");
        } catch (Exception e) {
            System.err.println("Error adding skill: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding skill: " + e.getMessage());
        }
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteUserSkill(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        UserSkill userSkill = userSkillRepository.findById(id)
                .filter(s -> s.getUserId().equals(user.getId()))
                .orElse(null);
        if (userSkill == null) {
            return ResponseEntity.status(404).body("Skill not found or unauthorized");
        }
        userSkillRepository.delete(userSkill);
        return ResponseEntity.ok("Skill deleted");
    }

    // Education
    @GetMapping("/education")
    public ResponseEntity<?> getEducation() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Education> education = educationRepository.findByUserId(user.getId());
        return ResponseEntity.ok(education);
    }

    @PostMapping("/education")
    public ResponseEntity<?> addEducation(@Valid @RequestBody Education education) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        education.setUserId(user.getId());
        education.setCreatedAt(LocalDateTime.now());
        education.setUpdatedAt(LocalDateTime.now());
        educationRepository.save(education);
        return ResponseEntity.ok("Education added");
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<?> updateEducation(@PathVariable Long id, @Valid @RequestBody Education education) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Education existingEducation = educationRepository.findById(id)
                .filter(e -> e.getUserId().equals(user.getId()))
                .orElse(null);
        if (existingEducation == null) {
            return ResponseEntity.status(404).body("Education not found or unauthorized");
        }
        existingEducation.setInstitution(education.getInstitution());
        existingEducation.setDegree(education.getDegree());
        existingEducation.setFieldOfStudy(education.getFieldOfStudy());
        existingEducation.setDescription(education.getDescription());
        existingEducation.setStartDate(education.getStartDate());
        existingEducation.setEndDate(education.getEndDate());
        existingEducation.setCurrentlyStudying(education.getCurrentlyStudying());
        existingEducation.setLocation(education.getLocation());
        existingEducation.setDisplayOrder(education.getDisplayOrder());
        existingEducation.setUpdatedAt(LocalDateTime.now());
        educationRepository.save(existingEducation);
        return ResponseEntity.ok("Education updated");
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Education education = educationRepository.findById(id)
                .filter(e -> e.getUserId().equals(user.getId()))
                .orElse(null);
        if (education == null) {
            return ResponseEntity.status(404).body("Education not found or unauthorized");
        }
        educationRepository.delete(education);
        return ResponseEntity.ok("Education deleted");
    }

    // Work Experience
    @GetMapping("/experience")
    public ResponseEntity<?> getWorkExperience() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<WorkExperience> experience = workExperienceRepository.findByUserId(user.getId());
        return ResponseEntity.ok(experience);
    }

    @PostMapping("/experience")
    public ResponseEntity<?> addWorkExperience(@Valid @RequestBody WorkExperience experience) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        experience.setUserId(user.getId());
        experience.setCreatedAt(LocalDateTime.now());
        experience.setUpdatedAt(LocalDateTime.now());
        workExperienceRepository.save(experience);
        return ResponseEntity.ok("Work experience added");
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<?> updateWorkExperience(@PathVariable Long id, @Valid @RequestBody WorkExperience experience) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        WorkExperience existingExperience = workExperienceRepository.findById(id)
                .filter(e -> e.getUserId().equals(user.getId()))
                .orElse(null);
        if (existingExperience == null) {
            return ResponseEntity.status(404).body("Work experience not found or unauthorized");
        }
        existingExperience.setCompany(experience.getCompany());
        existingExperience.setPosition(experience.getPosition());
        existingExperience.setDescription(experience.getDescription());
        existingExperience.setStartDate(experience.getStartDate());
        existingExperience.setEndDate(experience.getEndDate());
        existingExperience.setCurrentJob(experience.getCurrentJob());
        existingExperience.setLocation(experience.getLocation());
        existingExperience.setDisplayOrder(experience.getDisplayOrder());
        existingExperience.setUpdatedAt(LocalDateTime.now());
        workExperienceRepository.save(existingExperience);
        return ResponseEntity.ok("Work experience updated");
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<?> deleteWorkExperience(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        WorkExperience experience = workExperienceRepository.findById(id)
                .filter(e -> e.getUserId().equals(user.getId()))
                .orElse(null);
        if (experience == null) {
            return ResponseEntity.status(404).body("Work experience not found or unauthorized");
        }
        workExperienceRepository.delete(experience);
        return ResponseEntity.ok("Work experience deleted");
    }

    // Social Links
    @GetMapping("/social-links")
    public ResponseEntity<?> getSocialLinks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<SocialLink> socialLinks = socialLinkRepository.findByUserId(user.getId());
        return ResponseEntity.ok(socialLinks);
    }

    @PostMapping("/social-links")
    public ResponseEntity<?> addSocialLink(@Valid @RequestBody SocialLink socialLink) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        socialLink.setUserId(user.getId());
        socialLinkRepository.save(socialLink);
        return ResponseEntity.ok("Social link added");
    }

    @PutMapping("/social-links/{id}")
    public ResponseEntity<?> updateSocialLink(@PathVariable Long id, @Valid @RequestBody SocialLink socialLink) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        SocialLink existingSocialLink = socialLinkRepository.findById(id)
                .filter(s -> s.getUserId().equals(user.getId()))
                .orElse(null);
        if (existingSocialLink == null) {
            return ResponseEntity.status(404).body("Social link not found or unauthorized");
        }
        existingSocialLink.setPlatform(socialLink.getPlatform());
        existingSocialLink.setUrl(socialLink.getUrl());
        existingSocialLink.setDisplayOrder(socialLink.getDisplayOrder());
        existingSocialLink.setIsVisible(socialLink.getIsVisible());
        existingSocialLink.setIcon(socialLink.getIcon());
        socialLinkRepository.save(existingSocialLink);
        return ResponseEntity.ok("Social link updated");
    }

    @DeleteMapping("/social-links/{id}")
    public ResponseEntity<?> deleteSocialLink(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        SocialLink socialLink = socialLinkRepository.findById(id)
                .filter(s -> s.getUserId().equals(user.getId()))
                .orElse(null);
        if (socialLink == null) {
            return ResponseEntity.status(404).body("Social link not found or unauthorized");
        }
        socialLinkRepository.delete(socialLink);
        return ResponseEntity.ok("Social link deleted");
    }

    // Portfolio Sections
    @GetMapping("/sections")
    public ResponseEntity<?> getPortfolioSections() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<PortfolioSection> sections = portfolioSectionRepository.findByUserId(user.getId());
        return ResponseEntity.ok(sections);
    }

    @PostMapping("/sections")
    public ResponseEntity<?> addPortfolioSection(@Valid @RequestBody PortfolioSection section) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        section.setUserId(user.getId());
        portfolioSectionRepository.save(section);
        return ResponseEntity.ok("Portfolio section added");
    }

    @PutMapping("/sections/{id}")
    public ResponseEntity<?> updatePortfolioSection(@PathVariable Long id, @Valid @RequestBody PortfolioSection section) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        PortfolioSection existingSection = portfolioSectionRepository.findById(id)
                .filter(s -> s.getUserId().equals(user.getId()))
                .orElse(null);
        if (existingSection == null) {
            return ResponseEntity.status(404).body("Portfolio section not found or unauthorized");
        }
        existingSection.setSectionType(section.getSectionType());
        existingSection.setTitle(section.getTitle());
        existingSection.setDescription(section.getDescription());
        existingSection.setIsVisible(section.getIsVisible());
        existingSection.setDisplayOrder(section.getDisplayOrder());
        existingSection.setCustomContent(section.getCustomContent());
        portfolioSectionRepository.save(existingSection);
        return ResponseEntity.ok("Portfolio section updated");
    }

    @DeleteMapping("/sections/{id}")
    public ResponseEntity<?> deletePortfolioSection(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        PortfolioSection section = portfolioSectionRepository.findById(id)
                .filter(s -> s.getUserId().equals(user.getId()))
                .orElse(null);
        if (section == null) {
            return ResponseEntity.status(404).body("Portfolio section not found or unauthorized");
        }
        portfolioSectionRepository.delete(section);
        return ResponseEntity.ok("Portfolio section deleted");
    }

    static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String bio;
        private String profileImage;
        private String jobTitle;
        private String location;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getProfileImage() { return profileImage; }
        public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }
}