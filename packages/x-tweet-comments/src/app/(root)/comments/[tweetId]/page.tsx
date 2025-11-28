"use client";

import { useState, useEffect } from "react";
import { addComment, getComments } from "@lib/supabase";

interface Comment {
  id: string;
  tweetId: string;
  content: string;
  created_at: string;
}

export default function CommentsPage({ params }: { params: { tweetId: string } }) {
  const { tweetId } = params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const data = await getComments(tweetId);
    setComments(data || []);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(tweetId, newComment);
    setNewComment("");
    fetchComments();
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.content} - <i>{new Date(c.created_at).toLocaleString()}</i></li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Submit</button>
    </div>
  );
}
