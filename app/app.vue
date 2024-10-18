<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const query = useRouteQuery('q', '')
const tokenStore = useTokenStore()
</script>

<template>
  <main class="flex flex-col gap-4 max-w-4xl min-h-screen p-4 mx-auto overflow-x-hidden">
    <NuxtLoadingIndicator />

    <div class="flex gap-4 w-full">
      <TheLogin v-if="!tokenStore.accessToken" />
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search.."
        size="lg"
        class="grow"
        :disabled="!tokenStore.accessToken"
      />
    </div>

    <NuxtPage keepalive />
  </main>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-family-sans: 'Inter', sans-serif;
}

html {
  scrollbar-gutter: stable;
}
</style>
