import { BuildCreator } from '@/app/components/deadlock/BuildCreator'
import { getItems, getHeroes } from '@/lib/deadlock-api'
import Link from 'next/link'

export const metadata = {
  title: 'Create Build - Deadlock',
}

export default async function NewBuildPage() {
  const [{ items, error: itemsError }, { heroes, error: heroesError }] = await Promise.all([getItems(), getHeroes()])
  const error = itemsError || heroesError

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="mb-4">
        <Link
          href="/deadlock/builds"
          className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          &larr; Back to Builds
        </Link>
      </div>

      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Create Build</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Click on a section in your build to activate it, then click on items in the catalog to add them to that section.
        </p>
      </header>

      {error ? (
        <div
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load items or heroes</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-zinc-500">No items returned.</p>
      ) : (
        <BuildCreator items={items} heroes={heroes} />
      )}
    </div>
  )
}
