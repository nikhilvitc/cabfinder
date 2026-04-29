#!/bin/bash

# Railway Deployment Script for CabMate Finder Backend
echo "🚀 Deploying CabMate Finder Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend directory
cd "/Users/nikhilkumar/travel vhelp/cabmate-finder/backend"

echo "📁 Current directory: $(pwd)"
echo "📦 Package.json contents:"
cat package.json

echo ""
echo "🔧 Railway configuration:"
cat railway.json

echo ""
echo "📋 Deployment Steps:"
echo "1. Run: railway login"
echo "2. Run: railway init"
echo "3. Run: railway up"
echo ""
echo "🌐 After deployment, update frontend with the Railway URL"
