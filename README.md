# Realtor Rocket 🚀

A Next.js 15 application that helps realtors generate compelling property listing descriptions using AI-powered image analysis.

## Features

- **Multi-Image Upload**: Drag and drop or click to upload multiple property images
- **Dual AI Processing**: Choose between cloud-based OpenAI + Google Vision or local Ollama processing
- **Two-Step Feature Generation**: Auto-detect features from images or provide custom features for better control
- **AI Image Analysis**: Detect features, objects, and text in property images
- **Smart Description Generation**: Create professional property descriptions with customization options
- **Customizable Output**: Target specific audiences, price ranges, and marketing styles
- **Feature Customization**: Override auto-detected features with your own custom feature list
- **Modern UI**: Clean, responsive design optimized for realtor workflows
- **Real-time Processing**: Instant feedback and processing status updates
- **Local & Cloud Options**: Work offline with Ollama or use cloud APIs for maximum quality

## AI Service Options

### Cloud-Based (OpenAI + Google Vision)
- High-quality results using state-of-the-art APIs
- Requires internet connection and API keys
- Usage-based pricing

### Local Processing (Ollama)
- Complete privacy - all processing happens locally
- No API costs or internet dependency
- Requires local Ollama installation

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed local AI setup instructions.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Cloud Image Analysis**: Google Cloud Vision API
- **Cloud AI**: OpenAI GPT-4o-mini
- **Local AI**: Ollama with LLaVA vision model
- **UI Components**: Lucide React icons
- **Image Processing**: Sharp library

## Quick Start Options

### Option 1: Local AI with Ollama (Recommended for Privacy)
```bash
# Install Ollama
brew install ollama

# Clone and setup
git clone <repository-url>
cd realtor-rocket
npm install

# Use the automated startup script
./start-dev.sh
```

### Option 2: Cloud APIs Setup
```bash
# Clone and install
git clone <repository-url>
cd realtor-rocket
npm install

# Setup environment variables (see below)
cp .env.local.example .env.local

# Start development server
npm run dev
```

## Environment Variables (Optional for Cloud APIs)

If using cloud-based AI services, copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Required for cloud processing:
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account key
- `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
- `OPENAI_API_KEY`: Your OpenAI API key

**Note**: Environment variables are not required if you're using local Ollama processing only.
## Cloud API Setup (Optional)

### Google Cloud Vision API Setup
   - Create a Google Cloud project
   - Enable the Vision API
   - Create a service account and download the JSON key file
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` path in your `.env.local`

### OpenAI API Setup
   - Sign up for OpenAI API access
   - Get your API key from the OpenAI dashboard
   - Add it to your `.env.local` file

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Upload Images**: Drag and drop or click to select property images
2. **Customize Settings**: Choose AI service, property type, target audience, and marketing style
3. **Features (Optional)**: 
   - Leave empty for auto-detection from images
   - Or add custom features (e.g., "granite countertops, hardwood floors, walk-in closets")
4. **Generate Description**: Click "Generate Property Description" to analyze images
5. **Review Results**: View the generated description and see which features were used

See [FEATURE_GENERATION.md](./FEATURE_GENERATION.md) for detailed information about the two-step feature generation process.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze-images/
│   │       └── route.ts          # API endpoint for image analysis
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   └── PropertyUploadForm.tsx   # Main upload and analysis component
└── types/
    └── index.ts                 # TypeScript type definitions
```

## API Endpoints

### POST `/api/analyze-images`
Analyzes uploaded property images and generates descriptions.

**Request**: FormData with `images` field containing image files
**Response**: JSON with `description`, `features`, and `analysisResults`

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Next.js App Router for routing

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Add proper error handling for API calls
3. Include loading states for better UX
4. Ensure mobile responsiveness
5. Add proper TypeScript types for new features

## License

This project is licensed under the MIT License.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Make sure to set up your environment variables in the Vercel dashboard before deploying.
