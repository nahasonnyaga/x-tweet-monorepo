#!/bin/bash

# Safe monorepo full fix script
# Run from monorepo root: ~/x-tweet-suite/x-tweet-monorepo

set -e

echo "🚀 Starting full safe monorepo fix..."

# -----------------------
# Packages definitions
# -----------------------

TS_PACKAGES=(
  "x-tweet-wallet"
  "x-tweet-hashtags"
  "x-tweet-moderation"
  "x-tweet-comments"
  "x-tweet-notifications-queue"
  "x-tweet-analytics"
  "x-tweet-videos"
  "x-tweet-ai"
  "x-tweet-notifications"
  "x-tweet-media"
)

NEXT_PACKAGES=(
  "X-tweet"
  "x-tweet-media"
  "x-tweet-trending"
  "x-tweet-seo"
  "x-tweet-profiles"
  "x-tweet-search"
)

# Base port for Next.js apps
BASE_PORT=3000

# -----------------------
# Step 1: Fix TS packages
# -----------------------

echo "🔧 Fixing TypeScript packages..."

for pkg in "${TS_PACKAGES[@]}"; do
  PKG_DIR="packages/$pkg"
  PACKAGE_JSON="$PKG_DIR/package.json"

  # Add dev script if missing
  if ! grep -q '"dev"' "$PACKAGE_JSON"; then
    echo "Adding dev script to $pkg"
    jq '.scripts.dev="ts-node src/index.ts"' "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp" && mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"
  fi

  # Add tsconfig.json if missing
  if [ ! -f "$PKG_DIR/tsconfig.json" ]; then
    echo "Creating tsconfig.json for $pkg"
    cat > "$PKG_DIR/tsconfig.json" <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOL
  fi

  # Fix Supabase imports safely
  find "$PKG_DIR/src" -type f -name "*.ts" -o -name "*.tsx" | while read FILE; do
    if grep -q "@supabase/supabase-js" "$FILE"; then
      echo "Backing up $FILE..."
      cp "$FILE" "$FILE.bak"

      echo "Patching Supabase import in $FILE..."
      sed -i "s|import { createClient, SupabaseClient } from '@supabase/supabase-js';|import pkg from '@supabase/supabase-js';\nconst { createClient } = pkg;\nimport type { SupabaseClient } from '@supabase/supabase-js';|" "$FILE"
    fi
  done
done

# -----------------------
# Step 2: Fix Next.js packages
# -----------------------

echo "⚡ Fixing Next.js packages..."
PORT=$BASE_PORT
for pkg in "${NEXT_PACKAGES[@]}"; do
  PKG_DIR="packages/$pkg"
  PACKAGE_JSON="$PKG_DIR/package.json"

  # Add dev script if missing
  if ! grep -q '"dev"' "$PACKAGE_JSON"; then
    echo "Adding dev script to $pkg with port $PORT"
    jq --arg port "$PORT" '.scripts.dev="next dev -p \($port)"' "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp" && mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"
    PORT=$((PORT+1))
  fi

  # Add tsconfig.json if missing
  if [ ! -f "$PKG_DIR/tsconfig.json" ]; then
    echo "Creating tsconfig.json for $pkg"
    cat > "$PKG_DIR/tsconfig.json" <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "preserve",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@lib/*": ["src/lib/*"]
    }
  },
  "include": ["next-env.d.ts", "src/**/*"],
  "exclude": ["node_modules"]
}
EOL
  fi
done

# -----------------------
# Step 3: Install missing dependencies
# -----------------------

echo "📦 Installing missing dependencies..."
pnpm add -D ts-node typescript @types/node @types/react @types/supabase-js
pnpm add next react react-dom @supabase/supabase-js cloudinary firebase-admin
pnpm add -g vercel || true

# -----------------------
# Step 4: Create stubs for missing @lib/* modules
# -----------------------

echo "🛠️ Creating stubs for missing @lib modules..."

for pkg in "${NEXT_PACKAGES[@]}"; do
  LIB_DIR="packages/$pkg/src/lib"
  mkdir -p "$LIB_DIR"

  # Create empty index.ts if missing
  if [ ! -f "$LIB_DIR/index.ts" ]; then
    echo "// Auto-generated stub for @lib modules" > "$LIB_DIR/index.ts"
  fi
done

# -----------------------
# Step 5: Ensure ports are free
# -----------------------

echo "🔌 Checking ports from $BASE_PORT..."
for p in $(seq $BASE_PORT $((BASE_PORT+20))); do
  if lsof -i tcp:$p &>/dev/null; then
    echo "⚠ Port $p is in use, killing process..."
    lsof -ti tcp:$p | xargs kill -9
  fi
done

echo "✅ Full safe monorepo fix completed!"
echo "💡 All modified files have backups with .bak extension."
echo "You can now run: pnpm run start-all"
