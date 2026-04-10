import Image from 'next/image'
import Link from 'next/link'
import { getHeroPortraitUrl, type HeroV2 } from '@/lib/deadlock-api'
import { heroDetailHref } from '@/lib/deadlock-hero-slug'

function heroTypeBadgeClass(heroType: string | null | undefined): string {
  const t = (heroType ?? '').toLowerCase()
  if (t === 'marksman')
    return 'bg-sky-500/15 text-sky-900 dark:bg-sky-500/25 dark:text-sky-100'
  if (t === 'assassin')
    return 'bg-rose-500/15 text-rose-900 dark:bg-rose-500/25 dark:text-rose-100'
  if (t === 'mystic')
    return 'bg-violet-500/15 text-violet-900 dark:bg-violet-500/25 dark:text-violet-100'
  if (t === 'brawler')
    return 'bg-amber-500/15 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100'
  return 'bg-zinc-500/15 text-zinc-800 dark:bg-zinc-500/25 dark:text-zinc-200'
}

function ComplexityDots({ level }: { level: number | undefined }) {
  const n = level != null ? Math.min(4, Math.max(1, Math.round(level))) : null
  if (n == null) return null
  return (
    <div className="flex items-center gap-0.5" title={`Complexity ${n} / 4`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= n ? 'bg-zinc-700 dark:bg-zinc-300' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        />
      ))}
    </div>
  )
}

function HeroCard({ hero }: { hero: HeroV2 }) {
  const portrait = getHeroPortraitUrl(hero)
  const role = hero.description?.role?.trim()
  const playstyle = hero.description?.playstyle?.trim()
  const tags = (hero.tags ?? []).slice(0, 4)
  const href = heroDetailHref(hero.name)

  return (
    <li className="flex rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80">
      <Link
        href={href}
        className="flex w-full gap-4 p-4 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-violet-500 dark:ring-offset-zinc-950"
      >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-600">
        {portrait ? (
          <Image
            src={portrait}
            alt=""
            fill
            className="object-cover object-top"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-zinc-400">
            No art
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{hero.name}</h2>
          {hero.hero_type && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${heroTypeBadgeClass(hero.hero_type)}`}
            >
              {hero.hero_type}
            </span>
          )}
        </div>
        <p className="truncate font-mono text-xs text-zinc-500">{hero.class_name}</p>
        {role && (
          <p className="mt-2 line-clamp-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {role}
          </p>
        )}
        {playstyle && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{playstyle}</p>
        )}
        {tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          {hero.gun_tag && (
            <span>
              <span className="font-medium text-zinc-600 dark:text-zinc-500">Weapon: </span>
              {hero.gun_tag}
            </span>
          )}
          {hero.complexity != null && (
            <span className="flex items-center gap-2">
              <span className="font-medium text-zinc-600 dark:text-zinc-500">Complexity</span>
              <ComplexityDots level={hero.complexity} />
            </span>
          )}
        </div>
      </div>
      </Link>
    </li>
  )
}

export function HeroesCatalog({ heroes }: { heroes: HeroV2[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {heroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} />
      ))}
    </ul>
  )
}
