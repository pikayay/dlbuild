'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { UpgradeItemV2 } from '@/lib/deadlock-api'

export async function createBuild(data: {
  hero_id: number;
  name: string;
  description: string;
  items: Record<string, UpgradeItemV2[]>;
  published: boolean;
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data: build, error } = await supabase
    .from('builds')
    .insert({
      user_id: user.id,
      hero_id: data.hero_id,
      name: data.name,
      description: data.description,
      items: data.items,
      published: data.published,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating build:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlock/builds')
  return { build }
}

export async function fetchBuilds() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching builds:', error)
    return []
  }

  return data
}