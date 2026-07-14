'use client'

import { createClient } from '@/lib/supabase/client'
import { uploadVideo } from '@/lib/supabase/storage'
import type { Video } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const router = useRouter()

  // Lazy Supabase client (только на клиенте)
  const supabase = createClient()

  const fetchVideos = async (uid: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVideos(data as Video[])
    }
  }

  // Realtime subscription
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchVideos(userId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploading(true)
    setUploadStatus('Uploading and triggering pipeline...')

    try {
      const result = await uploadVideo(file, userId)
      setUploadStatus(`✅ Uploaded! Pipeline triggered. ID: ${result.id}`)
      await fetchVideos(userId)
    } catch (error: any) {
      setUploadStatus(`❌ Error: ${error.message}`)
    } finally {
      setUploading(false)
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

        {/* Videos List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
          
          {videos.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              No videos yet. Upload your first clip above.
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{video.original_name || video.storage_path.split('/').pop()}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {new Date(video.created_at).toLocaleString()} • {video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m ${video.duration_seconds % 60}s` : '—'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      video.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                      video.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                      video.status === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-zinc-700 text-zinc-400'
                    }`}>
                      {video.status}
                    </span>
                    
                    {video.output_path && (
                      <button className="text-sm px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition">
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
