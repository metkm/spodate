<script setup lang="ts">
import type { Tokens } from './models/tokens'

const route = useRoute()
const tokenStore = useTokenStore()

const background = useState('background')

const code = route.query?.code as string | undefined

const { execute: fetchTokens, status: tokenFetchStatus } = await useFetch<Tokens>('/api/token', {
  query: {
    code,
  },
  server: false,
  immediate: false,
  onResponse: async (response) => {
    const data = response.response._data as Tokens

    tokenStore.accessToken = data.access_token
    tokenStore.refreshToken = data.refresh_token

    navigateTo('/', { replace: true })
  },
})

onMounted(() => {
  if (!code) return
  fetchTokens()
})
</script>

<template>
  <main class="flex max-w-4xl w-full mx-auto min-h-screen p-4">
    <ClientOnly>
      <TheLight v-if="background" />
    </ClientOnly>

    <NuxtPage :token-fetch-status="tokenFetchStatus" />
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
