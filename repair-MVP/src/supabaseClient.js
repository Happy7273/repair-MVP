import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rorozpccmflnohpiwhzo.supabase.co'; // <-- HIER deine Project URL einfügen!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcm96cGNjbWZsbm9ocGl3aHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTI5MTgsImV4cCI6MjA2NTAyODkxOH0.bh_lu5PPeX3kRQUlv3iPF-B8Qy65ACFYzv_fA1dlwgI'; // <-- HIER deinen anon public key einfügen!

export const supabase = createClient(supabaseUrl, supabaseKey);