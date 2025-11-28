import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { error } = await supabase.from("comments").insert([req.body]);
      if (error) throw error;
      return res.status(200).json({ message: "Created successfully" });
    } else if (req.method === "GET") {
      const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
