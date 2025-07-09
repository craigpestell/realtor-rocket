import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';
import sharp from 'sharp';

// Initialize Google Cloud Vision client only if credentials are available
const visionClient = process.env.GOOGLE_APPLICATION_CREDENTIALS ? new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
}) : null;

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Compress image using Sharp for server-side optimization
 */
async function compressImageServerSide(buffer: Buffer): Promise<Buffer> {
  try {
    const result = await sharp(buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toBuffer();
    
    return Buffer.from(result);
  } catch (error) {
    console.error('Server-side compression failed:', error);
    return buffer; // Return original buffer if compression fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Analyze each image with Google Cloud Vision
    const analysisResults = await Promise.all(
      images.map(async (image) => {
        let buffer = Buffer.from(await image.arrayBuffer());
        const originalSize = buffer.length;
        
        // Compress image on server-side if it's larger than 500KB
        if (buffer.length > 500 * 1024) {
          const compressedBuffer = await compressImageServerSide(buffer);
          buffer = Buffer.from(compressedBuffer);
        }
        
        if (!visionClient) {
          // Return mock data if Vision API is not configured
          return {
            features: ['house', 'building', 'property', 'real estate'],
            detectedText: '',
            filename: image.name,
            originalSize,
            compressedSize: buffer.length,
          };
        }
        
        try {
          const [result] = await visionClient.labelDetection({
            image: { content: buffer },
          });
          
          const labels = result.labelAnnotations || [];
          const features = labels
            .filter(label => (label.score || 0) > 0.7)
            .map(label => label.description || '')
            .filter(Boolean);

          // Also get text detection for any signage or text in images
          const [textResult] = await visionClient.textDetection({
            image: { content: buffer },
          });
          
          const textAnnotations = textResult.textAnnotations || [];
          const detectedText = textAnnotations.length > 0 ? textAnnotations[0].description : '';

          return {
            features,
            detectedText,
            filename: image.name,
            originalSize,
            compressedSize: buffer.length,
          };
        } catch (error) {
          console.error('Vision API error:', error);
          return {
            features: ['house', 'building', 'property'],
            detectedText: '',
            filename: image.name,
            originalSize,
            compressedSize: buffer.length,
          };
        }
      })
    );

    // Combine all features from all images
    const allFeatures = analysisResults.flatMap(result => result.features);
    const uniqueFeatures = [...new Set(allFeatures)];
    const allDetectedText = analysisResults
      .map(result => result.detectedText)
      .filter(Boolean)
      .join(' ');

    // Generate property description using OpenAI
    let description = '';
    
    if (openai) {
      const prompt = `Create a compelling property listing description based on the following analysis of property images:

Features detected: ${uniqueFeatures.join(', ')}
Text found in images: ${allDetectedText}

Please create a professional, engaging property description that highlights the key features and amenities. The description should be suitable for real estate listings and appeal to potential buyers. Keep it concise but descriptive, around 2-3 paragraphs.

Focus on:
- Property features and amenities
- Architectural details
- Interior and exterior highlights
- Location advantages (if evident)
- Overall appeal and lifestyle benefits

Make it sound professional and enticing for potential buyers.`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional real estate copywriter who creates compelling property descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        description = completion.choices[0]?.message?.content || '';
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
      }
    }

    // Fallback description if OpenAI fails or is not configured
    if (!description) {
      description = `This property features ${uniqueFeatures.slice(0, 5).join(', ')} and offers excellent potential for prospective buyers. The images reveal a well-maintained property with attractive features that would appeal to a wide range of buyers. Contact us today to schedule a viewing and discover all this property has to offer.`;
    }

    return NextResponse.json({
      description,
      features: uniqueFeatures,
      detectedText: allDetectedText,
      analysisResults,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze images' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
