import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { tweetId, content } = req.body;

  try {
    const { data, error } = await supabase.from("comments").insert([{ tweetId, content }]);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
