import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchPayments() {
  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
