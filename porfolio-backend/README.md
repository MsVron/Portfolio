# Portfolio Backend

Backend for a customizable developer portfolio application built with Spring Boot.

## File Upload Functionality

The application now supports file uploads for images:

- Profile images
- Project thumbnails
- Project media files

### Configuration

The file upload functionality is configured in `application.properties`:

```properties
# File upload settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=./uploads
app.url=http://localhost:8081
```

### API Endpoints

- **POST /api/upload**: Upload a file
  - Request: `multipart/form-data` with a file field named "file"
  - Response: JSON with filename and fileUrl
  
- **DELETE /api/upload/{filename}**: Delete a file
  - Response: JSON with deleted status

### Implementation

The file upload implementation consists of:

1. **FileStorageService**: Handles file operations (store, load, delete)
2. **FileUploadController**: Provides REST endpoints for file upload and deletion
3. **WebConfig**: Configures static resource serving for uploaded files

### Usage from Frontend

The frontend can use these endpoints to upload and manage files with the provided `FileUpload` component and `fileService.js`.

## Database Structure

The existing database structure works well with the file upload functionality:

- User profile images are stored in the `users.profile_image` column
- Project thumbnails are stored in the `projects.thumbnail` column
- Project media files are stored in the `project_media.media_url` column

These columns store the file paths rather than the actual binary data, which is the recommended approach for better performance and scalability. 