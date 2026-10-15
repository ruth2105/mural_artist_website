import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ onImageSelect, currentImage, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(currentImage);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Pass file to parent
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <label className="block text-warm-white text-sm font-medium mb-2">
        {label}
      </label>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-warm-white bg-white/10'
            : 'border-white/20 hover:border-white/40'
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
            />
            <p className="mt-4 text-muted-gray text-sm">
              Drop a new image to replace, or click to browse
            </p>
          </div>
        ) : (
          <div className="py-8">
            <svg
              className="mx-auto h-12 w-12 text-muted-gray mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-warm-white mb-2">
              {isDragActive ? 'Drop image here' : 'Drag & drop an image, or click to browse'}
            </p>
            <p className="text-muted-gray text-sm">
              JPG, PNG or WebP (max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
