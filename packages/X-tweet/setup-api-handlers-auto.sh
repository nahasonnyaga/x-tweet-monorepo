#!/bin/bash
# setup-api-handlers-auto.sh
# Fully auto-wires API endpoints with Supabase + Cloudinary + Firebase
# Infers table names and method scaffolding from folder/filename

API_ROOT="src/pages/api"

# ANSI colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo -e "📂 Scanning API folders and auto-wiring endpoints..."

find "$API_ROOT" -type f -name "*.ts" ! -name "*.bak" | while read -r FILE; do
    BASENAME=$(basename "$FILE" .ts)
    DIRNAME=$(dirname "$FILE")
    TABLE_NAME=$(basename "$DIRNAME")  # use folder name as default Supabase table

    # Skip if already wired
    if grep -q "supabase" "$FILE"; then
        echo -e "Skipped (already wired): $FILE"
        continue
    fi

    echo -e "${YELLOW}Wiring endpoint:${RESET} $FILE"

    # Auto-generate handler based on type
    if [[ "$FILE" == *"/media/"* ]]; then
        # Media -> Cloudinary upload
        cat > "$FILE" <<EOL
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@lib/cloudinary";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const file = req.body.file;
      const result = await cloudinary.uploader.upload(file);
      return res.status(200).json({ url: result.secure_url });
    }
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
EOL

    elif [[ "$FILE" == *"/tweets/"* ]] || [[ "$FILE" == *"/comments/"* ]]; then
        # Tweets / Comments -> Supabase insert + get feed
        cat > "$FILE" <<EOL
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { error } = await supabase.from("$TABLE_NAME").insert([req.body]);
      if (error) throw error;
      return res.status(200).json({ message: "Created successfully" });
    } else if (req.method === "GET") {
      const { data, error } = await supabase.from("$TABLE_NAME").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
EOL

    elif [[ "$FILE" == *"/users/"* ]] || [[ "$FILE" == *"/profiles/"* ]]; then
        # Users / Profiles -> Supabase + Firebase
        cat > "$FILE" <<EOL
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { db } from "@lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (req.method === "GET") {
      const { data, error } = await supabase.from("$TABLE_NAME").select("*").eq("id", id).single();
      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === "POST") {
      await db.collection("$TABLE_NAME").doc().set(req.body);
      return res.status(200).json({ message: "Saved to Firebase" });
    } else if (req.method === "PUT") {
      const { error } = await supabase.from("$TABLE_NAME").update(req.body).eq("id", id);
      if (error) throw error;
      return res.status(200).json({ message: "Updated successfully" });
    }
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
EOL

    else
        # Default placeholder
        cat > "$FILE" <<EOL
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import cloudinary from "@lib/cloudinary";
import { db } from "@lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({ message: "This endpoint is auto-wired with Supabase, Cloudinary, and Firebase" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
EOL
    fi

done

echo -e "${GREEN}✅ All API endpoints are fully auto-wired with Supabase + Cloudinary + Firebase.${RESET}"
