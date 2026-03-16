import { createClient } from '@supabase/supabase-js';

// Sem vlož to tvoje Project URL (začíná na https://...)
const supabaseUrl = 'https://wjtfickmmmbnrerepbtl.supabase.co';

// Sem vlož ten dlouhý anon public klíč (začíná na eyJ...)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdGZpY2ttbW1ibnJlcmVwYnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDY3NDgsImV4cCI6MjA4ODcyMjc0OH0.Z43PF_5NdBgtHk01qfQcIRyauTM2Q8K99srh_kEh5b8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);