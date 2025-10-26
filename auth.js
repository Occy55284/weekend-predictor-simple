// auth.js
// Handles session changes and redirects after Supabase magic-link login.

import { supabase } from './supabase-config.js'

// 1) If the user is already logged in when the page loads, go to predict.html
async function bootRedirectIfLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    // Already signed in (return visit / refresh) -> straight to predictions
    window.location.href = '/predict.html'
  }
}

// 2) Listen for auth state changes (this fires after clicking the magic link)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    // Magic link completed -> go to predictions
    window.location.href = '/predict.html'
  }
  if (event === 'SIGNED_OUT') {
    // If you sign out anywhere, send back to login page
    window.location.href = '/login.html'
  }
})

// Run the boot check on every page that includes auth.js
bootRedirectIfLoggedIn()
