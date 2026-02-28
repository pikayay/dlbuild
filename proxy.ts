import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // made these functions async and await
        async getAll() {
          return (await cookies()).getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(async ({ name, value, options }) => {
            (await cookies()).set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - 30 seconds before expiration
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/',
    // '/(about|blog|contact)(?!/_next/.*)?$', // wasn't working
  ],
  ignoredRoutes: ['/_next/static', '/_external', '/api/auth/callback'],
}