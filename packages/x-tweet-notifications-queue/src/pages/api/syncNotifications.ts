import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { addNotification } from "@lib/notificationUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { username, type, content } = req.body;
  if (!username || !type || !content) return res.status(400).json({ error: "Missing fields" });

  try {
    const data = await addNotification(username, type, content);
    res.status(200).json({ status: "success", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
