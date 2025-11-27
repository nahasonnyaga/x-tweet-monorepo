#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Starting local services for X-Tweet Monorepo..."

# Start x-tweet-supabase (assuming it runs on port 3002)
cd packages/x-tweet-supabase && pnpm dev &
echo "✅ x-tweet-supabase started (port 3002)"

# Start x-tweet-analytics (assuming it runs on port 3003)
cd packages/x-tweet-analytics && pnpm dev &
echo "✅ x-tweet-analytics started (port 3003)"

# Start x-tweet-moderation (if it has an HTTP server, e.g., port 3004)
cd packages/x-tweet-moderation && pnpm dev &
echo "✅ x-tweet-moderation started (port 3004)"

# Start ngrok for x-tweet-supabase
cd packages/x-tweet-supabase && ngrok http 3002 &
echo "🔗 ngrok for x-tweet-supabase: https://[your-ngrok-url].ngrok.io"

# Start ngrok for x-tweet-analytics
cd packages/x-tweet-analytics && ngrok http 3003 &
echo "🔗 ngrok for x-tweet-analytics: https://[your-ngrok-url].ngrok.io"

# Start ngrok for x-tweet-moderation
cd packages/x-tweet-moderation && ngrok http 3004 &
echo "🔗 ngrok for x-tweet-moderation: https://[your-ngrok-url].ngrok.io"

echo "🎉 All local services are running. Use ngrok URLs in remote Next.js apps."
