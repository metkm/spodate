<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const query = useRouteQuery('q', '')
const tokenStore = useTokenStore()

const background = useState('background')

const handleClick = () => {
  navigateTo({
    name: 'index',
    query: {
      q: query.value,
    },
  })
}
</script>

<template>
  <main class="flex flex-col gap-4 min-h-screen max-w-4xl p-4 mx-auto text-sm">
    <NuxtLoadingIndicator />

    <ClientOnly>
      <TheLight v-if="background" />
    </ClientOnly>

    <div class="flex gap-4 w-full">
      <TheLogin v-if="!tokenStore.accessToken" />
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search.."
        size="lg"
        class="grow"
        :disabled="!tokenStore.accessToken"
        @click="handleClick"
      />
    </div>

    <NuxtPage />
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

.page-enter-active,
.page-leave-active {
  transition: all 150ms;
}
.page-enter-from,
.page-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
