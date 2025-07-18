import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';
import sharp from 'sharp';
import { OllamaClient } from '@/lib/ollama';

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

// Helper function to generate features from images
async function generateFeaturesFromImages(
  images: File[],
  apiService: string,
  propertyType: string
): Promise<string> {
  if (apiService === 'ollama') {
    try {
      const ollamaClient = new OllamaClient();
      const imageBuffers = await Promise.all(
        images.map(async (image) => Buffer.from(await image.arrayBuffer()))
      );
      
      return await ollamaClient.generateFeatures(imageBuffers, propertyType);
    } catch (error) {
      console.error('Ollama feature generation error:', error);
      return '';
    }
  } else if (openai) {
    // For OpenAI, we'll use the existing Google Vision detection
    // This will be handled in the main function
    return '';
  }
  
  return '';
}

// Helper function to generate description using features and images  
async function generateDescriptionFromFeaturesAndImages(
  images: File[],
  features: string,
  apiService: string,
  options: {
    targetAudience: string;
    priceRange: string;
    marketingStyle: string;
    propertyType: string;
  }
): Promise<string> {
  const { targetAudience, priceRange, marketingStyle, propertyType } = options;
  
  if (apiService === 'ollama') {
    try {
      const ollamaClient = new OllamaClient();
      const imageBuffers = await Promise.all(
        images.map(async (image) => Buffer.from(await image.arrayBuffer()))
      );
      
      return await ollamaClient.generateDescription(imageBuffers, features, {
        targetAudience,
        priceRange,
        marketingStyle,
        propertyType,
      });
    } catch (error) {
      console.error('Ollama description generation error:', error);
      throw error;
    }
  } else if (openai) {
    const prompt = `Create a compelling property listing description using the following features and customization parameters:

PROPERTY FEATURES:
${features}

CUSTOMIZATION:
${propertyType ? `Property Type: ${propertyType}` : ''}
${priceRange ? `Price Range: ${priceRange}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${marketingStyle ? `Marketing Style: ${marketingStyle}` : ''}

Write a compelling property listing description that sounds like it was written by an experienced realtor. Be specific and descriptive, but natural and engaging.

WRITING STYLE REQUIREMENTS:
- Write in a warm, professional tone that real estate agents use
- Start with an engaging opening that highlights the property's best features
- Use natural, flowing language - avoid robotic or template-like phrasing
- Include specific details about materials and features when mentioned
- Create emotional appeal by describing how buyers will feel living there
- End with a call to action that creates urgency

FORMAT REQUIREMENTS:
- Return the description formatted as HTML
- Use proper HTML structure with headings, paragraphs, and lists
- Structure should include:
  * An engaging opening paragraph with key highlights
  * Organized sections with <h3> headings for different areas (e.g., "Interior Features", "Outdoor Spaces", "Location Benefits")
  * Use <ul> and <li> tags for listing specific features within each section
  * Include a compelling closing paragraph with call to action
- Keep total content equivalent to 200-300 words when rendered
- Use semantic HTML tags for better structure

CONTENT GUIDELINES:
- Weave features into descriptive sentences naturally
- Focus on lifestyle benefits and emotional appeal
- Use active, engaging verbs and descriptive adjectives
- Highlight unique selling points first
- DO NOT describe specific furniture visible in staged photos (sofas, chairs, tables, decorations, etc.)
- You MAY mention furniture possibilities or how spaces could be used (e.g., "perfect for a dining table", "ideal for your favorite reading chair")
- Focus on permanent fixtures, finishes, architectural features, and built-in elements

Example structure:
<p>[Engaging opening paragraph with key highlights]</p>
<h3>Interior Features</h3>
<ul>
<li>[Feature with descriptive detail]</li>
<li>[Feature with lifestyle benefit]</li>
</ul>
<h3>Outdoor Spaces</h3>
<ul>
<li>[Outdoor feature description]</li>
</ul>
<p>[Compelling closing with call to action]</p>

Make it sound like a listing a homeowner would be proud to share and buyers would be excited to see.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert real estate copywriter with 15+ years of experience creating compelling property descriptions that sell homes quickly. You specialize in identifying key selling points and crafting descriptions that create emotional connections with potential buyers. IMPORTANT: Never describe specific furniture visible in staged photos (sofas, chairs, tables, decorations, etc.) as staging furniture is not included with the property. However, you may mention furniture possibilities or how spaces could be used (e.g., "perfect for a dining table", "ideal for your favorite reading chair"). Focus on permanent fixtures, finishes, architectural features, and built-in elements. Always return your response as properly formatted HTML with headings, paragraphs, and bullet lists for better readability.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  }
  
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    
    // Extract optional customization parameters
    const targetAudience = formData.get('targetAudience') as string || 'general buyers';
    const priceRange = formData.get('priceRange') as string || '';
    const marketingStyle = formData.get('marketingStyle') as string || 'professional';
    const propertyType = formData.get('propertyType') as string || '';
    const apiService = formData.get('apiService') as string || 'openai';
    const userFeatures = formData.get('features') as string || '';

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

    // Generate property description using selected AI service with two-step process
    let description = '';
    let finalFeatures = userFeatures.trim();
    
    // Step 1: Generate features if user didn't provide them
    if (!finalFeatures) {
      console.log('No user features provided, generating features from images...');
      
      if (apiService === 'ollama') {
        try {
          finalFeatures = await generateFeaturesFromImages(images, apiService, propertyType);
          console.log('Generated features with Ollama:', finalFeatures);
        } catch (error) {
          console.error('Failed to generate features with Ollama:', error);
          // Fallback to basic features
          finalFeatures = uniqueFeatures.join(', ');
        }
      } else {
        // For OpenAI, use Google Vision detected features with categorization
        const categorizeFeatures = (features: string[]) => {
          const categories = {
            structural: [] as string[],
            interior: [] as string[],
            exterior: [] as string[],
            materials: [] as string[],
            rooms: [] as string[],
            architectural: [] as string[]
          };

          features.forEach(feature => {
            const lowerFeature = feature.toLowerCase();
            
            if (['building', 'house', 'home', 'structure', 'foundation', 'frame'].some(term => lowerFeature.includes(term))) {
              categories.structural.push(feature);
            }
            else if (['interior', 'flooring', 'floor', 'ceiling', 'wall', 'furniture', 'cabinet', 'kitchen', 'bathroom', 'bedroom', 'living room', 'hardwood', 'laminate', 'carpet', 'tile'].some(term => lowerFeature.includes(term))) {
              categories.interior.push(feature);
            }
            else if (['roof', 'facade', 'siding', 'exterior', 'porch', 'deck', 'patio', 'garden', 'yard', 'landscaping', 'driveway', 'garage'].some(term => lowerFeature.includes(term))) {
              categories.exterior.push(feature);
            }
            else if (['wood', 'brick', 'stone', 'concrete', 'metal', 'glass', 'vinyl', 'stucco'].some(term => lowerFeature.includes(term))) {
              categories.materials.push(feature);
            }
            else if (['window', 'door', 'architecture', 'column', 'archway', 'balcony', 'chimney'].some(term => lowerFeature.includes(term))) {
              categories.architectural.push(feature);
            }
            else if (['neighbourhood', 'residential area', 'street', 'location'].some(term => lowerFeature.includes(term))) {
              categories.rooms.push(feature);
            }
          });

          return categories;
        };

        const categorizedFeatures = categorizeFeatures(uniqueFeatures);
        const featuresList = [
          ...categorizedFeatures.structural,
          ...categorizedFeatures.architectural,
          ...categorizedFeatures.exterior,
          ...categorizedFeatures.interior,
          ...categorizedFeatures.materials,
          ...categorizedFeatures.rooms
        ];
        
        finalFeatures = featuresList.join(', ');
        console.log('Using Google Vision detected features:', finalFeatures);
      }
    } else {
      console.log('Using user-provided features:', finalFeatures);
    }
    
    // Step 2: Generate description using features and images
    try {
      if (apiService === 'ollama') {
        const ollamaClient = new OllamaClient();
        
        // Check if Ollama is available
        const isAvailable = await ollamaClient.isAvailable();
        if (!isAvailable) {
          return NextResponse.json({
            error: 'Ollama service is not available. Please ensure Ollama is running locally.',
            features: finalFeatures.split(', '),
            detectedText: allDetectedText,
            analysisResults,
          });
        }
        
        // Check if the required model is available
        const hasModel = await ollamaClient.checkModel('llava:latest');
        if (!hasModel) {
          return NextResponse.json({
            error: 'Required model (llava:latest) is not available. Please run: ollama pull llava:latest',
            features: finalFeatures.split(', '),
            detectedText: allDetectedText,
            analysisResults,
          });
        }
        
        description = await generateDescriptionFromFeaturesAndImages(images, finalFeatures, apiService, {
          targetAudience,
          priceRange,
          marketingStyle,
          propertyType,
        });
        
        console.log('Ollama description generation completed successfully');
      } else if (openai) {
        description = await generateDescriptionFromFeaturesAndImages(images, finalFeatures, apiService, {
          targetAudience,
          priceRange,
          marketingStyle,
          propertyType,
        });
        
        console.log('OpenAI description generation completed successfully');
      }
    } catch (error) {
      console.error('Description generation error:', error);
      return NextResponse.json({
        error: `Failed to generate description with ${apiService}. Please check your configuration.`,
        features: finalFeatures.split(', '),
        detectedText: allDetectedText,
        analysisResults,
      });
    }

    // Check if description was generated
    if (!description) {
      return NextResponse.json({
        error: 'Failed to generate description. Please check your AI service configuration.',
        features: finalFeatures ? finalFeatures.split(', ') : uniqueFeatures,
        detectedText: allDetectedText,
        analysisResults,
      });
    }

    return NextResponse.json({
      description,
      features: finalFeatures ? finalFeatures.split(', ') : uniqueFeatures,
      detectedText: allDetectedText,
      analysisResults,
      usedFeatures: finalFeatures, // Include the actual features used for description
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
