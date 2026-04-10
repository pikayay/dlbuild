import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SignOutButton from '@/app/components/SignOutButton'

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Deadlock App
        </h1>

        <div className="mt-8">
          {session ? (
            <div className="flex flex-col items-center gap-4">
              <Link href="/deadlock/items" className="text-blue-500 hover:underline">
                Items
              </Link>
              <Link href="/deadlock/builds" className="text-blue-500 hover:underline">
                Builds
              </Link>
              <Link href="/deadlock/heroes" className="text-blue-500 hover:underline">
                Heroes
              </Link>
              <Link href="/profile" className="text-blue-500 hover:underline">
                Profile
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <p>Please sign in to continue.</p>
          )}
        </div>
      </main>
    </div>
  )
}
