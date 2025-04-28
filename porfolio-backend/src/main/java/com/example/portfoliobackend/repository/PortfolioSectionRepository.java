package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.PortfolioSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioSectionRepository extends JpaRepository<PortfolioSection, Long> {
    List<PortfolioSection> findByUserId(Long userId);
}