#!/bin/bash
# ===============================
# X-Tweet Monorepo One-Click Setup
# ===============================

# Exit on any error
set -e

echo "🚀 Starting X-Tweet Monorepo setup..."

# 1️⃣ Install PNPM if not installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 PNPM not found. Installing..."
    npm install -g pnpm
fi

# 2️⃣ Install dependencies for all workspace packages
echo "📥 Installing dependencies..."
pnpm install

# 3️⃣ Initialize x-tweet-supabase if package.json missing
SUPABASE_PKG="packages/x-tweet-supabase/package.json"
if [ ! -f "$SUPABASE_PKG" ]; then
    echo "📝 Initializing x-tweet-supabase..."
    cd packages/x-tweet-supabase
    pnpm init -y
    cd ../..
fi

# 4️⃣ Link all workspace packages to X-tweet frontend
echo "🔗 Linking workspace packages to X-tweet..."
cd packages/X-tweet
pnpm add \
x-tweet-admin \
x-tweet-ai \
x-tweet-analytics \
x-tweet-comments \
x-tweet-hashtags \
x-tweet-media \
x-tweet-moderation \
x-tweet-notifications \
x-tweet-notifications-queue \
x-tweet-payments \
x-tweet-profiles \
x-tweet-reactions \
x-tweet-search \
x-tweet-seo \
x-tweet-suggested \
x-tweet-supabase \
x-tweet-trending \
x-tweet-users \
x-tweet-videos \
x-tweet-webhooks \
--workspace
cd ../..

# 5️⃣ Husky Git hooks
echo "🐶 Setting up Git hooks..."
pnpm dlx husky install

# 6️⃣ Create .env if missing
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "🔑 Creating default .env file..."
    cat <<EOL > $ENV_FILE
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
FIREBASE_PROJECT_ID=your-firebase-project
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloud-key
CLOUDINARY_API_SECRET=your-cloud-secret
EOL
fi

# 7️⃣ Optional: run Supabase migrations (if you have them)
# echo "💾 Running Supabase migrations..."
# pnpm --filter x-tweet-supabase run migrate

# 8️⃣ Start dev server
echo "🚀 Starting X-tweet dev server..."
cd packages/X-tweet
pnpm dev

echo "✅ Setup complete! Open http://localhost:3000 to view X-Tweet."
