/* supabase-config.js — UMD-compatible, no imports/exports */
;(function () {
  // Your actual project values:
  const SUPABASE_URL = 'https://xxqykjiuowunwdiskhnk.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlraml1b3d1bndkaXNraG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjY0MTcsImV4cCI6MjA3MjMwMjQxN30.jdmL2nU07BwoSHxaGavnymhBpxA2HYnPOzNerR_Qa6I';

  // Ensure the UMD library is loaded
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[supabase-config] Supabase UMD library not loaded before config.');
    return;
  }

  // Create a client instance
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Expose the client as window.supabase so all pages can use it
  window.supabase = client;

  // Optional helper for redirect URL
  window.getEmailRedirectTo = function () {
    return `${window.location.origin}/predict.html`;
  };

  // Debug (you can remove this later)
  console.log('[supabase-config] client ready:', typeof window.supabase.auth?.signInWithOtp === 'function');
})();
