import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, label, currentImage, className = '' }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (jpg, png, gif)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the parent component's handler
      onFileSelect(file, formData);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className={`${className}`}>
      <label className="block text-gray-300 mb-2 text-sm font-medium">{label || 'Upload Image'}</label>
      
      <div className="mt-1 flex flex-col items-center">
        {preview ? (
          <div className="relative mb-3">
            <img 
              src={preview} 
              alt="Preview" 
              className="object-cover h-40 w-full rounded-md border border-gray-600"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className="w-full h-40 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-700"
          >
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-300">Click to upload an image</p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {isUploading && <p className="mt-2 text-sm text-gray-300">Uploading...</p>}
      </div>
    </div>
  );
};

export default FileUpload; 