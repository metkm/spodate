<script setup lang="ts">
import { motion } from 'motion-v'

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
  <motion.a
    :href="redirectUri"
    class="flex items-center text-(--ui-primary) bg-(--ui-primary)/10 hover:bg-(--ui-primary)/15 rounded-full transition-colors px-8 py-2 font-medium text-sm"
  >
    Login
  </motion.a>

  <!-- <UButton
    :to="redirectUri"
    class="px-8"
    variant="soft"
  >
    Login
  </UButton> -->
</template>
