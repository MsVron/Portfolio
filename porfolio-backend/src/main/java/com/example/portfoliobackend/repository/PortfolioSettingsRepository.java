package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.PortfolioSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortfolioSettingsRepository extends JpaRepository<PortfolioSettings, Long> {
    Optional<PortfolioSettings> findByUserId(Long userId);
}