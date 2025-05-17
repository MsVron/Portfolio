package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final String appUrl;
    
    public FileUploadController(
            FileStorageService fileStorageService,
            @Value("${app.url}") String appUrl
    ) {
        this.fileStorageService = fileStorageService;
        this.appUrl = appUrl;
    }
    
    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.store(file);
        
        Map<String, String> response = new HashMap<>();
        response.put("filename", filename);
        response.put("fileUrl", appUrl + "/uploads/" + filename);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{filename}")
    public ResponseEntity<Map<String, Boolean>> deleteFile(@PathVariable String filename) {
        fileStorageService.delete(filename);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", true);
        
        return ResponseEntity.ok(response);
    }
} 