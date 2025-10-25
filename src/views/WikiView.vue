<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

// Initialize markdown parser with security settings
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false
})

// Add target="_blank" and rel="noopener noreferrer" to all links
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  if (token) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return self.renderToken(tokens, idx, options)
}

interface WikiPage {
  id: string
  title: string
  path: string
  category: string
  content?: string
}

interface WikiCategory {
  id: string
  name: string
  icon: string
  collapsed: boolean
  pages: WikiPage[]
}

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const loading = ref(true)
const currentContent = ref('')
const currentPage = ref<WikiPage | null>(null)

const categories = ref<WikiCategory[]>([])

// Default category metadata (can be overridden by detection)
const categoryDefaults: Record<string, { name: string; icon: string }> = {
  'general': { name: '一般', icon: '📚' },
  'minecraft': { name: 'Minecraft', icon: '🎮' },
  'gta-v': { name: 'GTA V', icon: '🚗' },
  'projects': { name: 'Projects', icon: '🔬' }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleCategory = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  if (category) {
    category.collapsed = !category.collapsed
  }
}

const loadWikiStructure = async () => {
  try {
    const modules = import.meta.glob('/docs/wiki/**/*.md', { query: '?raw', import: 'default' })
    const detectedCategories = new Map<string, WikiCategory>()

    for (const path in modules) {
      const parts = path.split('/')
      const categoryId = parts[3] // 'general', 'minecraft', etc.
      const filename = parts[4]?.replace('.md', '') || ''

      if (!categoryId || !filename) continue

      // Auto-create category if it doesn't exist
      if (!detectedCategories.has(categoryId)) {
        const defaultMeta = categoryDefaults[categoryId]

        // Generate display name from folder name if no default exists
        const displayName = defaultMeta?.name || categoryId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        detectedCategories.set(categoryId, {
          id: categoryId,
          name: displayName,
          icon: defaultMeta?.icon || '📁', // Default folder icon
          collapsed: false,
          pages: []
        })
      }

      const category = detectedCategories.get(categoryId)
      if (!category) continue

      // Load content to extract title
      const module = modules[path]
      if (!module) continue

      const content = await module() as string
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = (titleMatch && titleMatch[1]) ? titleMatch[1] : filename.replace(/-/g, ' ')

      category.pages.push({
        id: filename,
        title,
        path,
        category: categoryId
      })
    }

    // Convert map to array and sort categories
    categories.value = Array.from(detectedCategories.values()).sort((a, b) => {
      // Prioritize 'general' category first
      if (a.id === 'general') return -1
      if (b.id === 'general') return 1
      return a.name.localeCompare(b.name)
    })

    // Sort pages alphabetically within each category
    categories.value.forEach(category => {
      category.pages.sort((a, b) => a.title.localeCompare(b.title))
    })
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load wiki structure:', error)
    }
  }
}

const loadPage = async (categoryId: string, pageId: string) => {
  loading.value = true

  try {
    const modules = import.meta.glob('/docs/wiki/**/*.md', { query: '?raw', import: 'default' })
    const targetPath = `/docs/wiki/${categoryId}/${pageId}.md`

    const module = modules[targetPath]
    if (!module) {
      currentContent.value = '# ページが見つかりません\n\n指定されたページは存在しません。'
      return
    }

    const content = await module() as string
    currentContent.value = content

    const category = categories.value.find(c => c.id === categoryId)
    const page = category?.pages.find(p => p.id === pageId)

    if (page) {
      currentPage.value = page
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load wiki page:', error)
    }
    currentContent.value = '# エラー\n\nページの読み込みに失敗しました。'
  } finally {
    loading.value = false
  }
}

const navigateToPage = (categoryId: string, pageId: string) => {
  router.push(`/wiki/${categoryId}/${pageId}`)
}

const parseMarkdown = (markdown: string): string => {
  return md.render(markdown)
}

// Watch route changes
watch(() => route.params, (params) => {
  const categoryId = params.category as string
  const pageId = params.page as string

  if (categoryId && pageId) {
    loadPage(categoryId, pageId)
  }
}, { immediate: true })

onMounted(async () => {
  await loadWikiStructure()

  // Load default page if no route params
  if (!route.params.category || !route.params.page) {
    router.replace('/wiki/general/getting-started')
  }
})
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pt-24 pb-12">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex gap-6">
        <!-- Mobile Sidebar Toggle -->
        <button
          @click="toggleSidebar"
          class="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark text-white shadow-md3-3 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="サイドバーを開く"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Sidebar Overlay (Mobile) -->
        <transition
          enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            v-if="sidebarOpen"
            @click="sidebarOpen = false"
            class="lg:hidden fixed inset-0 bg-black/50 z-30"
          ></div>
        </transition>

        <!-- Sidebar -->
        <aside
          :class="[
            'fixed lg:sticky top-24 left-0 h-[calc(100vh-7rem)] w-64 flex-shrink-0 z-40 transition-transform duration-300',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          ]"
        >
          <div class="h-full overflow-y-auto bg-surface-container-light dark:bg-surface-container-dark rounded-md3-lg p-4 shadow-md3-1">
            <h2 class="text-xl font-bold mb-4 text-primary-light dark:text-primary-dark px-2">
              📖 Wiki
            </h2>

            <nav>
              <div v-for="category in categories" :key="category.id" class="mb-4">
                <!-- Category Header -->
                <button
                  @click="toggleCategory(category.id)"
                  class="w-full flex items-center justify-between px-2 py-2 rounded-md3-sm hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ category.icon }}</span>
                    <span class="font-semibold text-on-surface-light dark:text-on-surface-dark">
                      {{ category.name }}
                    </span>
                  </div>
                  <svg
                    :class="['w-4 h-4 transition-transform', category.collapsed ? '' : 'rotate-90']"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Category Pages -->
                <transition
                  enter-active-class="transition-all duration-200"
                  leave-active-class="transition-all duration-200"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-96 opacity-100"
                  leave-from-class="max-h-96 opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <ul v-show="!category.collapsed" class="mt-1 ml-4 space-y-1">
                    <li v-for="page in category.pages" :key="page.id">
                      <button
                        @click="navigateToPage(category.id, page.id)"
                        :class="[
                          'w-full text-left px-3 py-2 rounded-md3-sm text-sm transition-colors',
                          currentPage?.id === page.id && currentPage?.category === category.id
                            ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark font-medium'
                            : 'text-on-surface-variant-light dark:text-on-surface-variant-dark hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark'
                        ]"
                      >
                        {{ page.title }}
                      </button>
                    </li>
                  </ul>
                </transition>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <article class="md3-card p-6 md:p-10">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent"></div>
              <p class="mt-4 text-on-surface-variant-light dark:text-on-surface-variant-dark">読み込み中...</p>
            </div>

            <!-- Content -->
            <div
              v-else
              class="markdown-content prose dark:prose-invert max-w-none"
              v-html="parseMarkdown(currentContent)"
            ></div>
          </article>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-content :deep(h1) {
  @apply text-3xl md:text-4xl font-bold mb-6 text-primary-light dark:text-primary-dark border-b-2 border-outline-light/20 dark:border-outline-dark/20 pb-3;
}

.markdown-content :deep(h2) {
  @apply text-2xl md:text-3xl font-semibold mb-4 mt-8 text-primary-light dark:text-primary-dark;
}

.markdown-content :deep(h3) {
  @apply text-xl md:text-2xl font-semibold mb-3 mt-6;
}

.markdown-content :deep(p) {
  @apply mb-4 leading-relaxed;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  @apply mb-4 ml-6 space-y-2;
}

.markdown-content :deep(li) {
  @apply leading-relaxed;
}

.markdown-content :deep(a) {
  @apply text-primary-light dark:text-primary-dark underline hover:brightness-110 transition-all;
}

.markdown-content :deep(code) {
  @apply bg-surface-light dark:bg-surface-dark px-2 py-1 rounded text-sm font-mono;
}

.markdown-content :deep(pre) {
  @apply bg-surface-light dark:bg-surface-dark p-4 rounded-md3-sm overflow-x-auto mb-4;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-primary-light dark:border-primary-dark pl-4 italic my-4;
}

.markdown-content :deep(strong) {
  @apply font-bold;
}

.markdown-content :deep(em) {
  @apply italic;
}
</style>
