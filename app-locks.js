// app-locks.js
// Shared helpers for week-level locking in Weekend Predictor.
// Uses:
//  - global_locks: admin-controlled lock for the whole week (all users)
//  - week_locks: per-user lock once a user has submitted/locked their picks

import { isoDate } from './app-week.js';

/**
 * Returns { locked: boolean, locked_at?: string|null }
 */
export async function getGlobalLock(supabase, week_start) {
  const { data, error } = await supabase
    .from('global_locks')
    .select('locked, locked_at')
    .eq('week_start', week_start)
    .maybeSingle();

  if (error) throw error;
  return { locked: !!(data && data.locked), locked_at: data?.locked_at ?? null };
}

/**
 * Upsert global lock row for a week.
 */
export async function setGlobalLock(supabase, week_start, locked=true) {
  const payload = { week_start, locked: !!locked, locked_at: locked ? new Date().toISOString() : null };
  const { error } = await supabase
    .from('global_locks')
    .upsert(payload, { onConflict: 'week_start' });
  if (error) throw error;
}

/**
 * Returns lock row if user has locked picks for this week, else null.
 */
export async function getUserWeekLock(supabase, user_id, week_start) {
  const { data, error } = await supabase
    .from('week_locks')
    .select('created_at, week_start')
    .eq('user_id', user_id)
    .eq('week_start', week_start)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

/**
 * Create the user lock row (idempotent if unique constraint exists).
 */
export async function createUserWeekLock(supabase, user_id, week_start) {
  // Try upsert first (works if a unique constraint exists on (user_id, week_start))
  let res = await supabase
    .from('week_locks')
    .upsert({ user_id, week_start }, { onConflict: 'user_id,week_start' });

  if (!res.error) return;

  // If the schema doesn't have a matching unique constraint, fall back to insert and ignore duplicates.
  const err = res.error;
  const insertRes = await supabase.from('week_locks').insert({ user_id, week_start });
  if (insertRes.error) {
    // Ignore duplicate key if present
    const msg = String(insertRes.error.message || '');
    if (msg.toLowerCase().includes('duplicate') || msg.includes('23505')) return;
    throw insertRes.error;
  }
}

/**
 * Compute effective lock state for a user in a given week.
 * Global lock OR user lock triggers locked=true.
 */
export async function getEffectiveLock(supabase, { user_id, week_start }) {
  const [g, u] = await Promise.all([
    getGlobalLock(supabase, week_start),
    user_id ? getUserWeekLock(supabase, user_id, week_start) : Promise.resolve(null)
  ]);

  if (g.locked) {
    return { locked: true, reason: 'global', locked_at: g.locked_at };
  }
  if (u) {
    return { locked: true, reason: 'user', locked_at: u.created_at || null };
  }
  return { locked: false, reason: 'none', locked_at: null };
}
