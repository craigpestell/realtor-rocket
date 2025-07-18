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

  async generateFeatures(images: Buffer[], propertyType?: string): Promise<string> {
    try {
      const base64Images = images.map(buffer => buffer.toString('base64'));
      
      const prompt = `Analyze these property images and list all visible features you can identify. Focus on:
- Architectural elements (windows, doors, columns, etc.)
- Materials (hardwood, brick, stone, tile, etc.) 
- Room types and layouts
- Exterior features (roof, siding, landscaping, etc.)
- Interior finishes and fixtures
- Built-in elements and permanent installations
- Unique selling points

IMPORTANT: DO NOT include specific furniture visible in staged photos (sofas, chairs, tables, decorations, etc.) in your analysis. Focus only on permanent fixtures and architectural features.

${propertyType ? `Property Type: ${propertyType}` : ''}

Provide a comprehensive comma-separated list of features.`;

      const response = await this.ollama.generate({
        model: 'llava:latest',
        prompt,
        images: base64Images,
        stream: false,
      });

      return response.response;
    } catch (error) {
      console.error('Ollama feature generation error:', error);
      throw new Error('Failed to generate features with Ollama');
    }
  }

  async generateDescription(
    images: Buffer[],
    features: string,
    options: {
      targetAudience?: string;
      priceRange?: string;
      marketingStyle?: string;
      propertyType?: string;
    } = {}
  ): Promise<string> {
    try {
      const base64Images = images.map(buffer => buffer.toString('base64'));
      const { targetAudience, priceRange, marketingStyle, propertyType } = options;
      
      const prompt = `You are an expert real estate agent. Using the following property features and the images provided, create a compelling listing description.

PROPERTY FEATURES:
${features}

CUSTOMIZATION:
${propertyType ? `Property Type: ${propertyType}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${priceRange ? `Price Range: ${priceRange}` : ''}
${marketingStyle ? `Marketing Style: ${marketingStyle}` : ''}

Create a compelling listing description that:
- Uses a warm, professional real estate tone
- Weaves features naturally into descriptive sentences
- Creates emotional appeal and lifestyle benefits
- Includes a call to action
- Sounds engaging, not robotic
- NEVER describes specific furniture visible in staged photos (sofas, chairs, tables, decorations, etc.) - staging furniture is not included
- MAY mention furniture possibilities or how spaces could be used (e.g., "perfect for a dining table", "ideal for your favorite reading chair")
- Focuses on permanent fixtures, finishes, architectural features, and built-in elements

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

Focus on making buyers excited about the property.`;

      const response = await this.ollama.generate({
        model: 'llava:latest',
        prompt,
        images: base64Images,
        stream: false,
      });

      return response.response;
    } catch (error) {
      console.error('Ollama description generation error:', error);
      throw new Error('Failed to generate description with Ollama');
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
- IMPORTANT: Do NOT mention specific furniture visible in staged photos - focus only on permanent fixtures

DESCRIPTION REQUIREMENTS:
- Write a compelling listing description formatted as HTML
- Use professional real estate language
- Highlight the most attractive features first
- Create emotional appeal and lifestyle benefits
- Include a call to action
- Sound natural and engaging, not robotic
- NEVER describe specific furniture in staged photos - staging furniture is not included
- MAY mention furniture possibilities or how spaces could be used (e.g., "perfect for a dining table")
- Use proper HTML structure with headings (<h3>), paragraphs (<p>), and bullet lists (<ul><li>)
- Structure content into organized sections for better readability
- Keep total content equivalent to 200-300 words when rendered

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
