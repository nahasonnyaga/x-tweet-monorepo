import { supabase } from "./supabase";

export async function flagContent(contentId: string, action: "flag" | "remove") {
  if (action === "flag") {
    const { error } = await supabase.from("moderationFlags").insert([{ content_id: contentId }]);
    if (error) throw error;
    return { flagged: true };
  } else if (action === "remove") {
    const { error } = await supabase.from("posts").delete().eq("id", contentId);
    if (error) throw error;
    return { removed: true };
  }
  throw new Error("Invalid action");
}
