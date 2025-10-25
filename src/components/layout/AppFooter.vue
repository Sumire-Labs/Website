<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="py-8 mt-auto">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-base text-on-surface-variant-light dark:text-on-surface-variant-dark">
        © {{ currentYear }} Sumire Labs. All rights reserved.
      </p>
    </div>
  </footer>
</template>
