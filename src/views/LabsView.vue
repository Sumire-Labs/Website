<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGitHub } from '@/composables/useGitHub'

const { repositories, loading, error, fetchRepositories, formatDate } = useGitHub()
const searchQuery = ref('')

const filteredRepositories = computed(() => {
  if (!searchQuery.value) {
    return repositories.value
  }

  const query = searchQuery.value.toLowerCase()
  return repositories.value.filter((repo) => {
    return (
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      (repo.language && repo.language.toLowerCase().includes(query))
    )
  })
})

onMounted(() => {
  fetchRepositories()
})
</script>

<template>
  <div class="min-h-screen pt-24 bg-background-light dark:bg-background-dark">
    <!-- ヘッダーセクション -->
    <section class="relative py-16 md:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <!-- グラデーションタイトル -->
        <h1 class="text-5xl md:text-7xl font-bold mb-6 text-center bg-gradient-to-r from-secondary-light via-primary-light to-secondary-light dark:from-secondary-dark dark:via-primary-dark dark:to-secondary-dark bg-clip-text text-transparent animate-gradient">
          Sumire Labs
        </h1>
        <p class="text-lg md:text-xl text-on-surface-variant-light dark:text-on-surface-variant-dark text-center max-w-2xl mx-auto">
          プロジェクト一覧
        </p>
      </div>
    </section>

    <!-- リポジトリセクション -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
        <!-- 検索バー -->
        <div class="mb-8">
          <div class="relative max-w-2xl mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="リポジトリを検索..."
              class="w-full px-6 py-4 pl-12 rounded-md3-xl bg-surface-container-light dark:bg-surface-container-dark border border-outline-light/30 dark:border-outline-dark/30 focus:border-primary-light dark:focus:border-primary-dark outline-none transition-colors text-on-surface-light dark:text-on-surface-dark placeholder:text-on-surface-variant-light dark:placeholder:text-on-surface-variant-dark"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant-light dark:text-on-surface-variant-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- ローディング -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">リポジトリを読み込み中...</p>
        </div>

        <!-- エラー -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- リポジトリ一覧 -->
        <div v-else-if="filteredRepositories.length > 0" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="repo in filteredRepositories"
            :key="repo.id"
            class="md3-card p-6 flex flex-col"
          >
            <!-- リポジトリ名 -->
            <h3 class="text-xl font-bold mb-3">
              <a
                :href="repo.html_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-light dark:text-primary-dark hover:brightness-110 transition-all"
              >
                {{ repo.name }}
              </a>
            </h3>

            <!-- 説明 -->
            <p v-if="repo.description" class="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
              {{ repo.description }}
            </p>
            <p v-else class="text-gray-500 dark:text-gray-500 italic mb-4 flex-grow">
              説明がありません
            </p>

            <!-- メタ情報 -->
            <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <!-- スター数 -->
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ repo.stargazers_count }}</span>
              </div>

              <!-- 更新日 -->
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{{ formatDate(repo.updated_at) }}</span>
              </div>
            </div>

            <!-- タグ -->
            <div class="flex flex-wrap gap-2">
              <!-- 言語 -->
              <span
                v-if="repo.language"
                class="px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-md3-sm text-xs font-medium"
              >
                {{ repo.language }}
              </span>

              <!-- ライセンス -->
              <span
                v-if="repo.license"
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md3-sm text-xs font-medium"
              >
                {{ repo.license.spdx_id }}
              </span>

              <!-- トピック -->
              <span
                v-for="topic in repo.topics.slice(0, 3)"
                :key="topic"
                class="px-3 py-1 bg-secondary-light/10 dark:bg-secondary-dark/10 text-secondary-light dark:text-secondary-dark rounded-md3-sm text-xs font-medium"
              >
                {{ topic }}
              </span>
            </div>
          </article>
        </div>

        <!-- 検索結果なし -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">検索結果が見つかりませんでした</p>
        </div>
      </div>
    </section>
  </div>
</template>
