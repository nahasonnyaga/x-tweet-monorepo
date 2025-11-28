import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { validateEvent } from "@lib/webhookUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { eventType, payload, secret } = req.body;

    // Validate the webhook secret
    if (!validateEvent(secret)) {
      return res.status(401).json({ error: "Invalid webhook secret" });
    }

    // Upsert data into Supabase based on event type
    await supabase.from(eventType).upsert(payload);

    res.status(200).json({ status: "success", eventType });
  } catch (err: any) {
    console.error("Webhook sync error:", err);
    res.status(500).json({ error: err.message });
  }
}
