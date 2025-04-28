package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.ProjectMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMediaRepository extends JpaRepository<ProjectMedia, Long> {
    List<ProjectMedia> findByProjectId(Long projectId);
}