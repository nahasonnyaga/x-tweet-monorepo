// packages/X-tweet/src/lib/media.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();

  try {
    switch (action) {
      case 'ping':
        return success({ service: 'media' });

      case 'uploadUrlToStorage': {
        const { url, bucket = 'public', pathPrefix = 'uploads' } = params;
        if (!url) return fail('url required');
        // fetch content
        const res = await fetch(url);
        if (!res.ok) return fail('Failed to fetch url');
        const buffer = await res.buffer();
        const ext = (url.split('.').pop() || 'bin').split('?')[0];
        const filename = `${pathPrefix}/${uuidv4()}.${ext}`;
        // store
        const { data, error } = await supabase.storage.from(bucket).upload(filename, buffer, { upsert: false });
        if (error) return fail(error.message);
        // get public url
        const { publicURL } = supabase.storage.from(bucket).getPublicUrl(filename);
        // insert into media table
        const { data: md, error: mdErr } = await supabase.from('media').insert([{ id: uuidv4(), url: publicURL, storage_path: filename }]).select().single();
        if (mdErr) return fail(mdErr.message);
        return success(md);
      }

      case 'insertMediaRecord': {
        const { url, storage_path, meta = {} } = params;
        if (!url) return fail('url required');
        const { data, error } = await supabase.from('media').insert([{ id: uuidv4(), url, storage_path, meta }]).select().single();
        if (error) return fail(error.message);
        return success(data);
      }

      default:
        return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
