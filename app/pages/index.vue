<script setup lang="ts">
import { motion } from 'motion-v'
import type { AsyncDataRequestStatus } from '#app'
import type { SearchResponse } from '~/models/search'
import type { Playlist } from '~/models/playlist'
import { fadeInVariant } from '~/variants'

defineProps<{
  tokenFetchStatus?: AsyncDataRequestStatus
}>()

defineShortcuts({
  '/': () => {
    queryElement.value?.inputRef?.focus()
  },
})

const storeToken = useTokenStore()
const queryElement = useTemplateRef('query-element')

const query = useRouteQuery('q') as Ref<string | undefined>
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
    storeToken.clear()
  }
}, {
  immediate: true,
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
    <div class="fixed top-5 right-5">
      <TheColorModeSwitch />
    </div>

    <LayoutGroup>
      <AnimatePresence>
        <motion.div
          layout
          class="flex flex-col gap-2 rounded-lg sticky top-4"
          :variants="fadeInVariant"
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
                    :variants="fadeInVariant"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
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
                    ref="query-element"
                    v-model="query"
                    icon="i-heroicons-magnifying-glass"
                    class="w-full"
                    variant="soft"
                    size="xl"
                    placeholder="write here"
                    :loading="status === 'pending'"
                    :disabled="!storeToken.accessToken"
                  >
                    <template
                      #trailing
                    >
                      <UButton
                        v-if="query"
                        color="neutral"
                        variant="link"
                        icon="i-lucide-circle-x"
                        aria-label="Clear input"
                        @click="query = ''"
                      />
                      <UKbd
                        value="/"
                        size="lg"
                      />
                    </template>
                  </UInput>
                </Motion>
              </motion.div>

              <Motion
                v-if="!storeToken.accessToken"
                :variants="fadeInVariant"
                layout
              >
                <TheLogin
                  class="w-full"
                  block
                />
              </Motion>

              <motion.div
                v-if="!queryDebounced"
                layout
                class="flex gap-2"
                :exit="{ opacity: 0 }"
              >
                <UButton
                  to="https://github.com/metkm/spodate"
                  icon="i-grommet-icons-github"
                  size="lg"
                  variant="ghost"
                  square
                  target="_blank"
                  color="neutral"
                />
                <UButton
                  to="https://www.linkedin.com/in/metkm/"
                  icon="i-grommet-icons-linkedin-option"
                  size="lg"
                  square
                  target="_blank"
                  variant="ghost"
                  color="neutral"
                />
              </motion.div>
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
              <ExpandableImage
                :src="item.images?.at(0)?.url"
                hold-key="Shift"
                class="size-20 rounded shrink-0"
              />

              <div>
                <motion.p :layout-id="`title-${item.id}`">{{ item.name }}</motion.p>
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
