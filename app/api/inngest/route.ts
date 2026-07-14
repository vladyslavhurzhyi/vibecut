import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest'
import { processVideo } from '@/inngest/functions/process-video'

// Force dynamic to avoid build-time Supabase issues
export const dynamic = 'force-dynamic'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processVideo],
})
