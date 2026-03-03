'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'

type Profile = {
  full_name: string | null
  avatar_url: string | null
}

export default function ProfileForm({ user, profile }: { user: User; profile: Profile }) {
  const supabase = createSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [uploading, setUploading] = useState(false)

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
    })

    if (error) {
      alert('Error updating the data: ' + error.message)
    } else {
      alert('Profile updated successfully!')
    }
    setLoading(false)
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(publicUrl)

    } catch (error) {
      if (error instanceof Error) {
        alert('Error uploading avatar: ' + error.message)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-24 h-24">
          <img
            src={avatarUrl || '/no-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full"
            width={96}
            height={96}
          />
          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.email}</h2>
        </div>
      </div>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-400">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName || ''}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 mt-1 text-black bg-gray-100 rounded-md"
          />
        </div>

        <div>
          <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
