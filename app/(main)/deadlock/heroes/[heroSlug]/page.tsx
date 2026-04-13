import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHeroBySlug, getHeroPortraitUrl, getHeroAbilities } from '@/lib/deadlock-api'
import { heroDetailHref } from '@/lib/deadlock-hero-slug'

type PageProps = {
  params: Promise<{ heroSlug: string }>
}

function ComplexityDots({ level }: { level: number | undefined }) {
  const n = level != null ? Math.min(4, Math.max(1, Math.round(level))) : null
  if (n == null) return null
  return (
    <div className="flex items-center gap-1" title={`Complexity ${n} / 4`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i <= n ? 'bg-white' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}

function heroTypeGradient(heroType: string | null | undefined): string {
  const t = (heroType ?? '').toLowerCase()
  if (t === 'marksman')
    return 'bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-700 shadow-sky-900/25'
  if (t === 'assassin')
    return 'bg-gradient-to-br from-rose-600 via-red-600 to-pink-700 shadow-rose-900/25'
  if (t === 'mystic')
    return 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 shadow-violet-900/25'
  if (t === 'brawler')
    return 'bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-700 shadow-amber-900/25'
  return 'bg-gradient-to-br from-zinc-600 to-zinc-800 shadow-black/20'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { heroSlug } = await params
  const { hero } = await getHeroBySlug(heroSlug)
  if (!hero) {
    return { title: 'Hero | Deadlock' }
  }
  return {
    title: `${hero.name} | Deadlock`,
    description: `Hero detail — ${hero.description?.role ?? ''}`,
  }
}

export default async function HeroDetailPage({ params }: PageProps) {
  const { heroSlug } = await params
  const { hero, error } = await getHeroBySlug(heroSlug)

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          <p className="font-medium">Could not load hero</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
        <p className="mt-6">
          <Link href="/deadlock/heroes" className="text-violet-600 underline hover:text-violet-500 dark:text-violet-400">
            ← Back to heroes
          </Link>
        </p>
      </div>
    )
  }

  if (!hero) {
    notFound()
  }

  const [
    { abilities }
  ] = await Promise.all([
    getHeroAbilities(hero)
  ])

  const portrait = getHeroPortraitUrl(hero)
  const role = hero.description?.role?.trim()
  const playstyle = hero.description?.playstyle?.trim()
  const lore = hero.description?.lore?.trim()
  const tags = (hero.tags ?? [])

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="mb-6 text-sm">
        <Link
          href="/deadlock/heroes"
          className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          ← Heroes
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600 dark:text-zinc-400">{hero.name}</span>
      </nav>

      <header
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg ${heroTypeGradient(hero.hero_type)}`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white/15 p-1 ring-2 ring-white/30 sm:mx-0 sm:h-32 sm:w-32">
            {portrait ? (
              <Image
                src={portrait}
                alt=""
                fill
                className="object-cover object-top p-1 rounded-lg"
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{hero.name}</h1>
            <p className="mt-2 font-mono text-sm text-white/80">{hero.class_name}</p>
            <dl className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {hero.hero_type && (
                <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-sm">
                  <dt className="sr-only">Type</dt>
                  <dd className="capitalize">{hero.hero_type}</dd>
                </div>
              )}
              {hero.gun_tag && (
                <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-sm">
                  <dt className="sr-only">Weapon</dt>
                  <dd>Weapon: {hero.gun_tag}</dd>
                </div>
              )}
              {hero.complexity != null && (
                <div className="rounded-full bg-black/20 flex items-center gap-2 px-3 py-1 text-sm backdrop-blur-sm">
                  <dt className="font-medium">Complexity</dt>
                  <dd><ComplexityDots level={hero.complexity} /></dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </header>

      {hero.starting_stats && (
        <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Base Stats</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Health', value: hero.starting_stats.max_health?.value },
              { label: 'Move Speed', value: hero.starting_stats.max_move_speed?.value ? `${hero.starting_stats.max_move_speed.value}m/s` : null },
              { label: 'Sprint Speed', value: hero.starting_stats.sprint_speed?.value ? `+${hero.starting_stats.sprint_speed.value}m/s` : null },
              { label: 'Light Melee', value: hero.starting_stats.light_melee_damage?.value },
              { label: 'Heavy Melee', value: hero.starting_stats.heavy_melee_damage?.value },
              { label: 'Reload', value: hero.starting_stats.reload_speed?.value ? `${hero.starting_stats.reload_speed.value}s` : null },
              { label: 'Spirit Resist', value: hero.starting_stats.tech_armor_damage_reduction?.value ? `${hero.starting_stats.tech_armor_damage_reduction.value}%` : null },
              { label: 'Bullet Resist', value: hero.starting_stats.bullet_armor_damage_reduction?.value ? `${hero.starting_stats.bullet_armor_damage_reduction.value}%` : null },
            ].map(stat => stat.value != null ? (
              <div key={stat.label} className="flex flex-col bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                <span className="text-xs text-zinc-500 font-medium uppercase">{stat.label}</span>
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{stat.value}</span>
              </div>
            ) : null)}
          </div>
        </section>
      )}

      {abilities && abilities.length > 0 && (
        <section className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Abilities</h2>
          <div className="flex flex-col gap-6">
            {abilities.map((ability) => (
              <div key={ability.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="w-16 h-16 shrink-0 relative rounded-md overflow-hidden bg-black/50 border border-zinc-300 dark:border-zinc-600">
                  {(ability.image_webp || ability.image) && (
                    <Image
                      src={ability.image_webp || ability.image || ''}
                      alt={ability.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{ability.name}</h3>
                  {ability.description?.desc && (
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: ability.description.desc }} />
                  )}
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {['t1_desc', 't2_desc', 't3_desc'].map((tier, i) => {
                      const desc = ability.description?.[tier as keyof typeof ability.description]
                      if (!desc) return null
                      return (
                        <div key={tier} className="bg-zinc-200/50 dark:bg-zinc-950/50 p-2 rounded-md text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                          <span className="font-bold mr-1">T{i + 1}</span>
                          <span dangerouslySetInnerHTML={{ __html: desc }} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Overview</h2>
        {role && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Role</h3>
            <p className="mt-1 text-zinc-700 dark:text-zinc-300">{role}</p>
          </div>
        )}
        {playstyle && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Playstyle</h3>
            <p className="mt-1 text-zinc-700 dark:text-zinc-300">{playstyle}</p>
          </div>
        )}
        {tags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">Tags</h3>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
        {lore && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Lore</h3>
            <p className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 italic">&quot;{lore}&quot;</p>
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-zinc-500 sm:text-left">
        <span className="mr-2">Share:</span>
        <code className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          {heroDetailHref(hero.name)}
        </code>
      </p>
    </div>
  )
}