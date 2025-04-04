<script setup lang="ts">
import { motion } from 'motion-v'
import type { Playlist } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'

const props = defineProps<{
  query: string
}>()

const storeToken = useTokenStore()

const items = ref<Playlist[]>([])

const { data, status, execute } = await useSpotifyFetch<SearchResponse>('/search', {
  key: 'playlists',
  query: {
    q: props.query,
    type: 'playlist',
  },
  onRequestError: () => {
    storeToken.clear()
  },
  onResponse: (response) => {
    const data = response.response._data as SearchResponse
    const results = data.playlists.items.filter(item => !!item)
    items.value.push(...results)
  },
  watch: false,
  immediate: false,
})
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="items.length > 0"
      layout
      class="grow"
      :initial="{ opacity: 0 }"
      :exit="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
    >
      <motion.ul class="flex flex-col gap-4">
        <motion.li
          v-for="i in 10"
          :key="i"
          class="flex gap-2"
        >
          <div class="size-24 bg-red-500 rounded-lg" />

          <div>
            <p>Song Title Here</p>
            <p class="text-(--ui-text-dimmed)">
              artist
            </p>
          </div>
        </motion.li>
      </motion.ul>
    </motion.div>
  </AnimatePresence>
</template>
