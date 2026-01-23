import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mnqeqwxhjluznibmrgqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucWVxd3hoamx1em5pYm1yZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTcyMDksImV4cCI6MjA4NDY5MzIwOX0.KE0ukjog0rNSc4sw7_iKOGa76MmWOpng-avUDT9aQXI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
