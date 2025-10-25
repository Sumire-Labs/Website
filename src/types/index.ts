export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  updated_at: string
  language: string | null
  license: {
    name: string
    spdx_id: string
  } | null
  topics: string[]
  fork: boolean
}

export interface Announcement {
  date: string
  title: string
  content: string
  filename: string
}

export type Theme = 'light' | 'dark'
