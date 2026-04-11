/**
 * Deadlock Assets API — static game data (items, etc.).
 * @see https://assets.deadlock-api.com/scalar
 */

import { cache } from 'react'
import { itemDisplayNameToSlug } from '@/lib/deadlock-item-slug'

const ASSETS_API_BASE = 'https://assets.deadlock-api.com'

/** Query param accepted by the API for English strings. */
const DEFAULT_LANGUAGE = 'english' as const

export type DeadlockItemType = 'ability' | 'weapon' | 'upgrade'

export interface AbilityDescriptionV2 {
  desc?: string | null
  quip?: string | null
  t1_desc?: string | null
  t2_desc?: string | null
  t3_desc?: string | null
  active?: string | null
  passive?: string | null
}

export interface UpgradeDescriptionV2 {
  desc?: string | null
  desc2?: string | null
  active?: string | null
  passive?: string | null
}

/** Shared fields across v2 item shapes from GET /v2/items */
export interface DeadlockItemBase {
  id: number
  class_name: string
  name: string
  start_trained?: boolean | null
  image?: string | null
  image_webp?: string | null
  hero?: number | null
  heroes?: number[] | null
  update_time?: number | null
}

export interface AbilityItemV2 extends DeadlockItemBase {
  type: 'ability'
  description: AbilityDescriptionV2
}

export interface WeaponItemV2 extends DeadlockItemBase {
  type: 'weapon'
}

export interface UpgradeItemV2 extends DeadlockItemBase {
  type: 'upgrade'
  item_slot_type: string
  item_tier: string
  is_active_item: boolean
  shopable: boolean
  cost: number | null
  description?: UpgradeDescriptionV2 | null
  shop_image?: string | null
  shop_image_webp?: string | null
  shop_image_small?: string | null
  shop_image_small_webp?: string | null
}

export type DeadlockItem = AbilityItemV2 | WeaponItemV2 | UpgradeItemV2

export interface ItemsFetchResult {
  /** Shop upgrade items only (abilities and weapons excluded). */
  items: UpgradeItemV2[]
  error: string | null
}

export interface Build {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  hero_id: number
  name: string
  description: string
  items: Record<string, UpgradeItemV2[]>
  published: boolean
}

/** Hero roster entry from `GET /v2/heroes` (Assets API). */
export interface HeroDescriptionV2 {
  lore?: string | null
  role?: string | null
  playstyle?: string | null
}

export interface HeroImagesV2 {
  icon_hero_card?: string | null
  icon_hero_card_webp?: string | null
  icon_image_small?: string | null
  icon_image_small_webp?: string | null
}

export interface HeroV2 {
  id: number
  class_name: string
  name: string
  description: HeroDescriptionV2
  player_selectable: boolean
  disabled: boolean
  in_development?: boolean
  tags?: string[] | null
  gun_tag?: string | null
  hero_type?: string | null
  complexity?: number
  images: HeroImagesV2
}

export interface HeroesFetchResult {
  heroes: HeroV2[]
  error: string | null
}

function stripTags(html: string): string {
  return html.replace(/<[\s\S]*?>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

function firstNonEmpty(values: (string | null | undefined)[]): string | null {
  for (const v of values) {
    if (v && v.trim()) return v
  }
  return null
}

/** Plain-text preview for list views (API strings often include HTML/SVG). */
export function getItemDescriptionSnippet(item: DeadlockItem, maxLen = 160): string | null {
  let raw: string | null = null
  if (item.type === 'ability') {
    const d = item.description ?? {}
    raw = firstNonEmpty([
      d.desc,
      d.passive,
      d.active,
      d.quip,
      d.t1_desc,
      d.t2_desc,
      d.t3_desc,
    ])
  } else if (item.type === 'upgrade') {
    const d = item.description
    if (d) {
      raw = firstNonEmpty([d.desc, d.desc2, d.passive, d.active])
    }
  }
  if (!raw) return null
  return truncate(stripTags(raw), maxLen)
}

export function getItemImageUrl(item: DeadlockItem): string | null {
  if (item.type === 'upgrade') {
    return (
      item.shop_image_webp ||
      item.shop_image ||
      item.image_webp ||
      item.image ||
      null
    )
  }
  return item.image_webp || item.image || null
}

const typeLabel: Record<DeadlockItemType, string> = {
  ability: 'Ability',
  weapon: 'Weapon',
  upgrade: 'Upgrade',
}

export function getItemTypeLabel(type: DeadlockItemType): string {
  return typeLabel[type]
}

export interface ShopItemBySlugResult {
  item: UpgradeItemV2 | null
  error: string | null
}

/**
 * One fetch per RSC request; shared by the items list and detail routes.
 * Detail URLs use {@link itemDisplayNameToSlug} on `item.name` (not `class_name`).
 */
export const getShopUpgradeItemsCached = cache(
  async (): Promise<{ items: UpgradeItemV2[]; error: string | null }> => {
    const url = new URL(`${ASSETS_API_BASE}/v2/items/by-type/upgrade`)
    url.searchParams.set('language', DEFAULT_LANGUAGE)

    try {
      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        return {
          items: [],
          error: `Deadlock API returned ${res.status} ${res.statusText}`,
        }
      }

      const data: unknown = await res.json()
      if (!Array.isArray(data)) {
        return { items: [], error: 'Unexpected response from Deadlock API' }
      }

      const items = data
        .filter(
          (row): row is UpgradeItemV2 =>
            typeof row === 'object' &&
            row !== null &&
            (row as UpgradeItemV2).type === 'upgrade',
        )
        .filter((item) => item.shopable)
      items.sort((a, b) => a.name.localeCompare(b.name))

      return { items, error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      return {
        items: [],
        error: `Could not load items: ${message}`,
      }
    }
  },
)

/** Fetches shopable upgrade items only (`GET /v2/items/by-type/upgrade`). */
export async function getItems(): Promise<ItemsFetchResult> {
  return getShopUpgradeItemsCached()
}

/** Resolve a single shop item from the display-name URL slug (e.g. `extended_magazine`). */
export async function getShopItemBySlug(
  slug: string,
): Promise<ShopItemBySlugResult> {
  const decoded = decodeURIComponent(slug).trim()
  const normalized = itemDisplayNameToSlug(decoded)

  const { items, error } = await getShopUpgradeItemsCached()
  if (error) return { item: null, error }

  const item =
    items.find((i) => itemDisplayNameToSlug(i.name) === normalized) ?? null
  return { item, error: null }
}

/** Stripped plain-text blocks from upgrade tooltip fields (for detail pages). */
export function getUpgradeDescriptionBlocks(
  item: UpgradeItemV2,
): { label: string; text: string }[] {
  const d = item.description
  if (!d) return []

  const blocks: { label: string; text: string }[] = []
  const push = (label: string, raw: string | null | undefined) => {
    const t = raw ? stripTags(raw).trim() : ''
    if (t) blocks.push({ label, text: t })
  }

  push('Overview', d.desc)
  push('Overview', d.desc2)
  push('Passive', d.passive)
  push('Active', d.active)
  return blocks
}

export function getHeroPortraitUrl(hero: HeroV2): string | null {
  return (
    hero.images?.icon_hero_card_webp ||
    hero.images?.icon_hero_card ||
    hero.images?.icon_image_small_webp ||
    hero.images?.icon_image_small ||
    null
  )
}

/**
 * All heroes from `GET /v2/heroes`, deduped per request (for list + future detail routes).
 */
export const getHeroesFromApiCached = cache(
  async (): Promise<{ heroes: HeroV2[]; error: string | null }> => {
    const url = new URL(`${ASSETS_API_BASE}/v2/heroes`)
    url.searchParams.set('language', DEFAULT_LANGUAGE)

    try {
      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        return {
          heroes: [],
          error: `Deadlock API returned ${res.status} ${res.statusText}`,
        }
      }

      const data: unknown = await res.json()
      if (!Array.isArray(data)) {
        return { heroes: [], error: 'Unexpected response from Deadlock API' }
      }

      return { heroes: data as HeroV2[], error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      return {
        heroes: [],
        error: `Could not load heroes: ${message}`,
      }
    }
  },
)

export interface HeroBySlugResult {
  hero: HeroV2 | null
  error: string | null
}

/** Resolve a single hero from the display-name URL slug (e.g. `infernus`). */
export async function getHeroBySlug(
  slug: string,
): Promise<HeroBySlugResult> {
  const decoded = decodeURIComponent(slug).trim()
  // Inline implementation of heroDisplayNameToSlug logic to avoid cyclic dependency if any, or import it. 
  // Actually, I'll import it at the top of the file in another replacement or inline here.
  const normalized = decoded
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const { heroes, error } = await getHeroesFromApiCached()
  if (error) return { hero: null, error }

  const hero =
    heroes.find((h) => {
      const hSlug = h.name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
      return hSlug === normalized
    }) ?? null
  return { hero, error: null }
}

/**
 * Playable roster: selectable in-game and not disabled (matches typical PvP lineup).
 */
export async function getHeroes(): Promise<HeroesFetchResult> {
  const { heroes, error } = await getHeroesFromApiCached()
  if (error) return { heroes: [], error }

  const playable = heroes.filter((h) => h.player_selectable && !h.disabled)
  playable.sort((a, b) => a.name.localeCompare(b.name))

  return { heroes: playable, error: null }
}
