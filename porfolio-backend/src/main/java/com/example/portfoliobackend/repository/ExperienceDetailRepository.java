package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.ExperienceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceDetailRepository extends JpaRepository<ExperienceDetail, Long> {
    List<ExperienceDetail> findByExperienceId(Long experienceId);
}