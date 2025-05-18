package com.example.portfoliobackend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class UploadDirTestController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/upload-dir")
    public ResponseEntity<Map<String, Object>> testUploadDir() {
        Map<String, Object> response = new HashMap<>();
        try {
            File directory = new File(uploadDir);
            
            if (!directory.exists()) {
                directory.mkdirs();
                response.put("message", "Upload directory created: " + directory.getAbsolutePath());
            } else {
                response.put("message", "Upload directory exists: " + directory.getAbsolutePath());
            }
            
            response.put("canWrite", directory.canWrite());
            response.put("canRead", directory.canRead());
            response.put("isDirectory", directory.isDirectory());
            response.put("absolutePath", directory.getAbsolutePath());
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("status", "error");
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 