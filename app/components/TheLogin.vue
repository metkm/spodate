<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

const config = useRuntimeConfig()

const url = new URL('https://accounts.spotify.com/authorize')

url.searchParams.append('client_id', config.public.SPOTIFY_CLIENT_ID)
url.searchParams.append('response_type', 'code')
url.searchParams.append('redirect_uri', config.public.SPOTIFY_REDIRECT_URI)

const redirectUri = url.toString()
</script>

<template>
  <UButton
    :to="redirectUri"
    class="px-8"
    variant="soft"
    size="xl"
  >
    Login
  </UButton>
</template>
