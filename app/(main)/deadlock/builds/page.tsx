import { fetchBuilds } from './actions'
import { Build } from '@/lib/deadlock-api'
import Link from 'next/link'

export default async function BuildsPage() {
  const builds = await fetchBuilds()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex items-center justify-between w-full max-w-4xl mb-8">
          <h1 className="text-4xl font-bold">
            Builds
          </h1>
          <Link
            href="/deadlock/builds/new"
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Create New Build
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full text-left">
          {builds.map((build: Build) => (
            <li key={build.id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold">{build.name}</h2>
              <p>{build.description}</p>
              <div className="mt-2 text-xs font-semibold text-zinc-500">
                {build.published ? 'Published' : 'Draft'}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
