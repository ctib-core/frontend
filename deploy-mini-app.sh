#!/bin/bash

echo "🚀 Deploying Pulley Mini App..."

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if ! npm list @coinbase/onchainkit > /dev/null 2>&1; then
    echo "Installing MiniKit dependencies..."
    npm install @coinbase/onchainkit @farcaster/frame-wagmi-connector
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Deploy to your hosting provider (e.g., Vercel)"
    echo "2. Update the Farcaster manifest with your domain"
    echo "3. Test the mini app in Farcaster"
    echo ""
    echo "📚 For detailed instructions, see MINI_APP_README.md"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
