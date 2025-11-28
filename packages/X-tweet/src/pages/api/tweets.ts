// packages/X-tweet/src/pages/api/tweets.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";

import { supabase } from "@x-tweet-supabase/lib/app";
import { uploadAndInsertMedia } from "@x-tweet-admin/lib/uploadMedia";

const upload = multer({ dest: "/tmp" });

const apiRoute = nextConnect({
  onError(error, req: any, res: any) {
    console.error(error);
    res.status(501).json({ error: error.message });
  },
  onNoMatch(req: any, res: any) {
    res.status(405).json({ error: "Method Not Allowed" });
  },
});

apiRoute.use(upload.array("files"));

apiRoute.post(async (req: any, res: any) => {
  try {
    const { content, authorId } = req.body;

    if (!content || !authorId) {
      return res.status(400).json({ error: "Missing content or authorId" });
    }

    let mediaResults: any[] = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadAndInsertMedia({
          filePath: file.path,
          mediaType: file.mimetype,
          uploaderId: authorId,
        });

        mediaResults.push(result);
      }
    }

    const { data: tweetData, error: tweetError } = await supabase
      .from("tweets")
      .insert([
        {
          content,
          author_id: authorId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (tweetError) throw tweetError;

    for (const result of mediaResults) {
      const mediaRow = result.supabase[0];
      await supabase.from("media").update({ tweet_id: tweetData.id }).eq("id", mediaRow.id);
    }

    return res.status(200).json({ tweet: tweetData, media: mediaResults });
  } catch (err: any) {
    console.error("Tweet upload failed:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default apiRoute;

// REQUIRED: Disable Next.js' default body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};
