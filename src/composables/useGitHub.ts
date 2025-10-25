import { ref } from 'vue'
import type { Repository } from '@/types'

// API Configuration
const GITHUB_ORG = 'Sumire-Labs'
const GITHUB_API_URL = `https://api.github.com/orgs/${GITHUB_ORG}/repos`
const REPOS_PER_PAGE = 100

// Cache Configuration
const CACHE_KEY = 'github_repos_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Date Format Thresholds
const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30
const DAYS_IN_YEAR = 365
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

export function useGitHub() {
  const repositories = ref<Repository[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRepositories = async () => {
    // Check cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          repositories.value = data
          loading.value = false
          return
        }
      }
    } catch (err) {
      // If cache fails, continue with fetch
      if (import.meta.env.DEV) {
        console.warn('Failed to load cache:', err)
      }
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${GITHUB_API_URL}?per_page=${REPOS_PER_PAGE}&sort=updated`)

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`)
      }

      const data = await response.json()

      // 更新日順にソート（最新が上）
      repositories.value = data
        .filter((repo: Repository) => !repo.fork) // フォークを除外
        .sort((a: Repository, b: Repository) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })

      // Cache the result
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: repositories.value,
          timestamp: Date.now()
        }))
      } catch (err) {
        // If cache storage fails, continue without caching
        if (import.meta.env.DEV) {
          console.warn('Failed to cache data:', err)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      if (import.meta.env.DEV) {
        console.error('Failed to fetch repositories:', err)
      }
    } finally {
      loading.value = false
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / MILLISECONDS_PER_DAY)

    if (diffDays === 0) {
      return '今日'
    } else if (diffDays === 1) {
      return '昨日'
    } else if (diffDays < DAYS_IN_WEEK) {
      return `${diffDays}日前`
    } else if (diffDays < DAYS_IN_MONTH) {
      const weeks = Math.floor(diffDays / DAYS_IN_WEEK)
      return `${weeks}週間前`
    } else if (diffDays < DAYS_IN_YEAR) {
      const months = Math.floor(diffDays / DAYS_IN_MONTH)
      return `${months}ヶ月前`
    } else {
      const years = Math.floor(diffDays / DAYS_IN_YEAR)
      return `${years}年前`
    }
  }

  return {
    repositories,
    loading,
    error,
    fetchRepositories,
    formatDate,
  }
}
