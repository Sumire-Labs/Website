<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
    <div class="text-center max-w-2xl">
      <!-- 404 Icon -->
      <div class="mb-8">
        <svg class="w-32 h-32 mx-auto text-primary-light dark:text-primary-dark opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="text-6xl md:text-8xl font-bold mb-4 text-primary-light dark:text-primary-dark">
        404
      </h1>

      <!-- Description -->
      <h2 class="text-2xl md:text-3xl font-semibold mb-4 text-on-surface-light dark:text-on-surface-dark">
        ページが見つかりません
      </h2>

      <p class="text-lg text-on-surface-variant-light dark:text-on-surface-variant-dark mb-8">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goHome"
          class="md3-button-filled"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          ホームに戻る
        </button>

        <button
          @click="goBack"
          class="md3-button-outlined"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          前のページに戻る
        </button>
      </div>

      <!-- Quick Links -->
      <div class="mt-12 pt-8 border-t border-outline-light/20 dark:border-outline-dark/20">
        <p class="text-sm text-on-surface-variant-light dark:text-on-surface-variant-dark mb-4">
          よく見られるページ
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <router-link to="/" class="text-primary-light dark:text-primary-dark hover:underline text-sm">
            ホーム
          </router-link>
          <span class="text-outline-light dark:text-outline-dark">•</span>
          <router-link to="/labs" class="text-primary-light dark:text-primary-dark hover:underline text-sm">
            Labs
          </router-link>
          <span class="text-outline-light dark:text-outline-dark">•</span>
          <router-link to="/wiki" class="text-primary-light dark:text-primary-dark hover:underline text-sm">
            Wiki
          </router-link>
          <span class="text-outline-light dark:text-outline-dark">•</span>
          <a href="https://discord.gg/H8eh2hR79e" target="_blank" rel="noopener noreferrer" class="text-primary-light dark:text-primary-dark hover:underline text-sm">
            Discord
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
