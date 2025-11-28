import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
    console.log("REQ BODY:", req.body);
    const data = req.body;
    const { error } = await supabase.from("feed").insert([data]);
    if (error) throw error;
    res.status(200).json({ message: "Created successfully", data });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
