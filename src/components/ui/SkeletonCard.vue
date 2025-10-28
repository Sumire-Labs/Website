<script setup lang="ts">
// Skeleton card component for loading states
// Optimized for performance with CSS-only animations
</script>

<template>
  <div class="md3-card p-6 md:p-8 animate-pulse">
    <!-- Date skeleton -->
    <div class="flex items-center gap-3 mb-4">
      <div class="h-4 w-24 bg-surface-container-high-light dark:bg-surface-container-high-dark rounded"></div>
    </div>

    <!-- Title skeleton -->
    <div class="space-y-3 mb-4">
      <div class="h-6 bg-surface-container-high-light dark:bg-surface-container-high-dark rounded w-3/4"></div>
    </div>

    <!-- Content skeleton -->
    <div class="space-y-2">
      <div class="h-4 bg-surface-container-high-light dark:bg-surface-container-high-dark rounded"></div>
      <div class="h-4 bg-surface-container-high-light dark:bg-surface-container-high-dark rounded w-5/6"></div>
      <div class="h-4 bg-surface-container-high-light dark:bg-surface-container-high-dark rounded w-4/5"></div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced pulse animation for better visual feedback */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Performance optimization */
.animate-pulse > * {
  will-change: opacity;
}
</style>
