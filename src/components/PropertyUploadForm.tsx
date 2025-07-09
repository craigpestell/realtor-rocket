'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { compressImage, formatFileSize, isValidImageType, isFileSizeValid } from '../utils/imageCompression';
import CompressionStats from './CompressionStats';

interface UploadedImage {
  file: File;
  originalFile?: File;
  url: string;
  id: string;
  originalSize?: number;
  compressedSize?: number;
}

interface AnalysisResult {
  description: string;
  features: string[];
  loading: boolean;
  error: string | null;
}

export default function PropertyUploadForm() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    description: '',
    features: [],
    loading: false,
    error: null
  });

  const processAndCompressFile = async (file: File): Promise<UploadedImage> => {
    const id = Math.random().toString(36).substring(7);
    const originalSize = file.size;
    
    // Validate file type
    if (!isValidImageType(file)) {
      throw new Error(`Invalid file type: ${file.type}`);
    }
    
    // Check if compression is needed
    let processedFile = file;
    let compressedSize = originalSize;
    
    if (!isFileSizeValid(file, 500)) {
      // Compress the image if it's too large
      processedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        maxSizeKB: 500,
        format: 'jpeg'
      });
      compressedSize = processedFile.size;
    }
    
    const url = URL.createObjectURL(processedFile);
    
    return {
      file: processedFile,
      originalFile: file,
      url,
      id,
      originalSize,
      compressedSize
    };
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsCompressing(true);
    
    try {
      const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
      const processedImages = await Promise.all(
        fileArray.map(file => processAndCompressFile(file))
      );
      
      setUploadedImages(prev => [...prev, ...processedImages]);
    } catch (error) {
      console.error('Error processing images:', error);
      setAnalysisResult(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process images'
      }));
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) return;

    setAnalysisResult(prev => ({ ...prev, loading: true, error: null }));

    try {
      const formData = new FormData();
      uploadedImages.forEach(image => {
        formData.append('images', image.file);
      });

      const response = await fetch('/api/analyze-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze images');
      }

      const data = await response.json();
      setAnalysisResult({
        description: data.description,
        features: data.features || [],
        loading: false,
        error: null
      });
    } catch (error) {
      setAnalysisResult(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    setIsCompressing(true);
    
    try {
      const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
      const processedImages = await Promise.all(
        fileArray.map(file => processAndCompressFile(file))
      );
      
      setUploadedImages(prev => [...prev, ...processedImages]);
    } catch (error) {
      console.error('Error processing images:', error);
      setAnalysisResult(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process images'
      }));
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload Property Images</h2>
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop your property images here, or click to select files
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Images will be automatically compressed to optimize size (max 500KB each)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isCompressing}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              isCompressing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isCompressing ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Compressing Images...
              </>
            ) : (
              'Select Images'
            )}
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {uploadedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>
          
          <CompressionStats images={uploadedImages} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative group bg-gray-50 rounded-lg p-3">
                <div className="relative">
                  <Image
                    src={image.url}
                    alt="Property"
                    width={200}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                    unoptimized
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* File size information */}
                <div className="mt-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="truncate">{image.file.name}</span>
                    <span className="text-green-600 font-medium">
                      {formatFileSize(image.compressedSize || image.file.size)}
                    </span>
                  </div>
                  {image.originalSize && image.originalSize !== image.compressedSize && (
                    <div className="text-gray-500 mt-1">
                      Original: {formatFileSize(image.originalSize)} → 
                      Saved: {formatFileSize(image.originalSize - (image.compressedSize || 0))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={analyzeImages}
            disabled={analysisResult.loading || isCompressing}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {analysisResult.loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyzing Images...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5 mr-2" />
                Generate Property Description
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Section */}
      {(analysisResult.description || analysisResult.error) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Generated Description</h3>
          
          {analysisResult.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{analysisResult.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{analysisResult.description}</p>
              </div>
              
              {analysisResult.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detected Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
