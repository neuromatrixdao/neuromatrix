import { createClient } from '@supabase/supabase-js'
import { PostgrestError } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface GlobalCounter {
  id: string
  attempts: number
  updated_at: string
}

export interface Task {
  id: string
  content: string
  created_at: string
}

export async function incrementGlobalCounter(): Promise<{ data: GlobalCounter | null; error: PostgrestError | null }> {
  const { data: counter, error: fetchError } = await supabase
    .from('global_counter')
    .select()
    .single()

  if (fetchError) {
    return { data: null, error: fetchError }
  }

  const { data, error } = await supabase
    .from('global_counter')
    .update({ attempts: (counter?.attempts || 0) + 1 })
    .eq('id', counter.id)
    .select()
    .single()

  return { data, error }
}

export async function getLatestTask(): Promise<{ data: Task | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('tasks')
    .select()
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}

export async function getGlobalCounter(): Promise<{ data: GlobalCounter | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('global_counter')
    .select()
    .single()

  return { data, error }
} 