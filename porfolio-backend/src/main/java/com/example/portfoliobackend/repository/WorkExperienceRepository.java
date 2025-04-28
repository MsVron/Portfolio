package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findByUserId(Long userId);
}