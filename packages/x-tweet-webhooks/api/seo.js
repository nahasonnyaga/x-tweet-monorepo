import { handleNewPost } from '../lib/hooks.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const post = req.body;
  if (!post) return res.status(400).json({ error: 'No post data provided' });

  try {
    await handleNewPost(post);
    return res.status(200).json({ message: 'SEO triggered successfully' });
  } catch (err) {
    console.error('Error triggering SEO:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
