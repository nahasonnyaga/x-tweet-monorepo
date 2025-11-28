import type { NextRequest } from "next/server";
import { supabase } from "@lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { tweetId: string } }) {
  const { tweetId } = params;
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("tweetId", tweetId)
    .order("created_at", { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), { status: 200 });
}
