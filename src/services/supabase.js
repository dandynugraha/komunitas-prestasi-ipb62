import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ─── Profile ─────────────────────────────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export const getAchievements = async ({ limit, cluster } = {}) => {
  let query = supabase
    .from('achievements')
    .select('*, profiles(name, avatar_url, cluster)')
    .order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)
  if (cluster) query = query.eq('cluster', cluster)
  return query
}

export const createAchievement = async (data) => {
  return supabase.from('achievements').insert(data).select().single()
}

export const getAchievementStats = async () => {
  return supabase.from('achievements').select('cluster, level')
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export const getProjects = async () => {
  return supabase
    .from('projects')
    .select('*, project_members(profiles(name, avatar_url)), project_timelines(*)')
    .order('created_at', { ascending: false })
}

export const createProject = async (data) => {
  return supabase.from('projects').insert(data).select().single()
}

// ─── Events ──────────────────────────────────────────────────────────────────
export const getEvents = async ({ visibility, cluster } = {}) => {
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (visibility) query = query.eq('visibility', visibility)
  if (cluster) query = query.eq('cluster', cluster)
  return query
}

export const createEvent = async (data) => {
  return supabase.from('events').insert(data).select().single()
}

// ─── Competitions ─────────────────────────────────────────────────────────────
export const getCompetitions = async (userId) => {
  return supabase
    .from('competitions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
}

export const createCompetition = async (data) => {
  return supabase.from('competitions').insert(data).select().single()
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getLeaderboard = async ({ cluster, month } = {}) => {
  let query = supabase
    .from('profiles')
    .select('id, name, avatar_url, cluster, points, division')
    .order('points', { ascending: false })
    .limit(20)
  if (cluster) query = query.eq('cluster', cluster)
  return query
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export const getAttendance = async ({ userId, eventId } = {}) => {
  let query = supabase.from('attendance').select('*, events(title, event_date), profiles(name)')
  if (userId) query = query.eq('user_id', userId)
  if (eventId) query = query.eq('event_id', eventId)
  return query
}

export const markAttendance = async (data) => {
  return supabase.from('attendance').upsert(data).select().single()
}

// ─── Storage ──────────────────────────────────────────────────────────────────
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (error) return { url: null, error }
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: publicUrl, error: null }
}

// ─── Site Content (CMS for Web Dev) ──────────────────────────────────────────
export const getSiteContent = async (key) => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('key', key)
    .single()
  return { data, error }
}

export const setSiteContent = async (key, value, type = 'text') => {
  return supabase
    .from('site_content')
    .upsert({ key, value, type })
    .select()
    .single()
}

export const getAllSiteContent = async () => {
  return supabase.from('site_content').select('*').order('key')
}

// ─── Staff Awarding ───────────────────────────────────────────────────────────
export const getStaffAwards = async () => {
  return supabase
    .from('staff_awards')
    .select('*, profiles(name, avatar_url, cluster)')
    .order('month', { ascending: false })
    .limit(12)
}

// ─── Members ─────────────────────────────────────────────────────────────────
export const getMembers = async ({ cluster, division } = {}) => {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'member')
    .order('name')
  if (cluster) query = query.eq('cluster', cluster)
  if (division) query = query.eq('division', division)
  return query
}

// ─── Plans / Calendar ─────────────────────────────────────────────────────────
export const getPlans = async (userId) => {
  return supabase
    .from('plans')
    .select('*')
    .eq('user_id', userId)
    .order('plan_date', { ascending: true })
}

export const createPlan = async (data) => {
  return supabase.from('plans').insert(data).select().single()
}

export const deletePlan = async (id) => {
  return supabase.from('plans').delete().eq('id', id)
}
