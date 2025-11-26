#!/bin/bash
set -e

echo "🚀 Scanning monorepo for missing src/index.ts files..."

PACKAGES_DIR="./packages"
CREATED=0
SKIPPED=0

for pkg in "$PACKAGES_DIR"/*; do
  if [ -d "$pkg/src" ]; then
    INDEX_FILE="$pkg/src/index.ts"
    if [ ! -f "$INDEX_FILE" ]; then
      echo "⚡ Creating placeholder for $(basename $pkg)/src/index.ts"
      cat <<EOL > "$INDEX_FILE"
// Placeholder index.ts for $(basename $pkg)
console.log('$(basename $pkg): placeholder index.ts');
EOL
      ((CREATED++))
    else
      ((SKIPPED++))
    fi
  fi
done

echo "✅ Done."
echo "Created $CREATED placeholder index.ts files."
echo "Skipped $SKIPPED packages (already had index.ts)."
