import { generateMetaTags, generateOGImage, generateSitemap, updateTrending } from './seo.js';

export async function handleNewPost(post) {
  console.log('New post received:', post.id);

  try {
    const meta = await generateMetaTags(post);
    const ogUrl = await generateOGImage(post);
    await generateSitemap(post);
    await updateTrending(post);
    console.log('SEO processing complete for post:', post.id);
  } catch (err) {
    console.error('Error processing SEO for post:', post.id, err);
  }
}
