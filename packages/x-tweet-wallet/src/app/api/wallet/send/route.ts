import type { NextApiRequest, NextApiResponse } from "next";
import { sendCrypto } from "@lib/chains/crypto";
import { sendMomo } from "@lib/mobile-money/mpesa";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, to, amount, currency } = req.body;

  try {
    let result;
    if (type === "crypto") result = await sendCrypto(currency, to, amount);
    if (type === "momo") result = await sendMomo(to, amount, currency);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
