import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = `http://localhost:${process.env.NEXT_PUBLIC_KONG_HTTP_PORT}`;
const supabaseKey: string = `${process.env.NEXT_PUBLIC_ANON_KEY}`;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
