import { ItemsCatalog } from '@/app/components/deadlock/ItemsCatalog'
import { getItems } from '@/lib/deadlock-api'

export default async function ItemsPage() {
  const { items, error } = await getItems()

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Items</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Shop items from the Deadlock Assets API, grouped by slot (Spirit, Weapon, Vitality) and
          price tier. Use the headers to collapse or expand each section.
        </p>
        {!error && (
          <p className="mt-1 text-sm text-zinc-500">
            {items.length} item{items.length === 1 ? '' : 's'} loaded.
          </p>
        )}
      </header>

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load items</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!error && items.length === 0 && (
        <p className="text-center text-zinc-500">No items returned.</p>
      )}

      {!error && items.length > 0 && <ItemsCatalog items={items} />}
    </div>
  )
}
