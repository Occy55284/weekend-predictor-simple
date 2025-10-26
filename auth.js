// auth.js
// Centralised auth behaviour for the whole site.
// - If a user is already logged in on landing/login, send them to predict.html
// - After a magic-link sign-in completes, send them to predict.html
// - On sign-out, send them to login.html

import { supabase } from './supabase-config.js'

function onLandingOrLogin() {
  const path = location.pathname
  return (
    path.endsWith('/index.html') ||
    path === '/' ||
    path.endsWith('/login.html')
  )
}

async function bootRedirectIfLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session && onLandingOrLogin()) {
    // Returning user: skip landing/login
    window.location.href = 'predict.html'
  }
}

// Fires when magic link completes, or any sign-in occurs anywhere
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    window.location.href = 'predict.html'
  }
  if (event === 'SIGNED_OUT') {
    window.location.href = 'login.html'
  }
})

// Run once wherever this file is included
bootRedirectIfLoggedIn()

