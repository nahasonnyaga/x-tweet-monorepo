import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) return NextResponse.json([]);

  const { data: tweets } = await supabase
    .from('tweets')
    .select('*')
    .ilike('text', `%${q}%`)
    .limit(10);

  const { data: users } = await supabase
    .from('profiles')
    .select('username, name, avatar')
    .ilike('username', `%${q}%`)
    .limit(5);

  return NextResponse.json({ tweets, users });
}
