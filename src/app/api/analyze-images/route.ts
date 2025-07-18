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

    // Generate property description using selected AI service
    let description = '';
    
    if (apiService === 'ollama') {
      // Use Ollama for local analysis
      try {
        const ollamaClient = new OllamaClient();
        
        // Check if Ollama is available
        const isAvailable = await ollamaClient.isAvailable();
        if (!isAvailable) {
          return NextResponse.json({
            error: 'Ollama service is not available. Please ensure Ollama is running locally.',
            features: uniqueFeatures,
            detectedText: allDetectedText,
            analysisResults,
          });
        }
        
        // Check if the required model is available
        const hasModel = await ollamaClient.checkModel('llava:latest');
        if (!hasModel) {
          return NextResponse.json({
            error: 'Required model (llava:latest) is not available. Please run: ollama pull llava:latest',
            features: uniqueFeatures,
            detectedText: allDetectedText,
            analysisResults,
          });
        }
        
        // Convert images to buffers for Ollama
        const imageBuffers = await Promise.all(
          images.map(async (image) => Buffer.from(await image.arrayBuffer()))
        );
        
        const ollamaResult = await ollamaClient.analyzeImages(imageBuffers, {
          targetAudience,
          priceRange,
          marketingStyle,
          propertyType,
        });
        
        description = ollamaResult.description;
        console.log('Ollama analysis completed successfully');
        
      } catch (ollamaError) {
        console.error('Ollama analysis error:', ollamaError);
        return NextResponse.json({
          error: 'Failed to analyze images with Ollama. Please check that Ollama is running and the llava model is installed.',
          features: uniqueFeatures,
          detectedText: allDetectedText,
          analysisResults,
        });
      }
    } else {
      // Use OpenAI + Google Vision (existing logic)
      if (openai) {
      // Categorize features for better prompt context
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
          
          // Structural elements
          if (['building', 'house', 'home', 'structure', 'foundation', 'frame'].some(term => lowerFeature.includes(term))) {
            categories.structural.push(feature);
          }
          // Interior features
          else if (['interior', 'flooring', 'floor', 'ceiling', 'wall', 'furniture', 'cabinet', 'kitchen', 'bathroom', 'bedroom', 'living room', 'hardwood', 'laminate', 'carpet', 'tile'].some(term => lowerFeature.includes(term))) {
            categories.interior.push(feature);
          }
          // Exterior features
          else if (['roof', 'facade', 'siding', 'exterior', 'porch', 'deck', 'patio', 'garden', 'yard', 'landscaping', 'driveway', 'garage'].some(term => lowerFeature.includes(term))) {
            categories.exterior.push(feature);
          }
          // Materials
          else if (['wood', 'brick', 'stone', 'concrete', 'metal', 'glass', 'vinyl', 'stucco'].some(term => lowerFeature.includes(term))) {
            categories.materials.push(feature);
          }
          // Architectural elements
          else if (['window', 'door', 'architecture', 'column', 'archway', 'balcony', 'chimney'].some(term => lowerFeature.includes(term))) {
            categories.architectural.push(feature);
          }
          // Location/area features
          else if (['neighbourhood', 'residential area', 'street', 'location'].some(term => lowerFeature.includes(term))) {
            categories.rooms.push(feature);
          }
        });

        return categories;
      };

      const categorizedFeatures = categorizeFeatures(uniqueFeatures);
      
      const prompt = `Create a compelling property listing description based on the following analysis of property images:

DETECTED FEATURES BY CATEGORY:
${categorizedFeatures.structural.length > 0 ? `Structural Elements: ${categorizedFeatures.structural.join(', ')}` : ''}
${categorizedFeatures.architectural.length > 0 ? `Architectural Features: ${categorizedFeatures.architectural.join(', ')}` : ''}
${categorizedFeatures.exterior.length > 0 ? `Exterior Features: ${categorizedFeatures.exterior.join(', ')}` : ''}
${categorizedFeatures.interior.length > 0 ? `Interior Features: ${categorizedFeatures.interior.join(', ')}` : ''}
${categorizedFeatures.materials.length > 0 ? `Materials Detected: ${categorizedFeatures.materials.join(', ')}` : ''}
${categorizedFeatures.rooms.length > 0 ? `Location/Area: ${categorizedFeatures.rooms.join(', ')}` : ''}

Text found in images: ${allDetectedText}

${propertyType ? `Property Type: ${propertyType}` : ''}
${priceRange ? `Price Range: ${priceRange}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${marketingStyle ? `Marketing Style: ${marketingStyle}` : ''}

Write a compelling property listing description that sounds like it was written by an experienced realtor. Be specific and descriptive, but natural and engaging. Focus on what makes this property desirable and unique.

WRITING STYLE REQUIREMENTS:
- Write in a warm, professional tone that real estate agents use
- Start with an engaging opening that highlights the property's best features
- Use natural, flowing language - avoid robotic or template-like phrasing
- Include specific details about materials and features when mentioned (e.g., "beautiful hardwood floors" not just "flooring")
- Create emotional appeal by describing how buyers will feel living there
- End with a call to action that creates urgency
- Keep it 150-250 words, structured in 2-3 natural paragraphs

CONTENT GUIDELINES:
- If hardwood/wood flooring is detected: mention "gleaming hardwood floors" or "beautiful wood flooring throughout"
- If windows are prominent: describe "abundant natural light" or "stunning windows"
- If facade/exterior is mentioned: highlight "exceptional curb appeal" or "striking architectural details"
- If roof is noted: mention "well-maintained" or quality construction
- For residential areas: emphasize "desirable neighborhood" or location benefits
- Avoid listing features - instead weave them into descriptive sentences
- Focus on lifestyle benefits and emotional appeal
- Use active, engaging verbs and descriptive adjectives

EXAMPLE TONE (adapt to detected features):
"Welcome to this stunning [property type] that perfectly blends comfort and style. The moment you step inside, you'll be captivated by the gleaming hardwood floors that flow throughout the main living areas, creating an elegant and cohesive feel..."

Make it sound like a listing a homeowner would be proud to share and buyers would be excited to see.`;

      try {
        console.log('Calling OpenAI with categorized features:', categorizedFeatures);
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert real estate copywriter with 15+ years of experience creating compelling property descriptions that sell homes quickly. You specialize in identifying key selling points and crafting descriptions that create emotional connections with potential buyers. Your descriptions consistently help realtors achieve faster sales and higher offers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.7,
        });

        description = completion.choices[0]?.message?.content || '';
        console.log('OpenAI response received:', description ? 'Success' : 'Empty response');
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        return NextResponse.json({
          error: 'Failed to generate description with OpenAI. Please check your API key configuration.',
          features: uniqueFeatures,
          detectedText: allDetectedText,
          analysisResults,
        });
      }
    }
    }

    // Check if description was generated
    if (!description) {
      return NextResponse.json({
        error: 'Failed to generate description. Please check your AI service configuration.',
        features: uniqueFeatures,
        detectedText: allDetectedText,
        analysisResults,
      });
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
