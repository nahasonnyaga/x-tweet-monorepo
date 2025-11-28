import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tweetId } = req.query;

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("tweetId", tweetId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
