import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { db } from "@lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (req.method === "GET") {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === "POST") {
      await db.collection("profiles").doc().set(req.body);
      return res.status(200).json({ message: "Saved to Firebase" });
    } else if (req.method === "PUT") {
      const { error } = await supabase.from("profiles").update(req.body).eq("id", id);
      if (error) throw error;
      return res.status(200).json({ message: "Updated successfully" });
    }
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
