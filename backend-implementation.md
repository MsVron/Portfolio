# Backend Implementation Guide for File Uploads with Spring Boot

## 1. Directory Structure
First, you need to set up a directory to store uploads. In your Spring Boot application, create the following changes:

## 2. Add Dependencies
In your `pom.xml`:

```xml
<!-- For file handling -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```

## 3. Configure Upload Directory
Create or update `application.properties`:

```properties
# File upload settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=./uploads
```

## 4. Create a Storage Service
Create a service to handle file operations:

```java
package com.portfolio.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;
    
    private Path rootLocation;
    
    @PostConstruct
    public void init() {
        try {
            rootLocation = Paths.get(uploadDir);
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }
    
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            
            // Generate a unique filename to prevent overwriting
            String originalFilename = file.getOriginalFilename();
            String extension = FilenameUtils.getExtension(originalFilename);
            String newFilename = UUID.randomUUID().toString() + "." + extension;
            
            // Copy the file to the upload location
            Path destinationFile = rootLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), destinationFile);
            
            return newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
    
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }
    
    public void delete(String filename) {
        try {
            Path file = load(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
```

## 5. Create a File Upload Controller

```java
package com.portfolio.controller;

import com.portfolio.service.FileStorageService;
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
```

## 6. Configure Static Resource Access
To make uploaded files accessible via URL, add this configuration:

```java
package com.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

## 7. Add to application.properties
```properties
# Application URL (for generating links to uploaded files)
app.url=http://localhost:8080
```

## 8. Create Uploads Directory
Create a directory named "uploads" in your Spring Boot project's root directory.

## 9. Security Considerations
- Validate file types (restrict to images only)
- Set maximum upload size
- Implement user authentication for file uploads
- Consider using a CDN for production 