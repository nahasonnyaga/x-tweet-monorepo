import type { NextApiRequest, NextApiResponse } from "next";
import { receiveCrypto } from "@lib/chains/crypto";
import { receiveMomo } from "@lib/mobile-money/mpesa";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, currency } = req.body;
  let result;
  if (type === "crypto") result = await receiveCrypto(currency);
  if (type === "momo") result = await receiveMomo();

  res.status(200).json(result);
}
