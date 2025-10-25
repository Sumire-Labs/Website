import { ref, watch, onMounted } from 'vue'
import type { Theme } from '@/types'

const THEME_KEY = 'sumire-theme'

const theme = ref<Theme>('light')

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const initTheme = () => {
    // localStorageから読み込み
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      theme.value = savedTheme
    } else {
      // システム設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }

    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement

    if (theme.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(THEME_KEY, theme.value)
  }

  // テーマが変更されたら適用
  watch(theme, applyTheme)

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    toggleTheme,
    setTheme,
    initTheme,
  }
}
