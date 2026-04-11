'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { UpgradeItemV2, HeroV2, getItemImageUrl, getItemDescriptionSnippet } from '@/lib/deadlock-api'
import { createBuild } from '@/app/(main)/deadlock/builds/actions'
import {
  buildSlotCostCatalog,
  resolveSlotTheme,
  type SlotTheme,
} from '@/lib/deadlock-item-groups'

const BUILD_SECTIONS = [
  { id: 'lane', name: 'Lane', description: 'Order is flexible depending on needs.' },
  { id: 'lane-optional', name: 'Lane Optional', description: 'Generally a good idea to get at least one.' },
  { id: 'mid', name: 'Postlane/Mid Game', description: 'General game plan for mid game.' },
  { id: 'late', name: 'Late', description: 'Finish your build with counter items.' },
  { id: 'situational', name: 'Situational', description: 'Everything annotated.' },
]

const themeColors: Record<SlotTheme, string> = {
  spirit: 'border-violet-500/80 bg-violet-900/40 text-violet-100',
  weapon: 'border-amber-500/80 bg-amber-900/40 text-amber-100',
  vitality: 'border-emerald-500/80 bg-emerald-900/40 text-emerald-100',
  default: 'border-zinc-500/80 bg-zinc-900/40 text-zinc-100',
}

const themeBorders: Record<SlotTheme, string> = {
  spirit: 'border-violet-500/80',
  weapon: 'border-amber-500/80',
  vitality: 'border-emerald-500/80',
  default: 'border-zinc-500/80',
}

function formatSouls(n: number): string {
  return `${n.toLocaleString()} souls`
}

/** Outer ring + panel for each main slot (Spirit / Weapon / Vitality). */
const slotPanelClass: Record<SlotTheme, string> = {
  spirit:
    'border-violet-300/90 bg-gradient-to-b from-violet-50/90 to-white shadow-md shadow-violet-900/10 ring-1 ring-violet-200/80 dark:border-violet-800 dark:from-violet-950/50 dark:to-zinc-950 dark:shadow-violet-950/30 dark:ring-violet-800/60',
  weapon:
    'border-amber-300/90 bg-gradient-to-b from-amber-50/90 to-white shadow-md shadow-amber-900/10 ring-1 ring-amber-200/80 dark:border-amber-800 dark:from-amber-950/45 dark:to-zinc-950 dark:shadow-amber-950/30 dark:ring-amber-800/60',
  vitality:
    'border-emerald-300/90 bg-gradient-to-b from-emerald-50/90 to-white shadow-md shadow-emerald-900/10 ring-1 ring-emerald-200/80 dark:border-emerald-800 dark:from-emerald-950/45 dark:to-zinc-950 dark:shadow-emerald-950/30 dark:ring-emerald-800/60',
  default:
    'border-zinc-200 bg-zinc-50/80 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:ring-1 dark:ring-zinc-700',
}

const slotHeaderClass: Record<SlotTheme, string> = {
  spirit:
    'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-inner shadow-violet-900/20',
  weapon:
    'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-inner shadow-amber-900/20',
  vitality:
    'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-inner shadow-emerald-900/20',
  default: 'bg-gradient-to-r from-zinc-600 to-zinc-700 text-white',
}

const slotContentClass: Record<SlotTheme, string> = {
  spirit: 'border-violet-200/70 bg-violet-50/40 dark:border-violet-800/50 dark:bg-violet-950/25',
  weapon: 'border-amber-200/70 bg-amber-50/40 dark:border-amber-800/50 dark:bg-amber-950/25',
  vitality: 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-800/50 dark:bg-emerald-950/25',
  default: 'border-zinc-200 bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-900/40',
}

type CostStyle = {
  panel: string
  header: string
  chevron: string
  count: string
  content: string
}

function costTierStyle(theme: SlotTheme, cost: number): CostStyle {
  if (cost === 9999) {
    return {
      panel:
        'border-2 border-white shadow-lg shadow-black/15 ring-2 ring-white/90 dark:ring-white/40',
      header:
        'bg-white text-zinc-900 shadow-sm dark:bg-zinc-100 dark:text-zinc-950',
      chevron: 'text-zinc-600 dark:text-zinc-700',
      count: 'text-zinc-600 dark:text-zinc-700',
      content: 'border-zinc-200/80 bg-zinc-50 dark:border-zinc-300/40 dark:bg-zinc-900/80',
    }
  }

  const byTheme: Record<Exclude<SlotTheme, 'default'>, Record<number, CostStyle>> = {
    spirit: {
      800: {
        panel: 'border-violet-200/90 dark:border-violet-800/60',
        header:
          'bg-violet-100 text-violet-950 dark:bg-violet-950/35 dark:text-violet-100',
        chevron: 'text-violet-600 dark:text-violet-400',
        count: 'text-violet-800/90 dark:text-violet-300/90',
        content: 'border-violet-200/60 bg-violet-50/60 dark:border-violet-800/40 dark:bg-violet-950/20',
      },
      1600: {
        panel: 'border-violet-300/80 dark:border-violet-700/50',
        header:
          'bg-violet-200 text-violet-950 dark:bg-violet-900/50 dark:text-violet-50',
        chevron: 'text-violet-700 dark:text-violet-300',
        count: 'text-violet-900 dark:text-violet-200',
        content: 'border-violet-300/50 bg-violet-100/70 dark:border-violet-800/45 dark:bg-violet-950/35',
      },
      3200: {
        panel: 'border-violet-400/70 dark:border-violet-600/45',
        header:
          'bg-violet-400 text-violet-950 dark:bg-violet-800/70 dark:text-violet-50',
        chevron: 'text-violet-900 dark:text-violet-200',
        count: 'text-violet-950 dark:text-violet-100',
        content: 'border-violet-400/45 bg-violet-200/50 dark:border-violet-700/40 dark:bg-violet-950/45',
      },
      6400: {
        panel: 'border-violet-700/80 dark:border-violet-500/35',
        header:
          'bg-violet-700 text-white dark:bg-violet-950 dark:text-violet-100',
        chevron: 'text-violet-200 dark:text-violet-300',
        count: 'text-violet-100 dark:text-violet-300',
        content: 'border-violet-600/50 bg-violet-300/40 dark:border-violet-800/60 dark:bg-violet-950/55',
      },
    },
    weapon: {
      800: {
        panel: 'border-amber-200/90 dark:border-amber-800/60',
        header:
          'bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100',
        chevron: 'text-amber-600 dark:text-amber-400',
        count: 'text-amber-900/90 dark:text-amber-300/90',
        content: 'border-amber-200/60 bg-amber-50/70 dark:border-amber-800/40 dark:bg-amber-950/20',
      },
      1600: {
        panel: 'border-amber-300/80 dark:border-amber-700/50',
        header:
          'bg-amber-200 text-amber-950 dark:bg-amber-900/55 dark:text-amber-50',
        chevron: 'text-amber-800 dark:text-amber-300',
        count: 'text-amber-950 dark:text-amber-200',
        content: 'border-amber-300/50 bg-amber-100/80 dark:border-amber-800/45 dark:bg-amber-950/35',
      },
      3200: {
        panel: 'border-amber-400/70 dark:border-orange-700/45',
        header:
          'bg-amber-400 text-amber-950 dark:bg-orange-900/65 dark:text-amber-50',
        chevron: 'text-amber-950 dark:text-amber-200',
        count: 'text-amber-950 dark:text-amber-100',
        content: 'border-amber-500/40 bg-amber-200/55 dark:border-orange-800/40 dark:bg-amber-950/45',
      },
      6400: {
        panel: 'border-orange-700/85 dark:border-orange-500/35',
        header:
          'bg-orange-700 text-white dark:bg-orange-950 dark:text-orange-50',
        chevron: 'text-orange-100 dark:text-orange-300',
        count: 'text-orange-100 dark:text-orange-200',
        content: 'border-orange-600/50 bg-amber-300/45 dark:border-orange-900/55 dark:bg-amber-950/55',
      },
    },
    vitality: {
      800: {
        panel: 'border-emerald-200/90 dark:border-emerald-800/60',
        header:
          'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/35 dark:text-emerald-100',
        chevron: 'text-emerald-600 dark:text-emerald-400',
        count: 'text-emerald-900/90 dark:text-emerald-300/90',
        content: 'border-emerald-200/60 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20',
      },
      1600: {
        panel: 'border-emerald-300/80 dark:border-emerald-700/50',
        header:
          'bg-emerald-200 text-emerald-950 dark:bg-emerald-900/50 dark:text-emerald-50',
        chevron: 'text-emerald-800 dark:text-emerald-300',
        count: 'text-emerald-950 dark:text-emerald-200',
        content: 'border-emerald-300/50 bg-emerald-100/70 dark:border-emerald-800/45 dark:bg-emerald-950/35',
      },
      3200: {
        panel: 'border-emerald-500/65 dark:border-emerald-600/45',
        header:
          'bg-emerald-400 text-emerald-950 dark:bg-emerald-800/65 dark:text-emerald-50',
        chevron: 'text-emerald-950 dark:text-emerald-200',
        count: 'text-emerald-950 dark:text-emerald-100',
        content: 'border-emerald-400/45 bg-emerald-200/50 dark:border-emerald-700/40 dark:bg-emerald-950/45',
      },
      6400: {
        panel: 'border-emerald-700/85 dark:border-emerald-500/35',
        header:
          'bg-emerald-700 text-white dark:bg-emerald-950 dark:text-emerald-100',
        chevron: 'text-emerald-100 dark:text-emerald-300',
        count: 'text-emerald-100 dark:text-emerald-200',
        content: 'border-emerald-600/50 bg-emerald-300/40 dark:border-emerald-800/60 dark:bg-emerald-950/55',
      },
    },
  }

  if (theme === 'default') {
    return {
      800: {
        panel: 'border-zinc-200 dark:border-zinc-600',
        header: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        chevron: 'text-zinc-500',
        count: 'text-zinc-600 dark:text-zinc-400',
        content: 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50',
      },
      1600: {
        panel: 'border-zinc-300 dark:border-zinc-600',
        header: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        chevron: 'text-zinc-600',
        count: 'text-zinc-700 dark:text-zinc-300',
        content: 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/60',
      },
      3200: {
        panel: 'border-zinc-400 dark:border-zinc-500',
        header: 'bg-zinc-400 text-zinc-950 dark:bg-zinc-700 dark:text-zinc-100',
        chevron: 'text-zinc-800 dark:text-zinc-200',
        count: 'text-zinc-900 dark:text-zinc-200',
        content: 'border-zinc-400 bg-zinc-200/80 dark:border-zinc-600 dark:bg-zinc-900/70',
      },
      6400: {
        panel: 'border-zinc-600 dark:border-zinc-500',
        header: 'bg-zinc-700 text-white dark:bg-zinc-950 dark:text-zinc-100',
        chevron: 'text-zinc-200',
        count: 'text-zinc-200 dark:text-zinc-300',
        content: 'border-zinc-500 bg-zinc-300/50 dark:border-zinc-800 dark:bg-zinc-950/80',
      },
    }[cost as 800 | 1600 | 3200 | 6400] ?? {
      panel: 'border-zinc-300 dark:border-zinc-600',
      header: 'bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
      chevron: 'text-zinc-600',
      count: 'text-zinc-700 dark:text-zinc-300',
      content: 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50',
    }
  }

  const ramp = byTheme[theme]
  return (
    ramp[cost as keyof typeof ramp] ?? {
      panel: 'border-zinc-200 dark:border-zinc-600',
      header: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
      chevron: 'text-zinc-500',
      count: 'text-zinc-600 dark:text-zinc-400',
      content: 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50',
    }
  )
}

type CollapsibleSectionProps = {
  title: React.ReactNode
  countLabel: string
  defaultOpen?: boolean
  /** Slot-level vs cost-level section */
  level: 'slot' | 'cost'
  slotTheme: SlotTheme
  cost?: number
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  countLabel,
  defaultOpen = true,
  level,
  slotTheme,
  cost,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const costStyle = level === 'cost' ? costTierStyle(slotTheme, cost ?? 0) : null

  const containerClass =
    level === 'slot'
      ? `rounded-xl border-2 ${slotPanelClass[slotTheme]}`
      : `rounded-lg border ${costStyle!.panel}`

  const headerClass =
    level === 'slot' ? slotHeaderClass[slotTheme] : costStyle!.header

  const chevronClass =
    level === 'slot'
      ? 'text-white/90'
      : costStyle!.chevron

  const countClass =
    level === 'slot' ? 'text-white/85' : costStyle!.count

  const contentBorderClass =
    level === 'slot' ? slotContentClass[slotTheme] : costStyle!.content

  return (
    <div className={containerClass}>
      <motion.button
        type="button"
        className={`flex w-full items-center gap-2 px-4 py-3.5 text-left ${headerClass}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        whileTap={{ scale: 0.995 }}
      >
        <span
          className={`inline-block w-4 shrink-0 text-center text-sm transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          } ${chevronClass}`}
          aria-hidden
        >
          ▶
        </span>
        <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight">{title}</span>
        <span className={`shrink-0 text-sm font-medium ${countClass}`}>{countLabel}</span>
      </motion.button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t px-3 pb-3 pt-3 sm:px-4 ${contentBorderClass}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemMiniCard({ item, onClick, onRemove }: { item: UpgradeItemV2; onClick?: () => void; onRemove?: () => void }) {
  const img = getItemImageUrl(item)
  const theme = resolveSlotTheme(item.item_slot_type)

  return (
    <div
      onClick={onClick}
      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 bg-zinc-800/80 p-1 transition-all hover:scale-105 hover:brightness-110 ${themeBorders[theme]} w-16 h-20 sm:w-20 sm:h-24`}
      title={item.name}
    >
      <div className="relative h-10 w-10 sm:h-12 sm:w-12">
        {img ? (
          <Image src={img} alt={item.name} fill className="object-contain drop-shadow-md" sizes="48px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">No art</div>
        )}
      </div>
      <div className={`mt-1 w-full truncate text-center text-[9px] sm:text-[10px] font-medium leading-tight text-white px-0.5`}>
        {item.name}
      </div>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md transition-all hover:bg-red-400 group-hover:flex"
        >
          &times;
        </button>
      )}
    </div>
  )
}

function SelectableItemCard({ item, onClick }: { item: UpgradeItemV2; onClick: () => void }) {
  const img = getItemImageUrl(item)
  const snippet = getItemDescriptionSnippet(item)
  const theme = resolveSlotTheme(item.item_slot_type)

  return (
    <li className="flex gap-4 rounded-lg border border-zinc-200/90 bg-white/95 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-zinc-600/80 dark:bg-zinc-950/70">
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 gap-4 p-4 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-violet-500 dark:ring-offset-zinc-950"
      >
        <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${themeColors[theme]}`}>
          {img ? (
            <Image
              src={img}
              alt=""
              fill
              className="object-contain p-1"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
              No art
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {item.name}
          </h3>
          <p className="truncate font-mono text-xs text-zinc-500">{item.class_name}</p>
          {snippet && (
            <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
              {snippet}
            </p>
          )}
          <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-left text-xs text-zinc-600 dark:text-zinc-400">
            {item.cost != null && (
              <>
                <dt className="font-medium text-zinc-500">Cost</dt>
                <dd>{item.cost.toLocaleString()}</dd>
              </>
            )}
            <dt className="font-medium text-zinc-500">Tier</dt>
            <dd>{item.item_tier}</dd>
          </dl>
        </div>
      </button>
    </li>
  )
}

export function BuildCreator({ items, heroes }: { items: UpgradeItemV2[], heroes: HeroV2[] }) {
  const router = useRouter()
  const [activeSectionId, setActiveSectionId] = useState<string>(BUILD_SECTIONS[0].id)
  const [buildItems, setBuildItems] = useState<Record<string, UpgradeItemV2[]>>(
    BUILD_SECTIONS.reduce((acc, sec) => ({ ...acc, [sec.id]: [] }), {})
  )
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [heroId, setHeroId] = useState<number | ''>('')
  const [published, setPublished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddItem = (item: UpgradeItemV2) => {
    setBuildItems((prev) => ({
      ...prev,
      [activeSectionId]: [...prev[activeSectionId], item],
    }))
  }

  const handleRemoveItem = (sectionId: string, index: number) => {
    setBuildItems((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please provide a name for your build.')
      return
    }
    if (heroId === '') {
      setError('Please select a hero.')
      return
    }

    setIsSaving(true)
    setError(null)

    const result = await createBuild({
      hero_id: heroId,
      name,
      description,
      items: buildItems,
      published,
    })

    if (result.error) {
      setError(result.error)
      setIsSaving(false)
    } else {
      router.push('/deadlock/builds')
    }
  }

  const catalog = buildSlotCostCatalog(items)

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Build Info Form */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Build Information</h2>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="build-name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
            <input
              id="build-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Unkillable Infernus"
              className="rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="build-hero" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Hero</label>
            <select
              id="build-hero"
              value={heroId}
              onChange={(e) => setHeroId(e.target.value === '' ? '' : Number(e.target.value))}
              className="rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">Select a hero...</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label htmlFor="build-desc" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              id="build-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how to play this build..."
              className="rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="build-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-600 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-offset-zinc-950"
            />
            <label htmlFor="build-published" className="text-sm text-zinc-700 dark:text-zinc-300">Publish this build (visible to others)</label>
          </div>
        </div>
      </div>

      {/* Build UI (Middle) */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Your Build</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Build'}
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {BUILD_SECTIONS.map((section) => {
            const isActive = activeSectionId === section.id
            const sectionItems = buildItems[section.id]

            return (
              <div
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`flex flex-col gap-2 rounded-lg border-2 p-3 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-violet-500 bg-violet-50/50 dark:border-violet-600 dark:bg-violet-900/20'
                    : 'border-zinc-200 hover:border-violet-300 dark:border-zinc-700 dark:hover:border-violet-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{section.name}</h3>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{section.description}</span>
                  </div>
                  {isActive && (
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                      Adding items here...
                    </span>
                  )}
                </div>
                
                <div className="flex min-h-[5.5rem] flex-wrap gap-2 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800/50">
                  <AnimatePresence>
                    {sectionItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-20 w-full items-center justify-center text-sm text-zinc-400 italic"
                      >
                        Click items below to add to {section.name}
                      </motion.div>
                    ) : (
                      sectionItems.map((item, idx) => (
                        <motion.div
                          key={`${item.id}-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                        >
                          <ItemMiniCard
                            item={item}
                            onRemove={() => handleRemoveItem(section.id, idx)}
                          />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Item Catalog (Bottom) */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Select Items</h2>
        <div className="flex flex-col gap-6">
          {catalog.map((group) => {
            const theme = resolveSlotTheme(group.slot);
            return (
              <CollapsibleSection
                key={group.slot}
                title={group.displayName}
                countLabel={`${group.totalCount} item${group.totalCount === 1 ? '' : 's'}`}
                defaultOpen
                level="slot"
                slotTheme={theme}
              >
                <div className="flex flex-col gap-3 pl-0 sm:pl-1">
                  {group.costGroups.map((costGroup) => (
                    <CollapsibleSection
                      key={`${group.slot}-${costGroup.cost}`}
                      title={formatSouls(costGroup.cost)}
                      countLabel={`${costGroup.items.length} item${costGroup.items.length === 1 ? '' : 's'}`}
                      defaultOpen
                      level="cost"
                      slotTheme={theme}
                      cost={costGroup.cost}
                    >
                      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {costGroup.items.map((item) => (
                          <SelectableItemCard
                            key={item.id}
                            item={item}
                            onClick={() => handleAddItem(item)}
                          />
                        ))}
                      </ul>
                    </CollapsibleSection>
                  ))}
                </div>
              </CollapsibleSection>
            )
          })}
        </div>
      </div>
    </div>
  )
}
