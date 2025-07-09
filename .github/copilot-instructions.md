# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js 15 project called "Realtor Rocket" - a property listing description generator for realtors. The application allows realtors to upload property images and generates compelling listing descriptions using Google Cloud Vision API for image analysis.

## Key Features

- **Image Upload**: Multi-file upload system for property photos
- **Image Analysis**: Google Cloud Vision API integration for feature extraction
- **AI Description Generation**: Automated property description creation
- **Modern UI**: Clean, responsive design optimized for realtor workflows
- **TypeScript**: Full type safety throughout the application

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Google Cloud Vision API
- **File Upload**: Multi-part form handling
- **AI Integration**: OpenAI/Anthropic for description generation

## Code Style Guidelines

- Use TypeScript for all components and utilities
- Follow Next.js 13+ App Router patterns
- Implement proper error handling for API calls
- Use Tailwind CSS for styling with mobile-first approach
- Create reusable components in the `components/` directory
- Organize API routes in the `app/api/` directory
- Use proper loading states and error boundaries

## API Integration Notes

- Google Cloud Vision API requires proper authentication
- Implement rate limiting for API calls
- Handle image upload size limits gracefully
- Provide fallback descriptions when AI services are unavailable
- Use environment variables for API keys and sensitive data

## UX Considerations

- Optimize for realtor workflow efficiency
- Provide clear feedback during image processing
- Enable batch processing for multiple properties
- Include editing capabilities for generated descriptions
- Ensure accessibility compliance (WCAG 2.1 AA)
