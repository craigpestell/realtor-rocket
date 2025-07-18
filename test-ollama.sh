#!/bin/bash

# Test script to verify Ollama integration
echo "🧪 Testing Ollama Integration..."

# Check if Ollama is installed
if ! command -v ollama > /dev/null 2>&1; then
  echo "❌ Ollama is not installed. Please run: brew install ollama"
  exit 1
fi
echo "✅ Ollama is installed"

# Check if Ollama service is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "❌ Ollama service is not running. Please run: ollama serve"
  exit 1
fi
echo "✅ Ollama service is running"

# Check if llava model is available
if ! ollama list | grep -q "llava:latest"; then
  echo "❌ llava:latest model not found. Please run: ollama pull llava:latest"
  exit 1
fi
echo "✅ llava:latest model is available"

# Test the web application
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "⚠️  Web application is not running. Please run: npm run dev"
  echo "✅ All Ollama components are ready"
  exit 0
fi
echo "✅ Web application is running"

echo ""
echo "🎉 All systems are ready!"
echo "   • Ollama service: http://localhost:11434"
echo "   • Web application: http://localhost:3000"
echo "   • Model: llava:latest"
echo ""
echo "You can now use the local AI option in the property upload form."
