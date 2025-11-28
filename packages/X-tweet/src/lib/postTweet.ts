// packages/X-tweet/src/lib/postTweet.ts

export async function postTweet({
  content,
  authorId,
  files = [],
}: {
  content: string;
  authorId: string;
  files?: File[];
}) {
  try {
    // Prepare multipart form data
    const form = new FormData();
    form.append("content", content);
    form.append("authorId", authorId);

    // Attach files (if any)
    files.forEach((file) => {
      form.append("files", file);
    });

    const res = await fetch("/api/tweets", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Tweet upload failed");
    }

    return data;
  } catch (err: any) {
    console.error("Post tweet error:", err);
    return { error: err.message };
  }
}
