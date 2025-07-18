# Ollama Integration Setup

This guide explains how to set up and use the local Ollama integration for property description generation.

## Prerequisites

1. Install Ollama on your system:
   ```bash
   # macOS
   brew install ollama
   
   # Or download from https://ollama.ai/download
   ```

2. Install the required model:
   ```bash
   ollama pull llava:latest
   ```

## Quick Start

1. Use the provided startup script to ensure everything is running:
   ```bash
   ./start-dev.sh
   ```

   This script will:
   - Check if Ollama is installed
   - Start Ollama service if not running
   - Pull the required `llava:latest` model if not present
   - Start the Next.js development server

## Manual Setup

If you prefer to start services manually:

1. Start Ollama service:
   ```bash
   # Using Homebrew (recommended)
   brew services start ollama
   
   # Or directly
   ollama serve
   ```

2. Verify Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. Pull the vision model (if not already done):
   ```bash
   ollama pull llava:latest
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Using the AI Service Selector

In the property upload form, you'll now see an "AI Service" dropdown with two options:

1. **OpenAI + Google Vision (Cloud)**: Uses cloud-based APIs
   - Requires valid OpenAI and Google Cloud Vision API keys
   - Higher quality but uses API credits
   - Works without local setup

2. **Ollama (Local)**: Uses local AI processing
   - No API costs or internet dependency
   - Requires local Ollama setup
   - Works entirely offline once configured

## Features

### Ollama Benefits
- **Privacy**: All processing happens locally
- **Cost**: No API usage fees
- **Offline**: Works without internet connection
- **Customizable**: Can use different models

### OpenAI + Google Vision Benefits
- **Quality**: State-of-the-art results
- **Speed**: Fast cloud processing
- **Reliability**: Enterprise-grade service
- **Features**: Advanced vision capabilities

## Troubleshooting

### Ollama Not Available
If you see "Ollama service is not available":
1. Check if Ollama is running: `curl http://localhost:11434/api/tags`
2. Start Ollama: `brew services start ollama` or `ollama serve`
3. Verify installation: `ollama --version`

### Model Not Found
If you see "Required model (llava:latest) is not available":
1. Pull the model: `ollama pull llava:latest`
2. List installed models: `ollama list`
3. Wait for download to complete (model is ~4GB)

### Performance Tips
- First run may be slower as the model loads into memory
- Subsequent requests will be faster
- Consider using smaller models for faster processing:
  ```bash
  ollama pull llava:7b  # Smaller, faster model
  ```

## Model Options

You can experiment with different vision models:

```bash
# Different LLaVA variants
ollama pull llava:latest    # ~4GB, best quality
ollama pull llava:7b        # ~4GB, good balance
ollama pull llava:13b       # ~8GB, higher quality

# Other vision models
ollama pull moondream       # ~1.6GB, lightweight
ollama pull bakllava        # Alternative model
```

To use a different model, update the model name in `/src/lib/ollama.ts`.

## Development Notes

- The Ollama client is configured to use `http://localhost:11434` by default
- Images are converted to base64 for the Ollama API
- The response parser extracts features and descriptions from the model output
- Error handling includes checks for service availability and model presence

## Environment Variables

No additional environment variables are required for Ollama integration. The system will automatically detect if Ollama is available and working.

For OpenAI + Google Vision, you still need:
- `OPENAI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_CLOUD_PROJECT_ID`
