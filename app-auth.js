// app-auth.js
// Shared auth + profile helpers for Weekend Predictor (Supabase JS v2)

import { supabase } from './supabase-config.js';

const SESSION_CACHE_KEY = '__WP_SESSION_V1';

export async function getSession() {
  // Light cache to reduce repeated auth calls per page load
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.access_token) return parsed;
    }
  } catch {}

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const session = data?.session || null;
  try {
    if (session) sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {}
  return session;
}

export async function requireSession(redirectTo = 'login.html') {
  const session = await getSession();
  if (!session) {
    try { window.location.replace(redirectTo); } catch {}
    throw new Error('No session - redirecting to login');
  }
  return session;
}

export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function requireProfile(redirectTo = 'login.html') {
  const session = await requireSession(redirectTo);
  const profile = await getProfile(session.user.id);
  return { session, profile };
}

export function applyAdminNav(profile, selectorOrEl = '#navAdmin') {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;
  el.style.display = profile?.is_admin ? '' : 'none';
}

export function wireLogout(selectorOrEl = '#navLogout', redirectTo = 'login.html') {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;

  el.addEventListener('click', async (e) => {
    e.preventDefault();
    try { await supabase.auth.signOut(); } catch {}
    try { sessionStorage.removeItem(SESSION_CACHE_KEY); } catch {}
    window.location.replace(redirectTo);
  });
}
