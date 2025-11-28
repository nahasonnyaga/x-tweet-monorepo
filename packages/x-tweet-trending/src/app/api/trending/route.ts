// src/app/api/trending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@lib/supabase"; // directly import supabase

export async function GET(req: NextRequest) {
  try {
    // Fetch top trending hashtags
    const { data, error } = await supabase
      .from("hashtags")
      .select("tag, tweet_ids")
      .order("tweet_ids", { ascending: false }) // Sort by number of tweets
      .limit(20);

    if (error) {
      console.error("Supabase error fetching trending:", error);
      return NextResponse.json(
        { error: "Failed to fetch trending topics" },
        { status: 500 }
      );
    }

    // Map results to frontend-friendly format
    const trending = data.map((item: any) => ({
      name: item.tag,
      tweets: item.tweet_ids?.length || 0,
    }));

    return NextResponse.json(trending);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error fetching trending topics" },
      { status: 500 }
    );
  }
}
