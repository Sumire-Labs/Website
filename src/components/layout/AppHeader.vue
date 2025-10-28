<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Menu Timing Configuration
const MENU_OPEN_DELAY = 150 // ms - delay before opening menu on hover
const MENU_CLOSE_DELAY = 200 // ms - delay before closing menu on leave

const { theme, toggleTheme, dynamicColor } = useTheme()
const menuOpen = ref(false)
const hoverTimer = ref<number | null>(null)
const isScrolled = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const openMenu = () => {
  // ホバー時に少し遅延を入れて開く（誤操作防止）
  if (hoverTimer.value) clearTimeout(hoverTimer.value)
  hoverTimer.value = window.setTimeout(() => {
    menuOpen.value = true
  }, MENU_OPEN_DELAY)
}

const keepMenuOpen = () => {
  // メニューまたはボタンにホバーしている間は閉じない
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

const closeMenu = () => {
  // ボタンまたはメニューから離れた時に閉じる
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  // 少し遅延を入れて閉じる（メニューへの移動時間を確保）
  hoverTimer.value = window.setTimeout(() => {
    menuOpen.value = false
  }, MENU_CLOSE_DELAY)
}

const forceClose = () => {
  // 即座に閉じる（リンククリック時など）
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  menuOpen.value = false
}

// Handle scroll for header elevation
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Add scroll listener on mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

// Cleanup timer on unmount to prevent memory leaks
onUnmounted(() => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
  }
  window.removeEventListener('scroll', handleScroll)
})

const socialLinks = [
  {
    name: 'Discord',
    url: 'https://discord.gg/H8eh2hR79e',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>'
  },
  {
    name: 'X',
    url: 'https://x.com/sumiresaba_',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Sumire-Labs',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
  },
  {
    name: 'YouTube',
    url: 'https://youtu.be/qL31ZOqiXvc?si=8WSmLQS5iLT3AC0s',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
  },
]
</script>

<template>
  <header class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-4rem)] xl:max-w-[calc(100%-6rem)] transition-all duration-300">
    <div
      class="bg-surface-light/70 dark:bg-surface-dark/70 backdrop-blur-xl rounded-full border border-outline-light/20 dark:border-outline-dark/20 px-6 py-3 transition-all duration-300"
      :class="isScrolled ? 'shadow-md3-3' : 'shadow-lg'"
    >
      <div class="flex items-center justify-between">
        <!-- ロゴ -->
        <router-link to="/" class="hover:opacity-80 transition-opacity" @click="forceClose" aria-label="ホームページに戻る">
          <picture>
            <source srcset="/sumire_icon_40.avif" type="image/avif">
            <source srcset="/sumire_icon_40.webp" type="image/webp">
            <img
              src="/sumire_icon_40.png"
              alt="すみれさば ロゴ"
              width="40"
              height="40"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="w-10 h-10 rounded-lg"
            />
          </picture>
        </router-link>

        <div class="flex items-center gap-2">
          <!-- ハンバーガーメニューボタン -->
          <button
            @click="toggleMenu"
            @mouseenter="openMenu"
            @mouseleave="closeMenu"
            v-ripple
            class="p-2 rounded-lg hover:bg-surface-container-light dark:hover:bg-surface-container-dark transition-colors active:scale-95"
            aria-label="メニュー"
          >
            <svg
              class="w-6 h-6 text-on-surface-light dark:text-on-surface-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!menuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ハンバーガーメニュー（ポップアップスタイル） -->
    <transition
      enter-active-class="transition-[opacity,transform] duration-300 ease-spring"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-[opacity,transform] duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        @mouseenter="keepMenuOpen"
        @mouseleave="closeMenu"
        class="absolute top-20 right-4 w-72 origin-top-right bg-surface-light/70 dark:bg-surface-dark/70 backdrop-blur-xl rounded-2xl shadow-md3-3 border border-outline-light/20 dark:border-outline-dark/20"
      >
        <nav class="p-4">
          <!-- ナビゲーションリンク -->
          <div class="flex flex-col space-y-1 mb-3">
            <router-link
              to="/"
              @click="forceClose"
              v-ripple
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color,color] text-on-surface-light dark:text-on-surface-dark font-medium text-sm active:scale-95"
              active-class="bg-surface-container-high-light dark:bg-surface-container-high-dark text-primary-light dark:text-primary-dark"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </router-link>
            <router-link
              to="/labs"
              @click="forceClose"
              v-ripple
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color,color] text-on-surface-light dark:text-on-surface-dark font-medium text-sm active:scale-95"
              active-class="bg-surface-container-high-light dark:bg-surface-container-high-dark text-primary-light dark:text-primary-dark"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Labs
            </router-link>
            <router-link
              to="/wiki"
              @click="forceClose"
              v-ripple
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color,color] text-on-surface-light dark:text-on-surface-dark font-medium text-sm active:scale-95"
              active-class="bg-surface-container-high-light dark:bg-surface-container-high-dark text-primary-light dark:text-primary-dark"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Wiki
            </router-link>
          </div>

          <hr class="border-outline-light/20 dark:border-outline-dark/20 my-3" />

          <!-- ダイナミックカラー切り替え -->
          <div class="px-3 py-2.5 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-on-surface-light dark:text-on-surface-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span class="text-on-surface-light dark:text-on-surface-dark font-medium text-sm">
                  時刻で色変更
                </span>
              </div>
              <button
                @click="dynamicColor.toggleDynamicColor"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2"
                :class="dynamicColor.dynamicColorEnabled.value ? 'bg-primary-dark' : 'bg-gray-300'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="dynamicColor.dynamicColorEnabled.value ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>

          <hr class="border-outline-light/20 dark:border-outline-dark/20 my-3" />

          <!-- テーマ切り替え（トグルスイッチ） -->
          <div class="px-3 py-2.5 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-on-surface-light dark:text-on-surface-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span class="text-on-surface-light dark:text-on-surface-dark font-medium text-sm">
                  {{ theme === 'dark' ? 'ダークモード' : 'ライトモード' }}
                </span>
              </div>
              <button
                @click="toggleTheme"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2"
                :class="theme === 'dark' ? 'bg-primary-dark' : 'bg-gray-300'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="theme === 'dark' ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>

          <hr class="border-outline-light/20 dark:border-outline-dark/20 my-3" />

          <!-- SNSリンク（横並び） -->
          <div class="flex items-center justify-center gap-2 px-3">
            <a
              v-for="link in socialLinks"
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="link.name"
              class="p-2 rounded-lg hover:bg-surface-container-high-light dark:hover:bg-surface-container-high-dark transition-[background-color] group"
            >
              <span class="text-on-surface-variant-light dark:text-on-surface-variant-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors w-5 h-5 flex items-center justify-center" v-html="link.svg"></span>
            </a>
          </div>
        </nav>
      </div>
    </transition>

  </header>
</template>
