package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}