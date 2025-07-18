#!/bin/bash

# Development startup script for Realtor Rocket
# This script checks if Ollama is running, starts it if needed, and then starts the Next.js dev server

set -e  # Exit on any error

echo "🚀 Starting Realtor Rocket Development Environment..."

# Function to check if Ollama is running
check_ollama() {
  if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    return 0  # Ollama is running
  else
    return 1  # Ollama is not running
  fi
}

# Function to check if Ollama service/process exists
check_ollama_installed() {
  if command -v ollama > /dev/null 2>&1; then
    return 0  # Ollama is installed
  else
    return 1  # Ollama is not installed
  fi
}

# Function to start Ollama
start_ollama() {
  echo "📡 Starting Ollama service..."
  
  # Try to start Ollama in the background
  if command -v brew > /dev/null 2>&1 && brew services list | grep -q ollama; then
    # If installed via Homebrew, use brew services
    echo "   Using Homebrew to start Ollama..."
    brew services start ollama
  else
    # Start Ollama directly
    echo "   Starting Ollama directly..."
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    echo "   Ollama started in background (logs: /tmp/ollama.log)"
  fi
  
  # Wait for Ollama to be ready
  echo "   Waiting for Ollama to be ready..."
  local max_attempts=30
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    if check_ollama; then
      echo "   ✅ Ollama is ready!"
      return 0
    fi
    
    echo "   Attempt $attempt/$max_attempts - waiting..."
    sleep 2
    attempt=$((attempt + 1))
  done
  
  echo "   ❌ Failed to start Ollama after $max_attempts attempts"
  echo "   Check the logs at /tmp/ollama.log"
  return 1
}

# Function to check and pull required model
check_model() {
  echo "🤖 Checking for required AI model..."
  
  local model="llava:latest"
  if ollama list | grep -q "$model"; then
    echo "   ✅ Model $model is available"
    return 0
  else
    echo "   📥 Model $model not found, pulling it..."
    ollama pull "$model"
    if [ $? -eq 0 ]; then
      echo "   ✅ Model $model downloaded successfully"
      return 0
    else
      echo "   ❌ Failed to download model $model"
      return 1
    fi
  fi
}

# Function to check if Next.js server is already running
check_nextjs() {
  for port in 3000 3001 3002; do
    if curl -s http://localhost:$port > /dev/null 2>&1; then
      echo "   ⚠️  Next.js server already running on port $port"
      return 0
    fi
  done
  return 1
}

# Function to start Next.js development server
start_nextjs() {
  echo "⚡ Starting Next.js development server..."
  
  # Install dependencies if node_modules doesn't exist
  if [ ! -d "node_modules" ]; then
    echo "   📦 Installing dependencies..."
    npm install
  fi
  
  # Start the development server
  echo "   🌐 Starting server with npm dev..."
  npm run dev
}

# Main execution
echo ""
echo "=== STEP 1: Check Ollama Installation ==="
if ! check_ollama_installed; then
  echo "❌ Ollama is not installed!"
  echo ""
  echo "Please install Ollama first:"
  echo "  macOS: brew install ollama"
  echo "  or visit: https://ollama.ai/download"
  exit 1
fi
echo "✅ Ollama is installed"

echo ""
echo "=== STEP 2: Check Ollama Service ==="
if check_ollama; then
  echo "✅ Ollama is already running"
else
  if ! start_ollama; then
    echo "❌ Failed to start Ollama"
    exit 1
  fi
fi

echo ""
echo "=== STEP 3: Check AI Model ==="
if ! check_model; then
  echo "❌ Failed to setup required AI model"
  exit 1
fi

echo ""
echo "=== STEP 4: Check Next.js Server ==="
if check_nextjs; then
  echo "✅ Development server is already running"
  echo ""
  echo "🎉 Development environment is ready!"
  echo "   • Ollama: http://localhost:11434"
  echo "   • Next.js: Check the running ports above"
  echo ""
  echo "Press Ctrl+C to stop this script"
  # Keep script running to show status
  while true; do
    sleep 10
  done
else
  echo "🌐 Starting development server..."
  echo ""
  echo "=== STEP 5: Start Next.js Development Server ==="
  start_nextjs
fi
