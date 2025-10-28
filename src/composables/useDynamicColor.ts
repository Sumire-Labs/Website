/**
 * Material Design 3 Dynamic Color System
 * Adjusts theme colors based on time of day and user preferences
 */

import { ref, watch, onMounted, onUnmounted } from 'vue'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

interface ColorScheme {
  primary: string
  secondary: string
}

const COLOR_SCHEMES: Record<TimeOfDay, ColorScheme> = {
  morning: {
    primary: '#FF9800', // Warm orange for morning
    secondary: '#FFB74D',
  },
  afternoon: {
    primary: '#5865F2', // Default Discord blue
    secondary: '#8B5CF6',
  },
  evening: {
    primary: '#F06292', // Soft pink for evening
    secondary: '#CE93D8',
  },
  night: {
    primary: '#9FA8DA', // Cool indigo for night
    secondary: '#B39DDB',
  },
}

export function useDynamicColor() {
  const currentTimeOfDay = ref<TimeOfDay>('afternoon')
  const dynamicColorEnabled = ref(false)
  let updateInterval: number | null = null

  const getTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours()

    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  const applyColorScheme = (timeOfDay: TimeOfDay) => {
    if (!dynamicColorEnabled.value) return

    const scheme = COLOR_SCHEMES[timeOfDay]
    const root = document.documentElement

    // Apply colors with CSS custom properties for smooth transitions
    root.style.setProperty('--dynamic-primary-light', scheme.primary)
    root.style.setProperty('--dynamic-secondary-light', scheme.secondary)
  }

  const updateTimeOfDay = () => {
    const newTimeOfDay = getTimeOfDay()
    if (newTimeOfDay !== currentTimeOfDay.value) {
      currentTimeOfDay.value = newTimeOfDay
      applyColorScheme(newTimeOfDay)
    }
  }

  const enableDynamicColor = () => {
    dynamicColorEnabled.value = true
    localStorage.setItem('dynamicColorEnabled', 'true')
    updateTimeOfDay()
  }

  const disableDynamicColor = () => {
    dynamicColorEnabled.value = false
    localStorage.setItem('dynamicColorEnabled', 'false')

    // Reset to default colors
    const root = document.documentElement
    root.style.removeProperty('--dynamic-primary-light')
    root.style.removeProperty('--dynamic-secondary-light')
  }

  const toggleDynamicColor = () => {
    if (dynamicColorEnabled.value) {
      disableDynamicColor()
    } else {
      enableDynamicColor()
    }
  }

  const initDynamicColor = () => {
    // Load saved preference
    const saved = localStorage.getItem('dynamicColorEnabled')
    if (saved === 'true') {
      enableDynamicColor()
    }

    // Update every 10 minutes to catch time changes
    updateInterval = window.setInterval(() => {
      if (dynamicColorEnabled.value) {
        updateTimeOfDay()
      }
    }, 10 * 60 * 1000) // 10 minutes
  }

  const cleanup = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  return {
    currentTimeOfDay,
    dynamicColorEnabled,
    enableDynamicColor,
    disableDynamicColor,
    toggleDynamicColor,
    initDynamicColor,
    cleanup,
  }
}
