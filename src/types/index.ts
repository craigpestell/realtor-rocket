export interface UploadedImage {
  file: File;
  url: string;
  id: string;
}

export interface VisionAnalysisResult {
  features: string[];
  detectedText: string;
  filename: string;
}

export interface PropertyAnalysisResponse {
  description: string;
  features: string[];
  detectedText: string;
  analysisResults: VisionAnalysisResult[];
}

export interface AnalysisResult {
  description: string;
  features: string[];
  loading: boolean;
  error: string | null;
}
