import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Dilemma, ResponseItem, UserProfile, UserVote } from '../types';
import { INITIAL_DILEMMAS, INITIAL_RESPONSES } from './defaultData';

const LOCAL_STORAGE_CUSTOM_URL = 'ai_ethics_custom_supabase_url';
const LOCAL_STORAGE_CUSTOM_ANON = 'ai_ethics_custom_supabase_anon';
const LOCAL_STORAGE_RESPONSES = 'ai_ethics_local_responses';
const LOCAL_STORAGE_LIKES = 'ai_ethics_user_likes';

// Helper to get active Supabase credentials
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const customUrl = localStorage.getItem(LOCAL_STORAGE_CUSTOM_URL);
  const customAnon = localStorage.getItem(LOCAL_STORAGE_CUSTOM_ANON);

  const url = customUrl || envUrl || '';
  const anonKey = customAnon || envAnon || '';

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    !url.includes('your-project-id') &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured, isCustom: Boolean(customUrl && customAnon) };
}

// Create client instance dynamically
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string) {
  if (url && anonKey) {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_URL, url.trim());
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_ANON, anonKey.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_CUSTOM_URL);
    localStorage.removeItem(LOCAL_STORAGE_CUSTOM_ANON);
  }
  supabaseInstance = null; // Reset instance
}

// Fetch dilemmas from Supabase or fallback
export async function fetchDilemmas(): Promise<{ data: Dilemma[]; isFromSupabase: boolean }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('dilemmas')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data: data as Dilemma[], isFromSupabase: true };
      }
      if (error) {
        console.warn('Supabase fetch dilemmas error, using default:', error.message);
      }
    } catch (err) {
      console.warn('Supabase network error, fallback to defaults:', err);
    }
  }
  return { data: INITIAL_DILEMMAS, isFromSupabase: false };
}

// Fetch all responses for statistics & reasons
export async function fetchResponses(): Promise<ResponseItem[]> {
  const client = getSupabaseClient();
  let supabaseResponses: ResponseItem[] = [];

  if (client) {
    try {
      const { data, error } = await client
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        supabaseResponses = data as ResponseItem[];
      }
    } catch (err) {
      console.warn('Supabase fetch responses error:', err);
    }
  }

  // Combine with stored local responses and initial seed data
  const localSaved = getStoredLocalResponses();
  const allMap = new Map<string, ResponseItem>();

  // Baseline
  INITIAL_RESPONSES.forEach((item) => allMap.set(item.id, item));
  // Supabase live
  supabaseResponses.forEach((item) => allMap.set(item.id, item));
  // Local votes made by user in this browser
  localSaved.forEach((item) => allMap.set(item.id, item));

  return Array.from(allMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Save user votes
export async function submitUserResponses(
  profile: UserProfile,
  votes: UserVote[]
): Promise<{ success: boolean; insertedCount: number; isSupabase: boolean; error?: string }> {
  const client = getSupabaseClient();
  const newResponses: ResponseItem[] = votes.map((vote) => ({
    id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    dilemma_id: vote.dilemma_id,
    gender: profile.gender,
    age_group: profile.age_group,
    ai_perception: profile.ai_perception,
    selected_option: vote.selected_option,
    reason: vote.reason ? vote.reason.trim() : null,
    likes_count: 0,
    created_at: new Date().toISOString()
  }));

  // Always save to local storage for local immediate view & offline resilience
  addStoredLocalResponses(newResponses);

  if (client) {
    try {
      const rowsToInsert = votes.map((v) => ({
        dilemma_id: v.dilemma_id,
        gender: profile.gender,
        age_group: profile.age_group,
        ai_perception: profile.ai_perception,
        selected_option: v.selected_option,
        reason: v.reason ? v.reason.trim() : null
      }));

      const { data, error } = await client.from('responses').insert(rowsToInsert).select();
      if (error) {
        console.warn('Supabase insert warning, local backup saved:', error.message);
        return { success: true, insertedCount: newResponses.length, isSupabase: false, error: error.message };
      }
      return { success: true, insertedCount: data ? data.length : newResponses.length, isSupabase: true };
    } catch (e: any) {
      console.warn('Supabase insert exception, local fallback used:', e);
      return { success: true, insertedCount: newResponses.length, isSupabase: false, error: e?.message };
    }
  }

  return { success: true, insertedCount: newResponses.length, isSupabase: false };
}

// Like / Upvote a reason
export async function likeResponse(responseId: string): Promise<boolean> {
  const liked = getLikedResponseIds();
  if (liked.includes(responseId)) return false; // already liked

  saveLikedResponseId(responseId);

  // If local response, increment in local storage
  const localList = getStoredLocalResponses();
  const item = localList.find((r) => r.id === responseId);
  if (item) {
    item.likes_count = (item.likes_count || 0) + 1;
    saveStoredLocalResponses(localList);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      // Fetch current count & increment
      const { data } = await client.from('responses').select('likes_count').eq('id', responseId).single();
      if (data) {
        await client
          .from('responses')
          .update({ likes_count: (data.likes_count || 0) + 1 })
          .eq('id', responseId);
      }
    } catch (e) {
      console.warn('Failed to update like in Supabase:', e);
    }
  }
  return true;
}

// Local Storage helpers
export function getStoredLocalResponses(): ResponseItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESPONSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredLocalResponses(list: ResponseItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_RESPONSES, JSON.stringify(list));
  } catch (e) {
    console.error('Local storage save error:', e);
  }
}

export function addStoredLocalResponses(items: ResponseItem[]) {
  const current = getStoredLocalResponses();
  saveStoredLocalResponses([...items, ...current]);
}

export function getLikedResponseIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLikedResponseId(id: string) {
  const current = getLikedResponseIds();
  if (!current.includes(id)) {
    localStorage.setItem(LOCAL_STORAGE_LIKES, JSON.stringify([...current, id]));
  }
}

// Test Supabase connection
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('dilemmas').select('id').limit(1);
    if (error) {
      return { success: false, message: `연결 실패: ${error.message}` };
    }
    return { success: true, message: 'Supabase 연결 성공! 테이블을 정상적으로 조회했습니다.' };
  } catch (err: any) {
    return { success: false, message: `연결 오류: ${err?.message || '알 수 없는 오류'}` };
  }
}
