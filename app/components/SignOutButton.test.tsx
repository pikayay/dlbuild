import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SignOutButton from './SignOutButton'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Mock the useRouter hook
const pushMock = vi.fn()
const refreshMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}))

// Mock the Supabase client
const signOutMock = vi.fn().mockResolvedValue({ error: null })
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      signOut: signOutMock,
    },
  }),
}))

describe('SignOutButton', () => {
  it('calls signOut and redirects on click', async () => {
    render(<SignOutButton />)

    const signOutButton = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(signOutButton)

    // Check if Supabase signOut was called
    expect(signOutMock).toHaveBeenCalledTimes(1)

    // Wait for promises to resolve
    await screen.findByRole('button')

    // Check if router.push was called
    expect(pushMock).toHaveBeenCalledWith('/')
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })
})
