import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { generateWalletId } from "@lib/utils/walletUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { userId } = req.body;
  const walletId = generateWalletId(userId);

  const { error } = await supabase.from("wallets").insert([{ id: walletId, user_id: userId }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ walletId });
}
