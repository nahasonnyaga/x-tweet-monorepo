import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import cloudinary from "@lib/cloudinary";
import { db } from "@lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ QUERY:", req.query);
    res.status(200).json({ message: "This endpoint is wired with Supabase, Cloudinary, and Firebase" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
