import { createClient } from '@supabase/supabase-js';

const domain: string = process.env.NODE_ENV === 'production' ? 'host.docker.internal' : 'localhost';
const supabaseUrl: string = `http://${domain}:${process.env.NEXT_PUBLIC_KONG_HTTP_PORT}`;
const supabaseKey: string = `${process.env.NEXT_PUBLIC_ANON_KEY}`;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
