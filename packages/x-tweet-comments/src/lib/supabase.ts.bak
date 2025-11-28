import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions for comments
export const addComment = async (tweetId: string, content: string) => {
  const { data, error } = await supabase.from("comments").insert([{ tweetId, content }]);
  if (error) throw error;
  return data;
};

export const getComments = async (tweetId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("tweetId", tweetId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};
