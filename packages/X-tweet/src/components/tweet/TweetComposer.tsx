"use client";

import { useState, useRef } from "react";
import { postTweet } from "@lib/postTweet";

export default function TweetComposer({ authorId }: { authorId: string }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    // Limit to 4 files like Twitter
    if (files.length + selected.length > 4) {
      alert("You can only upload up to 4 media files.");
      return;
    }

    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitTweet = async () => {
    if (!content.trim() && files.length === 0) return;

    setLoading(true);

    const res = await postTweet({
      content,
      authorId,
      files,
    });

    setLoading(false);

    if (res.error) {
      alert("Error posting tweet: " + res.error);
      return;
    }

    // Reset composer
    setContent("");
    setFiles([]);

    alert("Tweet posted!");
  };

  return (
    <div className="border-b border-gray-300 p-4 flex gap-3">
      {/* Avatar placeholder */}
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

      <div className="flex-1">
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-lg resize-none outline-none bg-transparent"
          rows={3}
        />

        {/* Media previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((file, index) => (
              <div key={index} className="relative">
                {/* Preview image or video */}
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-32 h-32 rounded-xl"
                  ></video>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            {/* Upload button */}
            <button
              className="text-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              📷
            </button>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
            />
          </div>

          <button
            disabled={loading || (!content.trim() && files.length === 0)}
            onClick={submitTweet}
            className={`px-4 py-2 rounded-full text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600 transition"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
