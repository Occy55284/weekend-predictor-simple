// app-auth.js
// Shared auth + profile helpers for Weekend Predictor (Supabase JS v2)

import { supabase } from './supabase-config.js';

const SESSION_CACHE_KEY = '__WP_SESSION_V1';

export async function requireSession(redirectTo = 'login.html') {
  const session = await getSession();
  if (!session) {
    try { window.location.replace(redirectTo); } catch {}
    throw new Error('No session - redirecting to login');
  }
  return session;
}

export async function getSession() {
  // Simple in-page cache to avoid multiple getSession calls
  if (typeof window !== 'undefined' && window[SESSION_CACHE_KEY]) {
    return window[SESSION_CACHE_KEY];
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (typeof window !== 'undefined') {
    window[SESSION_CACHE_KEY] = session || null;
  }

  return session || null;
}

export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function ensureProfileExists(user) {
  if (!user?.id) return;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[auth] ensureProfileExists select error', error);
      // Don't block the page on this.
      return;
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, display_name: null, is_admin: false });

      if (insertError) {
        console.warn('[auth] ensureProfileExists insert error', insertError);
      }
    }
  } catch (e) {
    console.warn('[auth] ensureProfileExists exception', e);
  }
}

export async function getProfile(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, favorite_team, is_admin, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[auth] getProfile error', error);
      return null;
    }

    return data || null;
  } catch (e) {
    console.warn('[auth] getProfile exception', e);
    return null;
  }
}

export async function getUserAndProfile() {
  const session = await requireSession();
  const user = session.user;
  await ensureProfileExists(user);
  const profile = await getProfile(user.id);
  return { session, user, profile };
}

export function wireLogoutLink(selectorOrEl = '#navLogout', redirectTo = 'login.html') {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;

  el.addEventListener('click', async (e) => {
    e.preventDefault();
    try { await supabase.auth.signOut(); } catch {}
    try { window.location.replace(redirectTo); } catch {}
  });
}

export function applyAdminNav(profile, selectorOrEl = '#navAdmin') {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;

  if (profile?.is_admin) {
    el.style.display = '';
  } else {
    el.style.display = 'none';
  }
}
