'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function ProfileForm({ user, profile }: { user: any, profile: any }) {
  const supabase = createSupabaseClient()
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function updateProfile() {
    try {
      setLoading(true)
      setErrorMsg('')
      setMessage('')
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setErrorMsg(error.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      setErrorMsg('')
      setMessage('')

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)

    } catch (error: any) {
      setErrorMsg(error.message || 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 p-8 border border-gray-800 rounded-xl bg-gray-900/50 shadow-sm">
      {message && <div className="p-4 bg-green-900/30 text-green-300 border border-green-800 rounded-md">{message}</div>}
      {errorMsg && <div className="p-4 bg-red-900/30 text-red-300 border border-red-800 rounded-md">{errorMsg}</div>}
      
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 shadow-inner">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 font-medium">No PFP</div>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start gap-3">
          <p className="text-sm text-gray-400">Upload a new profile picture (Max 2MB)</p>
          <div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm" htmlFor="single">
              {uploading ? 'Uploading ...' : 'Choose File'}
            </label>
            <input
              style={{
                visibility: 'hidden',
                position: 'absolute',
              }}
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="bio" className="text-sm font-medium text-gray-300">Bio</label>
        <textarea
          id="bio"
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y"
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-gray-500 text-right">{bio.length} characters</p>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 px-6 rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={updateProfile}
          disabled={loading || uploading}
        >
          {loading ? 'Saving ...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
