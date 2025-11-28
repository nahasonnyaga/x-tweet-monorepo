import type { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { username: string }}) {
  const { username } = params;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
