<script setup lang="ts">
import { motion } from 'motion-v'
import type { AsyncDataRequestStatus } from '#app'
import type { SearchResponse } from '~/models/search'
import type { Playlist } from '~/models/playlist'

defineProps<{
  tokenFetchStatus?: AsyncDataRequestStatus
}>()

const storeToken = useTokenStore()

const query = ref('')
const queryDebounced = refDebounced(query, 500)

const items = ref<Playlist[]>([])

const { status, execute } = await useSpotifyFetch<SearchResponse>('/search', {
  key: 'playlists',
  query: {
    q: queryDebounced,
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

watch(queryDebounced, () => {
  if (!queryDebounced.value) {
    items.value = []
    return
  }

  execute()
})
</script>

<template>
  <motion.div class="flex flex-col gap-4 justify-center p-4 w-full max-w-2xl mx-auto">
    <LayoutGroup>
      <motion.div
        layout
        class="flex items-center gap-2 rounded-lg sticky top-4"
      >
        <LayoutGroup>
          <div class="flex flex-col gap-2 grow">
            <AnimatePresence>
              <motion.h1
                v-if="!queryDebounced"
                class="font-medium text-xl text-center"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
              >
                Search a playlist
              </motion.h1>
            </AnimatePresence>

            <VSearch
              v-model="query"
              :layout-dependency="storeToken.accessToken"
              :disabled="!storeToken.accessToken"
              :is-loading="status === 'pending'"
            />
          </div>

          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              <TheLogin v-if="!storeToken.accessToken" />
            </AnimatePresence>
          </LayoutGroup>
        </LayoutGroup>
      </motion.div>

      <motion.div
        v-if="items.length > 0"
        class="grow"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
      >
        <motion.ul class="flex flex-col gap-4">
          <li
            v-for="item in items"
            :key="item.id"
          >
            <NuxtLink
              class="flex items-center gap-2 hover:bg-[var(--ui-color-neutral-100)]/10 rounded"
              :to="{ name: 'playlist-id', params: { id: item.id } }"
            >
              <img
                :src="item.images?.at(0)?.url"
                class="size-20 rounded"
              >

              <div>
                <p>{{ item.name }}</p>
                <p class="text-sm">
                  {{ item.owner.display_name }}
                </p>
              </div>
            </NuxtLink>
          </li>
        </motion.ul>
      </motion.div>
    </LayoutGroup>
  </motion.div>
</template>
