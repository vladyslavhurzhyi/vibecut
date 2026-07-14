import { inngest } from '@/lib/inngest'
import { createClient } from '@supabase/supabase-js'
import type { Video } from '@/lib/supabase/types'

// ВАЖНО: Supabase клиент создаётся ТОЛЬКО внутри step.run
// чтобы не падал билд на Vercel

export const processVideo = inngest.createFunction(
  { 
    id: 'process-video', 
    name: 'Process uploaded video',
    triggers: [{ event: 'video/uploaded' }]
  },
  async ({ event, step }) => {
    const { videoId, storagePath, userId, originalName } = event.data

    // Step 1: Mark as processing
    await step.run('mark-processing', async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error } = await supabase
        .from('videos')
        .update({ status: 'processing' })
        .eq('id', videoId)
        .eq('user_id', userId)
      
      if (error) throw error
      console.log(`[process-video] Video ${videoId} marked as processing`)
      return { success: true }
    })

    // Step 2: Validate + get metadata (placeholder for real ffprobe)
    const metadata = await step.run('validate-and-analyze', async () => {
      console.log(`Validating ${storagePath}...`)
      // TODO: real ffprobe / AI analysis here
      return {
        duration: 187,
        scenes: 12,
        highlights: ['00:23', '01:05', '02:41'],
        suggestedCuts: 5
      }
    })

    // Step 3: Generate output (placeholder - later real FFmpeg or AI render)
    const result = await step.run('generate-montage', async () => {
      console.log('Generating AI montage...')
      // In real version: download from storage, run ffmpeg, upload result
      const outputPath = `processed/${userId}/${Date.now()}-vibecut.mp4`
      
      return {
        outputPath,
        success: true
      }
    })

    // Step 4: Mark as done + save output
    await step.run('finalize', async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error } = await supabase
        .from('videos')
        .update({
          status: 'done',
          output_path: result.outputPath,
          processed_at: new Date().toISOString(),
          duration_seconds: metadata.duration
        })
        .eq('id', videoId)
        .eq('user_id', userId)
      
      if (error) throw error
      console.log(`[process-video] Video ${videoId} completed`)
      return { success: true }
    })

    return { 
      success: true, 
      videoId,
      analysis: metadata,
      outputPath: result.outputPath 
    }
  }
)
