import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dqbhginmdwkvckyyzlkv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_K6Eh9iJPx4NvCUEj4VUMVw_KFQgFHwC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
