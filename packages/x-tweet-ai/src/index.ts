// src/index.ts
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Summarize a tweet or text
 * @param text - Text to summarize
 */
export async function summarizeText(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant for summarizing text." },
      { role: "user", content: `Summarize this: ${text}` }
    ],
    max_tokens: 100
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

/**
 * Moderate content (detect harmful, offensive, or unsafe text)
 * @param text - Text to check
 */
export async function moderateText(text: string): Promise<boolean> {
  const response = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: text
  });

  // Returns true if content is safe
  return !response.results[0]?.flagged;
}

/**
 * Generate suggested reply
 * @param text - Original tweet or content
 */
export async function generateReply(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that writes short, friendly tweet replies." },
      { role: "user", content: `Write a short reply to this tweet: ${text}` }
    ],
    max_tokens: 60
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
