# Realtor Rocket 🚀

A Next.js 15 application that helps realtors generate compelling property listing descriptions using AI-powered image analysis.

## Features

- **Multi-Image Upload**: Drag and drop or click to upload multiple property images
- **AI Image Analysis**: Uses Google Cloud Vision API to detect features, objects, and text in images
- **Smart Description Generation**: Leverages OpenAI to create professional property descriptions
- **Modern UI**: Clean, responsive design optimized for realtor workflows
- **Real-time Processing**: Instant feedback and processing status updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Analysis**: Google Cloud Vision API
- **AI Description**: OpenAI GPT-3.5-turbo
- **UI Components**: Lucide React icons
- **Image Processing**: Sharp library

## Setup

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd realtor-rocket
npm install
```

2. **Set up environment variables**:
Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account key
- `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
- `OPENAI_API_KEY`: Your OpenAI API key

3. **Google Cloud Vision API Setup**:
   - Create a Google Cloud project
   - Enable the Vision API
   - Create a service account and download the JSON key file
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` path in your `.env.local`

4. **OpenAI API Setup**:
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
2. **Review Preview**: See thumbnails of uploaded images with remove options
3. **Generate Description**: Click "Generate Property Description" to analyze images
4. **Get Results**: View the AI-generated description and detected features

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
