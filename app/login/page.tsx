import { login, signup } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const resolvedParams = await searchParams
  const error = resolvedParams?.error
  const message = resolvedParams?.message

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl border border-zinc-700/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Or sign up for a new account to save builds.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={login}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 bg-zinc-800/50 py-3 pl-3 pr-3 text-zinc-50 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 bg-zinc-800/50 py-3 pl-3 pr-3 text-zinc-50 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-emerald-500 text-center bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-colors"
            >
              Sign in
            </button>
            <button
              formAction={signup}
              className="group relative flex w-full justify-center rounded-md bg-zinc-800 px-3 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 transition-colors border border-zinc-700"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}