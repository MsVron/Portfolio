package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.model.Skill;
import com.example.portfoliobackend.repository.SkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        System.out.println("Getting all skills");
        List<Skill> skills = skillRepository.findAll();
        System.out.println("Found " + skills.size() + " skills");
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSkillById(@PathVariable Long id) {
        Optional<Skill> skill = skillRepository.findById(id);
        if (skill.isPresent()) {
            return ResponseEntity.ok(skill.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 