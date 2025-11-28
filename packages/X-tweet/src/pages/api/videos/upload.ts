import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@lib/cloudinary";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
    console.log("REQ BODY:", req.body);
    const file = req.body.file;
    const result = await cloudinary.uploader.upload(file);
    res.status(200).json({ url: result.secure_url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
