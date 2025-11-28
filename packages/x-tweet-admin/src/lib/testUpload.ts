// src/lib/testUpload.ts

import { uploadAndInsertMedia } from "./uploadMedia";
import fs from "fs";

async function testUpload() {
  try {
    console.log("=== Running Media Upload Test ===\n");

    const testFile = "./src/lib/test-image.png"; // or .mp4 if you want

    // Check file exists
    if (!fs.existsSync(testFile)) {
      console.error("❌ Test file does NOT exist:", testFile);
      return;
    }

    const result = await uploadAndInsertMedia({
      filePath: testFile,
      mediaType: "image/png", // or "video/mp4"
      uploaderId: "u1", // use your real user id
      tweetId: "tw1",   // or any tweet id
    });

    console.log("\n=== Upload Summary ===\n");

    // -------------------------
    // CLOUDINARY OUTPUT
    // -------------------------
    console.log("Cloudinary:");
    console.log(`  Public ID : ${result.cloudinary.public_id}`);
    console.log(`  URL       : ${result.cloudinary.secure_url}`);
    console.log(`  Type      : ${result.cloudinary.resource_type}`);
    console.log(`  Format    : ${result.cloudinary.format}`);
    console.log(`  Bytes     : ${result.cloudinary.bytes}`);
    console.log(`  Duration  : ${result.cloudinary.duration || "N/A"}`);
    console.log();

    // -------------------------
    // SUPABASE OUTPUT
    // -------------------------
    console.log("Supabase:");
    if (result.supabase && result.supabase.length > 0) {
      const media = result.supabase[0];
      console.log(`  ID        : ${media.id}`);
      console.log(`  URL       : ${media.url}`);
      console.log(`  Type      : ${media.type}`);
      console.log(`  Uploader  : ${media.uploader_id}`);
      console.log(`  Tweet ID  : ${media.tweet_id}`);
      console.log(`  Created   : ${media.created_at}`);
    } else {
      console.log("  No data saved to Supabase.");
    }

    console.log("\n=== End of Summary ===");
  } catch (err) {
    console.error("Test upload failed:", err);
  }
}

testUpload();
