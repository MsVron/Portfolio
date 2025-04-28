package com.example.portfoliobackend.repository;

import com.example.portfoliobackend.model.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    List<ContactSubmission> findByUserId(Long userId);
}