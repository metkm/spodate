<script setup lang="ts">
import type { Tokens } from './models/tokens'
import type { User } from './models/user'

const route = useRoute()
const tokenStore = useTokenStore()
const config = useRuntimeConfig()

const background = useState('background')

const code = route.query?.code as string | undefined

const { execute: fetchTokens } = await useFetch<Tokens>('/api/token', {
  query: {
    code,
  },
  server: false,
  immediate: false,
  onResponse: async (response) => {
    const data = response.response._data as Tokens

    tokenStore.accessToken = data.access_token
    tokenStore.refreshToken = data.refresh_token

    await navigateTo('/')
  },
})

onMounted(async () => {
  if (code) {
    await fetchTokens()
  }

  if (tokenStore.accessToken) {
    try {
      const response = await $fetch<User>(`${config.public.SPOTIFY_BASE_URI}/me`, {
        headers: {
          Authorization: `Bearer ${tokenStore.accessToken}`,
        },
      })

      background.value = response.images.at(0)?.url
    }
    catch {
      tokenStore.clear()
    }
  }
})
</script>

<template>
  <main class="flex max-w-4xl w-full mx-auto min-h-screen p-4">
    <ClientOnly>
      <TheLight v-if="background" />
    </ClientOnly>

    <NuxtPage />
  </main>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-inter: 'Inter', sans-serif;
}

html {
  scrollbar-gutter: stable;
  font-family: var(--font-inter);
}
</style>
