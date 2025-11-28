const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "default_secret";

/**
 * Validate incoming webhook secret
 */
export function validateEvent(secret: string) {
  return secret === WEBHOOK_SECRET;
}
