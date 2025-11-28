// ~/x-tweet-supabase/supabase/functions/processPost/seo.ts

export function generateMetaTags(post: any) {
  return {
    title: post.title,
    description: post.content?.slice(0, 150) || "",
  };
}

export function generateOGImage(post: any) {
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
  if (!cloudName) {
    return `https://og.x-tweet.vercel.app/api/image?text=${encodeURIComponent(post.title)}`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_60_bold:${encodeURIComponent(
    post.title
  )},co_rgb:ffffff,c_fit,w_1200,h_630/v1/og-img-template.png`;
}

export function generateSitemap(post: any) {
  console.log("Adding post to sitemap:", post.id || post.title);
  return true;
}

export function updateTrending(post: any) {
  console.log("Updating trending keywords for:", post.id || post.title);
  return true;
}
