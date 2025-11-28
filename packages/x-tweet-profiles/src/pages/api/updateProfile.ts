import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send("Method Not Allowed");

  const { id, username, bio, avatar_url } = req.body;

  const { data, error } = await supabase
    .from("profiles")
    .update({ username, bio, avatar_url })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}

