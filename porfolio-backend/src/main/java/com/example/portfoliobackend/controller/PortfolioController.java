package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.model.PortfolioSettings;
import com.example.portfoliobackend.repository.PortfolioSettingsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioSettingsRepository settingsRepository;

    public PortfolioController(PortfolioSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody PortfolioSettings settings) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        PortfolioSettings existingSettings = settingsRepository.findByUserId(settings.getUserId())
                .orElse(new PortfolioSettings());
        existingSettings.setUserId(settings.getUserId());
        existingSettings.setTheme(settings.getTheme());
        existingSettings.setLayout(settings.getLayout());
        existingSettings.setColorPrimary(settings.getColorPrimary());
        existingSettings.setColorSecondary(settings.getColorSecondary());
        existingSettings.setFontFamily(settings.getFontFamily());
        existingSettings.setCustomDomain(settings.getCustomDomain());
        existingSettings.setIsPublic(settings.getIsPublic());
        existingSettings.setCustomCss(settings.getCustomCss());
        existingSettings.setCustomJs(settings.getCustomJs());
        existingSettings.setMetaDescription(settings.getMetaDescription());
        existingSettings.setMetaKeywords(settings.getMetaKeywords());
        existingSettings.setGoogleAnalyticsId(settings.getGoogleAnalyticsId());
        existingSettings.setUpdatedAt(java.time.LocalDateTime.now());
        settingsRepository.save(existingSettings);
        return ResponseEntity.ok("Settings updated");
    }
}