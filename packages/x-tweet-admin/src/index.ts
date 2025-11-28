// src/index.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Supabase client for admin tasks
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

/**
 * Example function: fetch all users
 */
export async function getAllUsers() {
  const { data, error } = await supabaseAdmin.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data;
}

/**
 * Example function: update a user profile
 */
export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
  return data;
}

/**
 * Add more admin-related functions here
 * - Manage tweets
 * - Moderate content
 * - Analytics fetch
 * - Etc.
 */
