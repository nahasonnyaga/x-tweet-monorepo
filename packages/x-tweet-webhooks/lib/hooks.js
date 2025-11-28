import { generateMetaTags, generateOGImage, generateSitemap, updateTrending } from './seo.js';

export async function handleNewPost(post) {
  console.log('Processing new post:', post.id);
  try {
    await generateMetaTags(post);
    await generateOGImage(post);
    await generateSitemap(post);
    await updateTrending(post);
    console.log('SEO completed for post:', post.id);
  } catch (err) {
    console.error('Error in handleNewPost:', err);
  }
}
