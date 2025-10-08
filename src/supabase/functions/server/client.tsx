import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';


const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export default supabase;
