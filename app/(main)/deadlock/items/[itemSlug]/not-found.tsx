import Link from 'next/link'

export default function ItemNotFound() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Item not found</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        No shop item matches this URL. Check the name slug or browse the catalog.
      </p>
      <p className="mt-6">
        <Link
          href="/deadlock/items"
          className="text-violet-600 underline hover:text-violet-500 dark:text-violet-400"
        >
          ← Back to items
        </Link>
      </p>
    </div>
  )
}
