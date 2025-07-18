# Two-Step Feature Generation Enhancement

## Overview

The property description generation now uses a sophisticated two-step process that gives users complete control over the features used for description generation.

## How It Works

### Step 1: Feature Generation
- **If user provides features**: Uses the custom features text directly
- **If features field is empty**: Auto-generates features from uploaded images using AI

### Step 2: Description Generation  
- Uses the features (either user-provided or auto-generated) combined with uploaded images
- Generates a compelling property description tailored to the specified features

## User Experience

### Features Textarea
- **Location**: In the customization section of the form
- **Purpose**: Allows users to specify custom property features
- **Placeholder**: Provides guidance on what to include
- **Help Text**: Explains auto-detection fallback

### Smart Feature Detection
- **Auto-Detection**: If textarea is empty, AI analyzes images to identify features
- **User Control**: Users can override auto-detection with specific features
- **Hybrid Approach**: Best of both automated detection and manual customization

### Enhanced Results Display
- **Features Used**: Shows exactly which features were used for description generation
- **Source Indicator**: Displays whether features were user-provided or auto-generated
- **Detected Features**: Still shows raw features detected from images for reference

## Technical Implementation

### API Enhancement
- **Two-Step Process**: Separate feature generation and description generation phases
- **Service Support**: Works with both OpenAI and Ollama services
- **Fallback Logic**: Graceful handling if feature generation fails

### New API Response Fields
```json
{
  "description": "Generated description...",
  "features": ["detected", "features", "array"],
  "usedFeatures": "actual features text used for description",
  "detectedText": "text found in images",
  "analysisResults": "detailed analysis data"
}
```

## Benefits

### For Users
1. **Complete Control**: Can specify exactly which features to highlight
2. **Smart Defaults**: Auto-detection when no custom features provided
3. **Transparency**: Clear indication of what features were used
4. **Flexibility**: Can edit and refine features before generation

### For Descriptions
1. **More Accurate**: Features directly relevant to the property
2. **Customizable**: Highlight unique selling points
3. **Professional**: User can add features AI might miss
4. **Targeted**: Focus on features important to target audience

## Usage Examples

### Auto-Generated Features
1. Upload property images
2. Leave "Property Features" field empty
3. Select AI service and other preferences
4. Click "Generate Property Description"
5. AI automatically detects and uses features from images

### Custom Features
1. Upload property images
2. Fill in "Property Features" with specific features:
   ```
   granite countertops, hardwood floors throughout, 
   walk-in closets, stainless steel appliances, 
   vaulted ceilings, fireplace, two-car garage
   ```
3. Select preferences and generate description
4. AI uses your specific features for a targeted description

### Hybrid Approach
1. Generate description with auto-detected features first
2. Review the "Features Used for Description" in results
3. Edit the features field with additions/modifications
4. Regenerate for a more customized description

## Feature Categories

The system intelligently categorizes features for better processing:

- **Structural**: Building, foundation, frame elements
- **Interior**: Flooring, walls, fixtures, appliances
- **Exterior**: Roof, siding, landscaping, outdoor features
- **Materials**: Wood, brick, stone, tile, finishes
- **Architectural**: Windows, doors, columns, design elements
- **Location**: Neighborhood, area characteristics

## Best Practices

### For Custom Features
1. **Be Specific**: "Granite countertops" vs "nice kitchen"
2. **Include Materials**: "Hardwood floors" vs "flooring"
3. **Highlight Unique**: Features that make the property special
4. **Target Audience**: Features appealing to intended buyers

### For Auto-Detection
1. **Quality Images**: Clear, well-lit photos work best
2. **Multiple Angles**: Interior, exterior, and detail shots
3. **Feature Visibility**: Ensure key features are clearly visible
4. **Room Variety**: Include different rooms and spaces

## Troubleshooting

### No Features Detected
- Check image quality and clarity
- Ensure images show property features clearly
- Try adding manual features in the textarea

### Inaccurate Auto-Detection
- Use the custom features field to override
- Provide specific features you want highlighted
- Review and edit detected features as needed

### Description Quality
- Refine features text for better results
- Use descriptive feature names
- Include materials and specific details

This enhancement provides the perfect balance between automation and user control, ensuring every property description can be tailored to highlight its unique selling points.
