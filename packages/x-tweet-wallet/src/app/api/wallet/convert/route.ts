import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fromCurrency, toCurrency, amount } = req.body;
  // Placeholder conversion logic
  const rate = 1; // Replace with real FX API call
  res.status(200).json({ convertedAmount: amount * rate });
}
