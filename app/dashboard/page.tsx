'use client'

import { createClient } from '@/lib/supabase/client'
import { uploadVideo } from '@/lib/supabase/storage'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserEmail(user.email ?? null)
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploading(true)
    setUploadStatus('Uploading and triggering pipeline...')

    try {
      const result = await uploadVideo(file, userId)
      setUploadStatus(`✅ Uploaded! Pipeline triggered. Path: ${result.path}`)
    } catch (error: any) {
      setUploadStatus(`❌ Error: ${error.message}`)
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!userEmail) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vibecut Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-sm rounded-md border border-zinc-700 hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 mb-6">
          <p className="text-zinc-400">Welcome, {userEmail}!</p>
          
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">Upload video</label>
            <input 
              type="file" 
              accept="video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-black hover:file:bg-zinc-200 disabled:opacity-50"
            />
            {uploadStatus && (
              <p className="mt-3 text-sm text-zinc-400">{uploadStatus}</p>
            )}
            {uploading && <p className="mt-2 text-xs text-blue-400">Processing upload + triggering Inngest...</p>}
          </div>
        </div>

        <div className="text-xs text-zinc-500">
          After upload the Inngest pipeline (validate → analyze → generate) will run automatically.
        </div>
      </div>
    </div>
  )
}
