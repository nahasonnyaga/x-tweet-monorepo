import type { NextRequest, NextResponse } from "next/server";
import { supabase } from "@lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { paymentId: string } }) {
  const { paymentId } = params;

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
