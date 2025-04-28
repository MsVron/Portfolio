package com.example.portfoliobackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolio_sections")
public class PortfolioSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false)
    private SectionType sectionType;

    private String title;

    private String description;

    @Column(name = "is_visible", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isVisible;

    @Column(name = "display_order", columnDefinition = "INT DEFAULT 0")
    private Integer displayOrder;

    @Column(name = "custom_content", columnDefinition = "TEXT")
    private String customContent;

    public enum SectionType {
        about, projects, skills, experience, education, contact, custom
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public SectionType getSectionType() { return sectionType; }
    public void setSectionType(SectionType sectionType) { this.sectionType = sectionType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsVisible() { return isVisible; }
    public void setIsVisible(Boolean isVisible) { this.isVisible = isVisible; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public String getCustomContent() { return customContent; }
    public void setCustomContent(String customContent) { this.customContent = customContent; }
}