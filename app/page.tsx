import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SignOutButton from '@/app/components/SignOutButton'
import Image from 'next/image'
import titleBg from './title-screen.jpg'

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={titleBg}
          alt="Deadlock Title Screen"
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-zinc-50 tracking-tight drop-shadow-2xl">
            Deadlock App
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-300 drop-shadow-md">
            A data-driven build-crafting companion for analyzing items, heroes, and community builds.
          </p>
        </div>

        <div className="mt-12 bg-zinc-900/60 p-8 rounded-2xl backdrop-blur-xl border border-zinc-700/50 shadow-2xl max-w-sm w-full">
          {session ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <h2 className="text-2xl text-zinc-100 font-semibold mb-4">Welcome Back</h2>
              <Link href="/deadlock/heroes" className="w-full text-center px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm">
                Heroes
              </Link>
              <Link href="/deadlock/items" className="w-full text-center px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm">
                Items
              </Link>
              <Link href="/deadlock/builds" className="w-full text-center px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm">
                Builds
              </Link>
              <Link href="/deadlock/minimap" className="w-full text-center px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm">
                Minimap
              </Link>
              <Link href="/profile" className="w-full text-center px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm">
                Profile
              </Link>
              <div className="w-full mt-4 pt-4 border-t border-zinc-800/80">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-zinc-300 text-lg">Please sign in to continue.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
