import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Profile Settings</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Update your profile picture and write a short bio.
        </p>
      </header>

      <div className="w-full max-w-2xl">
        <ProfileForm user={user} profile={profile} />
      </div>
    </div>
  )
}
