// supabase-config.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---- Public project settings ----
// You can keep these window fallbacks if you prefer setting them elsewhere.
const SUPABASE_URL =
  (typeof window !== 'undefined' && window.SUPABASE_URL) ||
  'https://xxqykjiuowunwdiskhnk.supabase.co'

const SUPABASE_ANON_KEY =
  (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlraml1b3d1bndkaXNraG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjY0MTcsImV4cCI6MjA3MjMwMjQxN30.jdmL2nU07BwoSHxaGavnymhBpxA2HYnPOzNerR_Qa6I'

// ---- Create client (v2) ----
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Expose for non-module usage too
if (typeof window !== 'undefined') {
  window.supabase = supabase
}

// ---- Optional helper: recommended redirect target for magic links ----
export function getEmailRedirectTo() {
  // Send users straight to Make Predictions after login
  return `${window.location.origin}/predict.html`;
}

}

// ---- Debug ping (safe) ----
console.log('[supabase-config] URL:', SUPABASE_URL)
console.log('[supabase-config] Anon key present:', !!SUPABASE_ANON_KEY)



