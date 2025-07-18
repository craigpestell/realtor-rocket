import { Ollama, ModelResponse } from 'ollama';

export interface OllamaImageAnalysis {
  description: string;
  features: string[];
  confidence: number;
}

export class OllamaClient {
  private ollama: Ollama;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.ollama = new Ollama({ host: baseUrl });
  }

  async analyzeImages(
    images: Buffer[],
    options: {
      targetAudience?: string;
      priceRange?: string;
      marketingStyle?: string;
      propertyType?: string;
    } = {}
  ): Promise<OllamaImageAnalysis> {
    try {
      // Convert buffers to base64 for Ollama
      const base64Images = images.map(buffer => buffer.toString('base64'));
      
      const prompt = this.buildPrompt(options);
      
      // Use llava model for image analysis
      const response = await this.ollama.generate({
        model: 'llava:latest',
        prompt,
        images: base64Images,
        stream: false,
      });

      // Parse the response to extract features and description
      const analysis = this.parseResponse(response.response);
      
      return analysis;
    } catch (error) {
      console.error('Ollama analysis error:', error);
      throw new Error('Failed to analyze images with Ollama');
    }
  }

  private buildPrompt(options: {
    targetAudience?: string;
    priceRange?: string;
    marketingStyle?: string;
    propertyType?: string;
  }): string {
    const { targetAudience, priceRange, marketingStyle, propertyType } = options;

    return `You are an expert real estate agent analyzing property images to create compelling listing descriptions.

Please analyze these property images and provide:

1. A detailed list of visual features you can identify (architectural elements, materials, finishes, rooms, exterior features, etc.)
2. A compelling property listing description

CUSTOMIZATION PARAMETERS:
${propertyType ? `Property Type: ${propertyType}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${priceRange ? `Price Range: ${priceRange}` : ''}
${marketingStyle ? `Marketing Style: ${marketingStyle}` : ''}

ANALYSIS REQUIREMENTS:
- Identify specific architectural features, materials, and finishes
- Note room types, layouts, and design elements
- Observe exterior features like roofing, siding, landscaping
- Look for unique selling points and premium features
- Assess overall condition and maintenance level

DESCRIPTION REQUIREMENTS:
- Write a compelling 150-250 word listing description
- Use professional real estate language
- Highlight the most attractive features first
- Create emotional appeal and lifestyle benefits
- Include a call to action
- Sound natural and engaging, not robotic

FORMAT YOUR RESPONSE AS:
FEATURES: [comma-separated list of specific features identified]

DESCRIPTION: [compelling listing description]

Begin your analysis now:`;
  }

  private parseResponse(response: string): OllamaImageAnalysis {
    try {
      const featuresMatch = response.match(/FEATURES:\s*(.+?)(?:\n\nDESCRIPTION:|$)/);
      const descriptionMatch = response.match(/DESCRIPTION:\s*(.+)$/);

      const featuresText = featuresMatch?.[1]?.trim() || '';
      const description = descriptionMatch?.[1]?.trim() || response.trim();

      // Parse features from comma-separated list
      const features = featuresText
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      return {
        description,
        features,
        confidence: 0.8, // Default confidence for Ollama
      };
    } catch (error) {
      console.error('Error parsing Ollama response:', error);
      // Fallback: treat entire response as description
      return {
        description: response.trim(),
        features: [],
        confidence: 0.5,
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }

  async checkModel(modelName: string = 'llava:latest'): Promise<boolean> {
    try {
      const models = await this.ollama.list();
      return models.models.some((model: ModelResponse) => model.name === modelName);
    } catch {
      return false;
    }
  }
}
