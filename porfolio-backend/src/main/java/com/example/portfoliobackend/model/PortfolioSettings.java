package com.example.portfoliobackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_settings")
public class PortfolioSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settings_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'default'")
    private String theme;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'standard'")
    private String layout;

    @Column(name = "color_primary", columnDefinition = "VARCHAR(20) DEFAULT '#007bff'")
    private String colorPrimary;

    @Column(name = "color_secondary", columnDefinition = "VARCHAR(20) DEFAULT '#6c757d'")
    private String colorSecondary;

    @Column(name = "font_family", columnDefinition = "VARCHAR(100) DEFAULT 'Roboto, sans-serif'")
    private String fontFamily;

    @Column(name = "is_public", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isPublic;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getLayout() { return layout; }
    public void setLayout(String layout) { this.layout = layout; }
    public String getColorPrimary() { return colorPrimary; }
    public void setColorPrimary(String colorPrimary) { this.colorPrimary = colorPrimary; }
    public String getColorSecondary() { return colorSecondary; }
    public void setColorSecondary(String colorSecondary) { this.colorSecondary = colorSecondary; }
    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}