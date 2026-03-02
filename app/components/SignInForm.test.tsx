import { render, screen } from '@testing-library/react'
import SignInForm from './SignInForm'
import { describe, it, expect, vi } from 'vitest'

// Mock the useRouter hook from next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock the Supabase client
const signInWithPasswordMock = vi.fn().mockResolvedValue({ error: null })
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      signInWithPassword: signInWithPasswordMock,
    },
  }),
}))


describe('SignInForm', () => {
  it('renders the sign in form with email, password, and button', () => {
    render(<SignInForm />)

    // Check for the email input field by its placeholder
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()

    // Check for the password input field by its placeholder
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()

    // Check for the sign in button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
