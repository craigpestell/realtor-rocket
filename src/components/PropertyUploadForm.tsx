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
  usedFeatures?: string; // The actual features text used for generation
}

interface CustomizationOptions {
  targetAudience: string;
  priceRange: string;
  marketingStyle: string;
  propertyType: string;
  apiService: string;
  features: string;
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
  const [customization, setCustomization] = useState<CustomizationOptions>({
    targetAudience: 'general buyers',
    priceRange: '',
    marketingStyle: 'professional',
    propertyType: '',
    apiService: 'openai',
    features: ''
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
      
      // Add customization parameters
      formData.append('targetAudience', customization.targetAudience);
      formData.append('priceRange', customization.priceRange);
      formData.append('marketingStyle', customization.marketingStyle);
      formData.append('propertyType', customization.propertyType);
      formData.append('apiService', customization.apiService);
      formData.append('features', customization.features);

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
        error: null,
        usedFeatures: data.usedFeatures
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

          {/* Customization Options */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Customize Description</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={customization.propertyType}
                  onChange={(e) => setCustomization(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Auto-detect</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={customization.targetAudience}
                  onChange={(e) => setCustomization(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="general buyers">General Buyers</option>
                  <option value="first-time buyers">First-Time Buyers</option>
                  <option value="luxury buyers">Luxury Buyers</option>
                  <option value="investors">Investors</option>
                  <option value="families">Families</option>
                  <option value="young professionals">Young Professionals</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  value={customization.priceRange}
                  onChange={(e) => setCustomization(prev => ({ ...prev, priceRange: e.target.value }))}
                  placeholder="e.g., $300,000 - $350,000"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Style
                </label>
                <select
                  value={customization.marketingStyle}
                  onChange={(e) => setCustomization(prev => ({ ...prev, marketingStyle: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="professional">Professional</option>
                  <option value="warm and inviting">Warm & Inviting</option>
                  <option value="luxury and sophisticated">Luxury & Sophisticated</option>
                  <option value="modern and trendy">Modern & Trendy</option>
                  <option value="family-focused">Family-Focused</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Service
                </label>
                <select
                  value={customization.apiService}
                  onChange={(e) => setCustomization(prev => ({ ...prev, apiService: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="openai">OpenAI + Google Vision (Cloud)</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Features (Optional)
              </label>
              <textarea
                value={customization.features}
                onChange={(e) => setCustomization(prev => ({ ...prev, features: e.target.value }))}
                placeholder="Enter specific features you want highlighted (e.g., granite countertops, walk-in closets, hardwood floors, etc.). If left empty, features will be auto-detected from images."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-vertical"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to auto-detect features from images, or add your own to enhance the description.
              </p>
            </div>
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
              
              {analysisResult.usedFeatures && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Features Used for Description:
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      {customization.features.trim() ? '(User Provided)' : '(Auto-Generated)'}
                    </span>
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">{analysisResult.usedFeatures}</p>
                  </div>
                </div>
              )}
              
              {analysisResult.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detected Features from Images:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
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
