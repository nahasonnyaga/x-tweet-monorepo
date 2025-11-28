/**
 * structured-data.js
 * JSON-LD generators for profiles, posts, videos, hashtags
 */

export function profileSchema({ name, url, image, description, sameAs=[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    image,
    description,
    sameAs
  };
}

export function postSchema({ headline, authorName, url, datePublished, image, articleBody }) {
  return {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline,
    author: { "@type": "Person", name: authorName },
    url,
    datePublished,
    image,
    articleBody
  };
}

export function videoSchema({ name, description, thumbnailUrl, uploadDate, duration, contentUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl
  };
}

export function hashtagSchema({ name, url, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    name,
    url,
    description
  };
}
