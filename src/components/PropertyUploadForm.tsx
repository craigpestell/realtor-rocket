'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface UploadedImage {
  file: File;
  url: string;
  id: string;
}

interface AnalysisResult {
  description: string;
  features: string[];
  loading: boolean;
  error: string | null;
}

export default function PropertyUploadForm() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    description: '',
    features: [],
    loading: false,
    error: null
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const id = Math.random().toString(36).substring(7);
        
        setUploadedImages(prev => [...prev, { file, url, id }]);
      }
    });
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

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const id = Math.random().toString(36).substring(7);
        
        setUploadedImages(prev => [...prev, { file, url, id }]);
      }
    });
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
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Select Images
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {uploadedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative group">
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
            ))}
          </div>

          <button
            onClick={analyzeImages}
            disabled={analysisResult.loading}
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
