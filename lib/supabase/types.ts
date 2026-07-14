export type Project = {
  id: string
  user_id: string
  name: string
  created_at: string
}

export type Video = {
  id: string
  user_id: string
  project_id: string | null
  storage_path: string
  original_name: string | null
  status: 'uploaded' | 'processing' | 'done' | 'error'
  duration_seconds: number | null
  created_at: string
}
