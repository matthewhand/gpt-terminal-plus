#!/bin/bash
set -e

echo "🚀 GPT Terminal Plus Deployment Script"

# Build application
echo "📦 Building application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Check for deployment target
if [ "$1" = "fly" ]; then
    echo "✈️ Deploying to Fly.io..."
    flyctl deploy
    echo "🌐 Deployed to: https://gpt-terminal-plus.fly.dev"
    
elif [ "$1" = "vercel" ]; then
    echo "▲ Deploying to Vercel..."
    vercel --prod
    
elif [ "$1" = "docker" ]; then
    echo "🐳 Building Docker image..."
    docker build -t gpt-terminal-plus .
    echo "✅ Docker image built: gpt-terminal-plus"
    
else
    echo "Usage: ./scripts/deploy.sh [fly|vercel|docker]"
    echo ""
    echo "Available deployment targets:"
    echo "  fly     - Deploy to Fly.io"
    echo "  vercel  - Deploy to Vercel"
    echo "  docker  - Build Docker image"
    exit 1
fi

echo "✅ Deployment complete!"