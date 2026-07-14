import { createClient } from './client'
import { inngest } from '../inngest'

const BUCKET_NAME = 'videos'

export async function uploadVideo(file: File, userId: string, projectId?: string) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  // 1. Upload to Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (storageError) throw storageError

  // 2. Create DB record
  const { data: videoData, error: dbError } = await supabase
    .from('videos')
    .insert({
      user_id: userId,
      project_id: projectId || null,
      storage_path: storageData.path,
      original_name: file.name,
      status: 'uploaded',
    })
    .select()
    .single()

  if (dbError) throw dbError

  // 3. Trigger Inngest pipeline
  await inngest.send({
    name: 'video/uploaded',
    data: {
      videoId: videoData.id,
      videoPath: storageData.path,
      userId,
      originalName: file.name,
    },
  })

  return videoData
}
