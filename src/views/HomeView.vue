<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'

// Announcement Display Configuration
const INITIAL_ANNOUNCEMENT_COUNT = 3

// Scroll Configuration
const SCROLL_INDICATOR_THRESHOLD = 50 // px - hide indicator after this scroll
const SCROLL_THROTTLE_DELAY = 100 // ms - throttle scroll events

// Initialize markdown parser with security settings
const md = new MarkdownIt({
  html: false,        // Disable HTML tags in source for XSS protection
  linkify: true,      // Auto-convert URLs to links
  typographer: true,  // Enable smart quotes and other typographic replacements
  breaks: false       // Don't convert \n to <br>
})

// Add target="_blank" and rel="noopener noreferrer" to all links for security
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  if (token) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return self.renderToken(tokens, idx, options)
}

interface AnnouncementMeta {
  date: string
  title: string
  path: string
  content: string
}

const announcements = ref<AnnouncementMeta[]>([])
const loading = ref(true)
const showAll = ref(false)
const showScrollIndicator = ref(true)
const loadingMore = ref(false)

const displayedAnnouncements = computed(() => {
  return showAll.value ? announcements.value : announcements.value.slice(0, INITIAL_ANNOUNCEMENT_COUNT)
})

const hasMore = computed(() => {
  return announcements.value.length > INITIAL_ANNOUNCEMENT_COUNT
})

const loadAnnouncements = async () => {
  try {
    // Viteのglobインポートを使用（遅延読み込み対応）
    const modules = import.meta.glob('/docs/announcements/*.md', { query: '?raw', import: 'default' })

    const loaded: AnnouncementMeta[] = []

    // まずファイル名だけから日付を抽出してソート
    const sortedPaths = Object.keys(modules).sort((a, b) => {
      const dateA = a.match(/(\d{4}-\d{2}-\d{2})/)
      const dateB = b.match(/(\d{4}-\d{2}-\d{2})/)
      if (!dateA || !dateB) return 0
      return new Date(dateB[1]!).getTime() - new Date(dateA[1]!).getTime()
    })

    // 初期表示分だけ先に読み込み、残りは遅延読み込み
    const initialLoadCount = showAll.value ? sortedPaths.length : Math.min(INITIAL_ANNOUNCEMENT_COUNT, sortedPaths.length)

    for (let i = 0; i < initialLoadCount; i++) {
      const path = sortedPaths[i]
      if (!path) continue

      const module = modules[path]
      if (!module) continue

      const content = await module() as string
      const filename = path.split('/').pop() || ''

      // ファイル名から日付とタイトルを抽出 (例: 2025-01-20-welcome.md)
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)

      if (match) {
        const dateStr = match[1] || ''
        const titleSlug = match[2] || ''

        // Markdownから最初のh1を抽出してタイトルとする
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = (titleMatch && titleMatch[1]) ? titleMatch[1] : titleSlug.replace(/-/g, ' ')

        if (dateStr && title) {
          loaded.push({
            date: dateStr,
            title,
            path,
            content,
          })
        }
      }
    }

    announcements.value = loaded
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load announcements:', error)
    }
  } finally {
    loading.value = false
  }
}

const loadMoreAnnouncements = async () => {
  if (loadingMore.value) return

  loadingMore.value = true
  showAll.value = true

  try {
    const modules = import.meta.glob('/docs/announcements/*.md', { query: '?raw', import: 'default' })

    // まずファイル名だけから日付を抽出してソート
    const sortedPaths = Object.keys(modules).sort((a, b) => {
      const dateA = a.match(/(\d{4}-\d{2}-\d{2})/)
      const dateB = b.match(/(\d{4}-\d{2}-\d{2})/)
      if (!dateA || !dateB) return 0
      return new Date(dateB[1]!).getTime() - new Date(dateA[1]!).getTime()
    })

    const loaded: AnnouncementMeta[] = [...announcements.value]

    // 既に読み込まれている分以降を読み込む
    for (let i = INITIAL_ANNOUNCEMENT_COUNT; i < sortedPaths.length; i++) {
      const path = sortedPaths[i]
      if (!path) continue

      const module = modules[path]
      if (!module) continue

      const content = await module() as string
      const filename = path.split('/').pop() || ''

      const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)

      if (match) {
        const dateStr = match[1] || ''
        const titleSlug = match[2] || ''

        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = (titleMatch && titleMatch[1]) ? titleMatch[1] : titleSlug.replace(/-/g, ' ')

        if (dateStr && title) {
          loaded.push({
            date: dateStr,
            title,
            path,
            content,
          })
        }
      }
    }

    announcements.value = loaded
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load more announcements:', error)
    }
  } finally {
    loadingMore.value = false
  }
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// Safely parse markdown to HTML with XSS protection
const parseMarkdown = (markdown: string): string => {
  return md.render(markdown)
}

// Throttled scroll handler for better performance
let scrollTimeout: number | null = null
const handleScroll = () => {
  if (scrollTimeout) return

  scrollTimeout = window.setTimeout(() => {
    showScrollIndicator.value = window.scrollY <= SCROLL_INDICATOR_THRESHOLD
    scrollTimeout = null
  }, SCROLL_THROTTLE_DELAY)
}

onMounted(() => {
  loadAnnouncements()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- ヒーローセクション - フルスクリーン -->
    <section class="relative min-h-screen flex items-center justify-center">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-center">
        <!-- グラデーションタイトル -->
        <h1 class="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary-light via-secondary-light to-primary-light dark:from-primary-dark dark:via-secondary-dark dark:to-primary-dark bg-clip-text text-transparent animate-gradient">
          すみれさば
        </h1>
        <p class="text-lg md:text-xl text-on-surface-variant-light dark:text-on-surface-variant-dark mb-8 max-w-2xl mx-auto text-balance">
          ゲームから様々なジャンルを取り扱っている身内主導のコミュニティ
        </p>
        <a
          href="https://discord.gg/H8eh2hR79e"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 px-8 py-4 bg-surface-container-light/80 dark:bg-surface-container-dark/80 backdrop-blur-xl rounded-full border-2 border-primary-light/40 dark:border-primary-dark/40 text-on-surface-light dark:text-on-surface-dark font-semibold text-base shadow-md hover:shadow-lg hover:border-primary-light/60 dark:hover:border-primary-dark/60 hover:bg-surface-container-light dark:hover:bg-surface-container-dark transition-all duration-300 group"
        >
          <svg class="w-6 h-6 text-primary-light dark:text-primary-dark group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          すみれさばに参加
        </a>
      </div>

      <!-- スクロールインジケーター -->
      <transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showScrollIndicator" class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-on-surface-variant-light dark:text-on-surface-variant-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </transition>
    </section>

    <!-- お知らせセクション -->
    <section class="py-16 md:py-24 border-t border-outline-light/20 dark:border-outline-dark/20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-7xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
          📢 お知らせ
        </h2>

        <!-- ローディング -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>

        <!-- お知らせ一覧 -->
        <div v-else-if="announcements.length > 0" class="space-y-6">
          <article
            v-for="announcement in displayedAnnouncements"
            :key="announcement.path"
            class="md3-card p-6 md:p-8"
          >
            <div class="flex items-center gap-3 mb-4">
              <time class="text-sm font-medium text-primary-light dark:text-primary-dark">
                {{ formatDate(announcement.date) }}
              </time>
            </div>
            <div class="markdown-content prose dark:prose-invert max-w-none" v-html="parseMarkdown(announcement.content)"></div>
          </article>

          <!-- もっと見るボタン -->
          <div v-if="hasMore && !showAll" class="text-center pt-6">
            <button
              @click="loadMoreAnnouncements"
              :disabled="loadingMore"
              class="md3-button-outlined disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loadingMore ? '読み込み中...' : 'もっと見る' }}
            </button>
          </div>
        </div>

        <!-- お知らせがない場合 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">現在お知らせはありません</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.markdown-content :deep(h1) {
  @apply text-2xl md:text-3xl font-bold mb-4 text-primary-light dark:text-primary-dark;
}

.markdown-content :deep(h2) {
  @apply text-xl md:text-2xl font-semibold mb-3 mt-6 text-primary-light dark:text-primary-dark;
}

.markdown-content :deep(h3) {
  @apply text-lg md:text-xl font-semibold mb-2 mt-4;
}

.markdown-content :deep(p) {
  @apply mb-4 leading-relaxed;
}

.markdown-content :deep(ul) {
  @apply mb-4 ml-6 space-y-2;
}

.markdown-content :deep(li) {
  @apply list-disc;
}

.markdown-content :deep(a) {
  @apply text-primary-light dark:text-primary-dark underline hover:brightness-110;
}

.markdown-content :deep(strong) {
  @apply font-bold;
}
</style>
