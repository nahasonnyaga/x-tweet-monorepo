import { supabase } from "./supabase";

export async function addNotification(username: string, type: string, content: string) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ username, type, content, created_at: new Date().toISOString() }]);
  if (error) throw error;
  return data;
}

export async function markAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  if (error) throw error;
  return data;
}
