import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("username", username)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
