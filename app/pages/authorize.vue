<script setup lang="ts">
import type { Tokens } from '~/models/tokens'

definePageMeta({
  middleware: [
    (to) => {
      if (!to.query.code) {
        return navigateTo('/')
      }
    },
  ],
})

const route = useRoute()
const tokenStore = useTokenStore()

const code = route.query?.code

const { data } = await useFetch<Tokens>('/api/token', {
  query: {
    code,
  },
  server: false,
})

watch(data, () => {
  if (data.value) {
    tokenStore.accessToken = data.value.access_token
    tokenStore.refreshToken = data.value.refresh_token
  }

  navigateTo('/')
})
</script>

<template>
  <p>Loading...</p>
</template>
