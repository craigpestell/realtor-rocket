# Image Compression Features

This document describes the image compression features implemented in Realtor Rocket to optimize image processing and reduce bandwidth usage.

## Features

### Client-Side Compression
- **Automatic compression**: Images are automatically compressed before upload
- **Smart sizing**: Images are resized to maximum 1920x1080 while maintaining aspect ratio
- **Quality optimization**: JPEG compression with 80% quality for optimal balance of size and quality
- **Size limits**: Images are compressed to a maximum of 500KB each
- **Format conversion**: All images are converted to JPEG format for consistency

### Server-Side Backup Compression
- **Fallback processing**: If client-side compression fails, server-side compression using Sharp library
- **API optimization**: Reduces processing time for Google Cloud Vision API calls
- **Bandwidth optimization**: Smaller images mean faster uploads and processing

### User Experience
- **Compression feedback**: Real-time compression statistics showing space saved
- **File size display**: Shows original vs. compressed file sizes
- **Progress indicators**: Loading states during compression process
- **Error handling**: Graceful handling of compression failures

## Technical Implementation

### Client-Side (`/src/utils/imageCompression.ts`)
- Uses HTML5 Canvas API for image processing
- Implements progressive quality reduction if size limits aren't met
- Maintains aspect ratio during resizing
- Validates image types and file sizes

### Server-Side (`/src/app/api/analyze-images/route.ts`)
- Uses Sharp library for high-performance image processing
- Applies compression only when needed (>500KB)
- Preserves original image data for analysis accuracy

### UI Components
- **CompressionStats**: Shows compression statistics and space saved
- **PropertyUploadForm**: Enhanced with compression progress and file size indicators

## Configuration

### Compression Settings
```typescript
const DEFAULT_OPTIONS = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 500,
  format: 'jpeg'
};
```

### Next.js Configuration
```typescript
// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: '10mb', // Allow up to 10MB for multiple images
  },
}
```

## Benefits

1. **Reduced bandwidth**: Smaller file sizes mean faster uploads
2. **Improved performance**: Faster processing by Google Cloud Vision API
3. **Better user experience**: Real-time feedback and progress indicators
4. **Cost optimization**: Reduced API costs due to smaller image sizes
5. **Storage efficiency**: Less storage space required for uploaded images

## Browser Support

- Modern browsers with Canvas API support
- Progressive enhancement: falls back to original images if compression fails
- Mobile-optimized: Works on both desktop and mobile devices

## Future Enhancements

- **WebP support**: Add WebP format for better compression
- **Batch processing**: Optimize multiple image processing
- **Quality presets**: Allow users to choose compression levels
- **Progressive loading**: Implement progressive image loading
