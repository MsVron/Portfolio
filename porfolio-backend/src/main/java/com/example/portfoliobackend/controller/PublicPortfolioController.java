package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.model.*;
import com.example.portfoliobackend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolios")
public class PublicPortfolioController {

    private final UserRepository userRepository;
    private final PortfolioSettingsRepository portfolioSettingsRepository;
    private final ProjectRepository projectRepository;
    private final UserSkillRepository userSkillRepository;
    private final EducationRepository educationRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final PortfolioSectionRepository portfolioSectionRepository;

    public PublicPortfolioController(UserRepository userRepository,
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
    
    // Helper method to check if portfolio is public
    private boolean isPortfolioPublic(Long userId) {
        PortfolioSettings settings = portfolioSettingsRepository.findByUserId(userId).orElse(null);
        // Debug logging
        System.out.println("DEBUG - isPortfolioPublic check for userId: " + userId);
        System.out.println("DEBUG - PortfolioSettings found: " + (settings != null));
        if (settings != null) {
            System.out.println("DEBUG - settings.getIsPublic() value: " + settings.getIsPublic());
        }
        
        // If settings don't exist or isPublic is null, assume it's private
        // If isPublic is explicitly set to true, then it's public
        return settings != null && settings.getIsPublic() != null && settings.getIsPublic();
    }
    
    // Helper method to validate user and check if portfolio is public
    private ResponseEntity<?> validateUserAndPortfolio(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (!isPortfolioPublic(user.getId())) {
            return ResponseEntity.status(403).body("This portfolio is private");
        }
        
        return null; // No error
    }

    // Get public profile by username
    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicProfile(@PathVariable String username) {
        System.out.println("DEBUG - getPublicProfile called for username: " + username);
        
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            System.out.println("DEBUG - User not found: " + username);
            return ResponseEntity.status(404).body("User not found");
        }
        
        System.out.println("DEBUG - User found with ID: " + user.getId());

        // Check if portfolio is public
        boolean isPublic = isPortfolioPublic(user.getId());
        System.out.println("DEBUG - Portfolio is public: " + isPublic);
        
        if (!isPublic) {
            return ResponseEntity.status(403).body("This portfolio is private");
        }
        
        // Get portfolio settings
        PortfolioSettings settings = portfolioSettingsRepository.findByUserId(user.getId()).orElse(null);
        
        // Create a custom response map with snake_case keys to match frontend expectations
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("first_name", user.getFirstName());
        response.put("last_name", user.getLastName());
        response.put("bio", user.getBio());
        response.put("profile_image", user.getProfileImage());
        response.put("job_title", user.getJobTitle());
        response.put("location", user.getLocation());
        
        // Include portfolio settings
        Map<String, Object> settingsMap = new HashMap<>();
        if (settings != null) {
            settingsMap.put("theme", settings.getTheme());
            settingsMap.put("layout", settings.getLayout());
            settingsMap.put("color_primary", settings.getColorPrimary());
            settingsMap.put("color_secondary", settings.getColorSecondary());
            settingsMap.put("font_family", settings.getFontFamily());
        }
        response.put("settings", settingsMap);
        
        System.out.println("DEBUG - Successfully prepared response for username: " + username);
        
        return ResponseEntity.ok(response);
    }

    // Get public projects by username
    @GetMapping("/{username}/projects")
    public ResponseEntity<?> getPublicProjects(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<Project> projects = projectRepository.findByUserId(user.getId());
        return ResponseEntity.ok(projects);
    }

    // Get public skills by username
    @GetMapping("/{username}/skills")
    public ResponseEntity<?> getPublicSkills(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());
        return ResponseEntity.ok(skills);
    }

    // Get public education by username
    @GetMapping("/{username}/education")
    public ResponseEntity<?> getPublicEducation(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<Education> education = educationRepository.findByUserId(user.getId());
        return ResponseEntity.ok(education);
    }

    // Get public work experience by username
    @GetMapping("/{username}/experience")
    public ResponseEntity<?> getPublicExperience(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<WorkExperience> experience = workExperienceRepository.findByUserId(user.getId());
        return ResponseEntity.ok(experience);
    }

    // Get public social links by username
    @GetMapping("/{username}/social-links")
    public ResponseEntity<?> getPublicSocialLinks(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<SocialLink> socialLinks = socialLinkRepository.findByUserId(user.getId());
        return ResponseEntity.ok(socialLinks);
    }

    // Get public portfolio sections by username
    @GetMapping("/{username}/sections")
    public ResponseEntity<?> getPublicPortfolioSections(@PathVariable String username) {
        ResponseEntity<?> validationResult = validateUserAndPortfolio(username);
        if (validationResult != null) {
            return validationResult;
        }
        
        User user = userRepository.findByUsername(username).orElse(null);
        List<PortfolioSection> sections = portfolioSectionRepository.findByUserId(user.getId());
        return ResponseEntity.ok(sections);
    }

    // Debug endpoint to check all users and their portfolio settings
    @GetMapping("/debug/check-all-users")
    public ResponseEntity<?> checkAllUsers() {
        List<User> allUsers = userRepository.findAll();
        System.out.println("DEBUG - Total users in system: " + allUsers.size());
        
        List<Map<String, Object>> results = allUsers.stream().map(user -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            
            PortfolioSettings settings = portfolioSettingsRepository.findByUserId(user.getId()).orElse(null);
            if (settings != null) {
                userInfo.put("has_settings", true);
                userInfo.put("is_public", settings.getIsPublic());
                userInfo.put("settings_id", settings.getId());
            } else {
                userInfo.put("has_settings", false);
            }
            
            return userInfo;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(results);
    }
    
    // Debug endpoint to create or fix portfolio settings for a user
    @GetMapping("/debug/fix-settings/{username}")
    public ResponseEntity<?> fixUserSettings(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found: " + username);
        }
        
        PortfolioSettings settings = portfolioSettingsRepository.findByUserId(user.getId()).orElse(null);
        boolean created = false;
        
        if (settings == null) {
            settings = new PortfolioSettings();
            settings.setUserId(user.getId());
            created = true;
        }
        
        // Ensure all values are set properly
        settings.setTheme("default");
        settings.setLayout("standard");
        settings.setColorPrimary("#007bff");
        settings.setColorSecondary("#6c757d");
        settings.setFontFamily("Roboto, sans-serif");
        settings.setIsPublic(true); // Explicitly set to public
        settings.setUpdatedAt(LocalDateTime.now());
        
        portfolioSettingsRepository.save(settings);
        
        return ResponseEntity.ok(Map.of(
            "message", created ? "Created new settings" : "Updated existing settings",
            "user_id", user.getId(),
            "username", user.getUsername(),
            "settings_id", settings.getId(),
            "is_public", settings.getIsPublic()
        ));
    }

    // Debug endpoint to fix all portfolio settings
    @GetMapping("/debug/fix-all-settings")
    public ResponseEntity<?> fixAllPortfolioSettings() {
        try {
            List<PortfolioSettings> allSettings = portfolioSettingsRepository.findAll();
            System.out.println("DEBUG - Total portfolio settings: " + allSettings.size());
            
            int updatedCount = 0;
            for (PortfolioSettings settings : allSettings) {
                if (settings.getIsPublic() == null) {
                    settings.setIsPublic(true);
                    portfolioSettingsRepository.save(settings);
                    updatedCount++;
                    System.out.println("DEBUG - Updated settings for user ID: " + settings.getUserId());
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Updated portfolio settings", 
                "updated_count", updatedCount,
                "total_settings", allSettings.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating settings: " + e.getMessage());
        }
    }

    // Debug endpoint to directly fix portfolio settings for a username
    @GetMapping("/debug/direct-fix/{username}")
    public ResponseEntity<?> directFix(@PathVariable String username) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found: " + username);
            }
            
            System.out.println("DEBUG - Found user: " + username + " with ID: " + user.getId());
            
            // Get existing settings or create new ones
            PortfolioSettings settings = portfolioSettingsRepository.findByUserId(user.getId()).orElse(null);
            
            if (settings == null) {
                // Create new settings
                settings = new PortfolioSettings();
                settings.setUserId(user.getId());
                settings.setTheme("default");
                settings.setLayout("standard");
                settings.setColorPrimary("#007bff");
                settings.setColorSecondary("#6c757d");
                settings.setFontFamily("Roboto, sans-serif");
                System.out.println("DEBUG - Created new settings for user ID: " + user.getId());
            } else {
                System.out.println("DEBUG - Found existing settings for user ID: " + user.getId());
                System.out.println("DEBUG - Current isPublic value: " + settings.getIsPublic());
            }
            
            // Explicitly set isPublic to true
            settings.setIsPublic(true);
            settings.setUpdatedAt(LocalDateTime.now());
            PortfolioSettings savedSettings = portfolioSettingsRepository.save(settings);
            
            System.out.println("DEBUG - Saved settings with ID: " + savedSettings.getId());
            System.out.println("DEBUG - New isPublic value: " + savedSettings.getIsPublic());
            
            return ResponseEntity.ok(Map.of(
                "message", "Successfully updated portfolio settings",
                "username", username,
                "user_id", user.getId(),
                "settings_id", savedSettings.getId(),
                "is_public", savedSettings.getIsPublic()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
} 