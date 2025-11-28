import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { flagContent } from "@lib/moderationUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { contentId, action } = req.body;
    
    if (!contentId || !action) return res.status(400).json({ error: "Missing parameters" });

    const result = await flagContent(contentId, action);
    
    res.status(200).json({ status: "success", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
