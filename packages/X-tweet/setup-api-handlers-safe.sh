#!/bin/bash
# setup-api-handlers-safe.sh
# Scans API folders and creates typed placeholders for missing endpoints

API_ROOT="src/pages/api"

# ANSI colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo -e "📂 Ensuring API directories exist..."

# Find all API endpoint files (ignoring .bak, node_modules, etc.)
find "$API_ROOT" -type f -name "*.ts" ! -name "*.bak" | while read -r FILE; do
    if [[ ! -s "$FILE" ]]; then
        echo -e "${YELLOW}Creating placeholder:${RESET} $FILE"
        cat > "$FILE" <<EOL
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Placeholder API handler for $(basename "$FILE")
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ message: "Placeholder for $(basename "$FILE")" });
}
EOL
    else
        echo -e "Skipped (exists): $FILE"
    fi
done

echo -e "${GREEN}✅ API setup complete! Existing files were preserved.${RESET}"
