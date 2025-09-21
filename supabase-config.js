// ---- Supabase client config (public) ----
// Project URL from Supabase
window.SUPABASE_URL = 'https://xxqykjiuowunwdiskhnk.supabase.co';

// Public anon key from Supabase (OK to use in browser; RLS protects data)
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlraml1b3d1bndkaXNraG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjY0MTcsImV4cCI6MjA3MjMwMjQxN30.jdmL2nU07BwoSHxaGavnymhBpxA2HYnPOzNerR_Qa6I';

// Simple sanity ping for debugging (safe to leave in)
console.log('[supabase-config] URL:', window.SUPABASE_URL);
console.log('[supabase-config] ANON key present:', !!window.SUPABASE_ANON_KEY);


