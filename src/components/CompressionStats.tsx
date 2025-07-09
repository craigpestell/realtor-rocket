import React from 'react';
import { formatFileSize } from '../utils/imageCompression';

interface CompressionStatsProps {
  images: Array<{
    originalSize?: number;
    compressedSize?: number;
    file: { name: string; size: number };
  }>;
}

export default function CompressionStats({ images }: CompressionStatsProps) {
  const totalOriginalSize = images.reduce((sum, img) => sum + (img.originalSize || img.file.size), 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + (img.compressedSize || img.file.size), 0);
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const compressionRatio = totalOriginalSize > 0 ? ((totalSaved / totalOriginalSize) * 100) : 0;

  if (totalOriginalSize === 0 || totalSaved <= 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-blue-900 mb-2">Compression Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-blue-600 font-medium">Original Size:</span>
          <div className="text-blue-900">{formatFileSize(totalOriginalSize)}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Compressed Size:</span>
          <div className="text-blue-900">{formatFileSize(totalCompressedSize)}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Space Saved:</span>
          <div className="text-green-600 font-semibold">{formatFileSize(totalSaved)}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Compression:</span>
          <div className="text-green-600 font-semibold">{compressionRatio.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
