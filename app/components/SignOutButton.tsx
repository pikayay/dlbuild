'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button onClick={handleSignOut} className="w-full px-4 py-3 bg-red-900/50 hover:bg-red-800/80 text-red-100 font-medium rounded-xl transition-all border border-red-800/50 shadow-sm">
      Sign Out
    </button>
  )
}
