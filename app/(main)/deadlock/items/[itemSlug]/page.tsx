import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getShopItemBySlug,
  getItemImageUrl,
  getUpgradeDescriptionBlocks,
} from '@/lib/deadlock-api'
import { resolveSlotTheme, type SlotTheme } from '@/lib/deadlock-item-groups'
import { itemDetailHref } from '@/lib/deadlock-item-slug'

type PageProps = {
  params: Promise<{ itemSlug: string }>
}

const bannerGradient: Record<SlotTheme, string> = {
  spirit:
    'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 text-white shadow-lg shadow-violet-900/25',
  weapon:
    'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 text-white shadow-lg shadow-amber-900/25',
  vitality:
    'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white shadow-lg shadow-emerald-900/25',
  default:
    'bg-gradient-to-br from-zinc-600 to-zinc-800 text-white shadow-lg shadow-black/20',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { itemSlug } = await params
  const { item } = await getShopItemBySlug(itemSlug)
  if (!item) {
    return { title: 'Item | Deadlock' }
  }
  return {
    title: `${item.name} | Deadlock`,
    description: `Shop item — ${item.item_slot_type} slot, ${item.cost?.toLocaleString() ?? '?'} souls.`,
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { itemSlug } = await params
  const { item, error } = await getShopItemBySlug(itemSlug)

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load item</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
        <p className="mt-6">
          <Link href="/deadlock/items" className="text-violet-600 underline hover:text-violet-500 dark:text-violet-400">
            ← Back to items
          </Link>
        </p>
      </div>
    )
  }

  if (!item) {
    notFound()
  }

  const theme = resolveSlotTheme(item.item_slot_type)
  const img = getItemImageUrl(item)
  const descriptionBlocks = getUpgradeDescriptionBlocks(item)

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="mb-6 text-sm">
        <Link
          href="/deadlock/items"
          className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          ← Items
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600 dark:text-zinc-400">{item.name}</span>
      </nav>

      <header
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 ${bannerGradient[theme]}`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white/15 p-2 ring-2 ring-white/30 sm:mx-0 sm:h-32 sm:w-32">
            {img ? (
              <Image
                src={img}
                alt=""
                fill
                className="object-contain p-1"
                sizes="128px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/70">
                No art
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.name}</h1>
            <p className="mt-2 font-mono text-sm text-white/80">{item.class_name}</p>
            <dl className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-sm">
                <dt className="sr-only">Slot</dt>
                <dd className="capitalize">{item.item_slot_type}</dd>
              </div>
              <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-sm">
                <dt className="sr-only">Tier</dt>
                <dd>{item.item_tier}</dd>
              </div>
              {item.cost != null && (
                <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-sm">
                  <dt className="sr-only">Cost</dt>
                  <dd>{item.cost.toLocaleString()} souls</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </header>

      {descriptionBlocks.length > 0 && (
        <section className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Details</h2>
          {descriptionBlocks.map((block, i) => (
            <div key={`${block.label}-${i}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {block.label}
              </h3>
              <p className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {block.text}
              </p>
            </div>
          ))}
        </section>
      )}

      <p className="mt-8 text-center text-sm text-zinc-500 sm:text-left">
        <span className="mr-2">Share:</span>
        <code className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          {itemDetailHref(item.name)}
        </code>
      </p>
    </div>
  )
}
