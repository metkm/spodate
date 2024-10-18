<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { Playlist } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'

const route = useRoute()
const query = useRouteQuery('q', '')
const container = useTemplateRef('container')

const queryDebounced = refDebounced(query, 500)
const items = ref<Playlist[]>([])
const offset = ref(0)
const limit = ref(20)

const { data, status, execute } = await useSpotifyFetch<SearchResponse>('/search', {
  key: 'playlists',
  query: {
    q: queryDebounced,
    offset: offset,
    type: 'playlist',
  },
  onResponse: (response) => {
    const data = response.response._data as SearchResponse
    items.value.push(...data.playlists.items)
  },
  watch: false,
  immediate: false,
})

const isLoading = computed(() => status.value === 'pending')

watch(queryDebounced, () => {
  if (queryDebounced.value) {
    execute()
  }
}, {
  immediate: true,
})

useInfiniteScroll(document?.getElementById('__nuxt'), async () => {
  if (!data.value) return

  limit.value = data.value.playlists.limit
  offset.value += limit.value

  execute()
}, {
  distance: 10,
  throttle: 1000,
  interval: 1000,
  canLoadMore: () => !!data.value?.playlists.next,
})
</script>

<template>
  <div>
    <ol
      v-if="data"
      ref="container"
      class="flex flex-col gap-2 overflow-y-auto grow"
    >
      <li
        v-for="item in items"
        :key="item.id"
      >
        <NuxtLink
          class="flex items-center gap-2"
          :to="{ name: 'playlist-id', params: { id: item.id }, query: route.query }"
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
    </ol>

    <UIcon
      v-if="isLoading"
      name="i-heroicons-arrow-path"
      class="animate-spin size-10 mx-auto mt-4"
    />
  </div>
</template>
