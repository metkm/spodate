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

const { status, error, execute, clear } = await useSpotifyFetch<SearchResponse>('/search', {
  key: 'playlists',
  query: {
    q: queryDebounced,
    type: 'playlist',
  },
  onRequest() {
    items.value = []
  },
  onResponse({ response }) {
    const data = response._data as SearchResponse
    const results = data.playlists.items.filter(item => !!item)
    items.value.push(...results)
  },
  watch: false,
  immediate: false,
})

watch(queryDebounced, async () => {
  if (!queryDebounced.value) {
    items.value = []
    return
  }

  try {
    await execute()
  }
  catch {
    console.log('error')
    storeToken.clear()
  }
})

watch(error, () => {
  if (!error.value) return
  clear()
  storeToken.clear()
  query.value = ''
})
</script>

<template>
  <div class="flex flex-col gap-4 justify-center w-full max-w-2xl mx-auto">
    <LayoutGroup>
      <AnimatePresence>
        <motion.div
          layout
          class="flex flex-col gap-2 rounded-lg sticky top-4"
        >
          <LayoutGroup>
            <AnimatePresence>
              <motion.div
                layout
                class="grow"
              >
                <AnimatePresence>
                  <motion.h1
                    v-if="!queryDebounced"
                    class="font-medium text-xl w-fit mx-auto mb-2"
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                    :exit="{ opacity: 0 }"
                    layout="position"
                  >
                    Search a playlist
                  </motion.h1>
                </AnimatePresence>

                <Motion
                  as-child
                  layout
                >
                  <UInput
                    v-model="query"
                    icon="i-heroicons-magnifying-glass"
                    class="w-full"
                    variant="soft"
                    size="xl"
                    placeholder="write here"
                    :loading="status === 'pending'"
                    :disabled="!storeToken.accessToken"
                  />
                </Motion>
              </motion.div>

              <Motion
                v-if="!storeToken.accessToken"
                :exit="{ opacity: 0 }"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                layout
              >
                <TheLogin
                  class="w-full"
                  block
                />
              </Motion>
            </AnimatePresence>
          </LayoutGroup>
        </motion.div>

        <motion.ul
          v-if="items.length > 0"
          :initial="{ opacity: 0, transition: { delay: 0.250 } }"
          :animate="{ opacity: 1, transition: { delay: 0.250 } }"
          :exit="{ opacity: 0 }"
          layout
          class="flex flex-col gap-4 grow"
        >
          <li
            v-for="item in items"
            :key="item.id"
          >
            <NuxtLink
              class="flex items-center gap-2 hover:bg-[var(--ui-color-neutral-100)]/10 rounded"
              :to="{ name: 'playlist-id', params: { id: item.id } }"
            >
              <motion.img
                :src="item.images?.at(0)?.url"
                class="size-20 rounded"
                :layout-id="`image-${item.id}`"
              />

              <div>
                <p>{{ item.name }}</p>
                <p class="text-sm">
                  {{ item.owner.display_name }}
                </p>
              </div>
            </NuxtLink>
          </li>
        </motion.ul>
      </AnimatePresence>
    </LayoutGroup>
  </div>
</template>
