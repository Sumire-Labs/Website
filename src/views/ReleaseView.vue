<script setup lang="ts">
import { ref, computed } from 'vue'

type Category = 'All' | 'Soft' | 'Mod' | 'ModPack'

interface Release {
  id: string
  title: string
  description: string
  version: string
  date: string
  category: Category
  tags: string[]
  imageUrl?: string
  downloadUrl: string
  githubUrl?: string
}

const activeCategory = ref<Category>('All')
const searchQuery = ref('')

const categories: Category[] = ['All', 'Soft', 'Mod', 'ModPack']

// Mock Data - Replace with actual data later
const releases: Release[] = [
  {
    id: '1',
    title: 'Example Mod',
    description: 'A Minecraft mod that adds new features to the game. Enhanced gameplay mechanics and new items.',
    version: 'v1.0.0',
    date: '2025-01-20',
    category: 'Mod',
    tags: ['Fabric', '1.20.1'],
    downloadUrl: '#',
    githubUrl: '#'
  }
]

const filteredReleases = computed(() => {
  return releases.filter(release => {
    const matchesCategory = activeCategory.value === 'All' || release.category === activeCategory.value
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Software': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
    case 'Minecraft Mod': return 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30'
    case 'Modpack': return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
    default: return 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30'
  }
}
</script>

<template>
  <div class="min-h-screen pt-24 bg-background-light dark:bg-background-dark">
    <!-- Header Section -->
    <section class="relative py-16 md:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 text-center bg-gradient-to-r from-primary-light via-secondary-light to-primary-light dark:from-primary-dark dark:via-secondary-dark dark:to-primary-dark bg-clip-text text-transparent animate-gradient">
          Releases
        </h1>
        <p class="text-lg md:text-xl text-on-surface-variant-light dark:text-on-surface-variant-dark text-center max-w-2xl mx-auto">
          ソフトウェア、Mod、Modpackの配布場所
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 md:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        <!-- Controls -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <!-- Tabs -->
          <div class="flex flex-wrap justify-center gap-2 bg-surface-container-light dark:bg-surface-container-dark p-1.5 rounded-2xl border border-outline-light/10 dark:border-outline-dark/10">
            <button
              v-for="category in categories"
              :key="category"
              @click="activeCategory = category"
              class="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              :class="activeCategory === category 
                ? 'bg-surface-light dark:bg-surface-dark text-primary-light dark:text-primary-dark shadow-sm' 
                : 'text-on-surface-variant-light dark:text-on-surface-variant-dark hover:text-on-surface-light dark:hover:text-on-surface-dark hover:bg-surface-light/50 dark:hover:bg-surface-dark/50'"
            >
              {{ category }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full md:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="検索..."
              class="w-full px-5 py-3 pl-11 rounded-xl bg-surface-container-light dark:bg-surface-container-dark border border-outline-light/30 dark:border-outline-dark/30 focus:border-primary-light dark:focus:border-primary-dark outline-none transition-colors text-on-surface-light dark:text-on-surface-dark"
            />
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant-light dark:text-on-surface-variant-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="filteredReleases.length > 0" class="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="release in filteredReleases"
            :key="release.id"
            class="group relative bg-surface-container-light dark:bg-surface-container-dark rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-outline-light/10 dark:border-outline-dark/10 overflow-hidden flex flex-col"
          >
            <div class="p-6 flex flex-col h-full">
              <!-- Top Row: Category & Version -->
              <div class="flex justify-between items-start mb-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getCategoryColor(release.category)]">
                  {{ release.category }}
                </span>
                <span class="text-xs font-mono text-on-surface-variant-light dark:text-on-surface-variant-dark bg-surface-light/50 dark:bg-surface-dark/50 px-2 py-1 rounded-md">
                  {{ release.version }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-2xl font-bold mb-3 text-on-surface-light dark:text-on-surface-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                {{ release.title }}
              </h3>

              <!-- Description -->
              <p class="text-on-surface-variant-light dark:text-on-surface-variant-dark text-sm leading-relaxed mb-6 flex-grow">
                {{ release.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span 
                  v-for="tag in release.tags" 
                  :key="tag"
                  class="px-2.5 py-1 bg-secondary-light/10 dark:bg-secondary-dark/10 text-secondary-light dark:text-secondary-dark rounded-md text-xs font-medium"
                >
                  #{{ tag }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-auto pt-4 border-t border-outline-light/10 dark:border-outline-dark/10">
                <a
                  :href="release.downloadUrl"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-light dark:bg-primary-dark text-white rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <a
                  v-if="release.githubUrl"
                  :href="release.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2.5 bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark rounded-xl border border-outline-light/20 dark:border-outline-dark/20 hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-colors active:scale-95"
                  aria-label="View on GitHub"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-light dark:bg-surface-container-dark mb-4">
            <svg class="w-8 h-8 text-on-surface-variant-light dark:text-on-surface-variant-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-on-surface-light dark:text-on-surface-dark mb-2">No releases found</h3>
          <p class="text-on-surface-variant-light dark:text-on-surface-variant-dark">
            Try adjusting your search or category filter
          </p>
        </div>

      </div>
    </section>
  </div>
</template>
