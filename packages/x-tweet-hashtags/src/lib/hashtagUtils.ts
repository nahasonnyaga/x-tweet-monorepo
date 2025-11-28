export function extractHashtags(text: string): string[] {
  const regex = /#(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}

// ===== Self-test section =====
if (import.meta.url === `file://${process.argv[1]}`) {
  const testText = "Learning #TypeScript with #Supabase and #Xtweet!";
  const hashtags = extractHashtags(testText);
  console.log('Extracted hashtags:', hashtags);
}
