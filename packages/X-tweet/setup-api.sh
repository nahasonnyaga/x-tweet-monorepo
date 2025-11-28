#!/bin/bash

# Navigate to X-tweet package root
cd ~/x-tweet-suite/x-tweet-monorepo/packages/X-tweet || exit

echo "🧹 Cleaning up .bak files..."
find src/components -name "*.bak" -delete

echo "📂 Creating API directories..."
API_DIRS=(
  tweets media hashtags profiles comments reactions moderation notifications payments videos ai suggested analytics users admin
)

for dir in "${API_DIRS[@]}"; do
  mkdir -p "src/pages/api/$dir"
done

echo "📝 Creating placeholder API files..."

# Tweets
touch src/pages/api/tweets/create.ts src/pages/api/tweets/feed.ts

# Media
touch src/pages/api/media/upload.ts

# Hashtags
mkdir -p src/pages/api/hashtags/[tag]
cat > src/pages/api/hashtags/[tag]/route.ts << 'EOF'
export async function GET() {
  return new Response('Hashtag API ready')
}
EOF

# Profiles
cat > src/pages/api/profiles/[id].ts << 'EOF'
export default function handler(req, res) {
  res.status(200).json({ message: 'Profile API ready' })
}
EOF

# Comments
touch src/pages/api/comments/create.ts src/pages/api/comments/feed.ts

# Reactions
touch src/pages/api/reactions/like.ts src/pages/api/reactions/retweet.ts

# Moderation
touch src/pages/api/moderation/report.ts src/pages/api/moderation/review.ts

# Notifications
touch src/pages/api/notifications/queue.ts src/pages/api/notifications/send.ts

# Payments
touch src/pages/api/payments/checkout.ts src/pages/api/payments/status.ts

# Videos
touch src/pages/api/videos/upload.ts src/pages/api/videos/stream.ts

# AI
touch src/pages/api/ai/summarize.ts src/pages/api/ai/tag.ts

# Suggested users
touch src/pages/api/suggested/users.ts

# Admin
touch src/pages/api/admin/dashboard.ts src/pages/api/admin/stats.ts

# Analytics
touch src/pages/api/analytics/index.ts

# Users
touch src/pages/api/users/index.ts

echo "✅ All API placeholders are ready!"
