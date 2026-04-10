import { HeroesCatalog } from '@/app/components/deadlock/HeroesCatalog'
import { getHeroes } from '@/lib/deadlock-api'

export default async function HeroesPage() {
  const { heroes, error } = await getHeroes()

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Heroes</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Playable heroes from the Deadlock Assets API — role, playstyle, tags, weapon class, and
          complexity.
        </p>
        {!error && (
          <p className="mt-1 text-sm text-zinc-500">
            {heroes.length} hero{heroes.length === 1 ? '' : 'es'} in the current roster (selectable and
            not disabled).
          </p>
        )}
      </header>

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load heroes</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!error && heroes.length === 0 && (
        <p className="text-center text-zinc-500">No heroes returned.</p>
      )}

      {!error && heroes.length > 0 && <HeroesCatalog heroes={heroes} />}
    </div>
  )
}
