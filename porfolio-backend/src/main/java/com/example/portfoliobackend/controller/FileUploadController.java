package com.example.portfoliobackend.controller;

import com.example.portfoliobackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

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
        logger.info("Received upload request for file: {}", file.getOriginalFilename());
        logger.info("File size: {} bytes", file.getSize());
        logger.info("Content type: {}", file.getContentType());
        
        try {
            String filename = fileStorageService.store(file);
            logger.info("File stored successfully with name: {}", filename);
            
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("fileUrl", appUrl + "/uploads/" + filename);
            logger.info("Returning file URL: {}", response.get("fileUrl"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error storing file: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @DeleteMapping("/{filename}")
    public ResponseEntity<Map<String, Boolean>> deleteFile(@PathVariable String filename) {
        logger.info("Received delete request for file: {}", filename);
        fileStorageService.delete(filename);
        logger.info("File deleted: {}", filename);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", true);
        
        return ResponseEntity.ok(response);
    }
} 