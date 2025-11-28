import { runAI } from '@lib/openai';
import { supabase } from '@lib/supabase';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { feature } = await req.json();
    if (!feature) {
      return NextResponse.json({ error: 'Feature is required' }, { status: 400 });
    }

    const result = await runAI(feature);

    // Store result in Supabase
    await supabase.from('ai_results').insert([{ feature, result }]);

    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
