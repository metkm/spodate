<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { SearchResponse } from '~/models/search'

const route = useRoute()
const query = useRouteQuery('q', '')
const container = useTemplateRef('container')

const queryDebounced = refDebounced(query, 500)

const { data, status, execute } = await useSpotifyFetch<SearchResponse>('/search', {
  key: 'playlists',
  query: {
    q: queryDebounced,
    type: 'playlist',
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

if (import.meta.client) {
  useInfiniteScroll(document.getElementById('__nuxt'), () => {
    console.log('at end')
  }, {
    distance: 10,
    throttle: 1000,
    canLoadMore: () => !!data.value?.playlists.next,
  })
}
</script>

<template>
  <UIcon
    v-if="isLoading"
    name="i-heroicons-arrow-path"
    class="animate-spin size-10 mx-auto mt-4"
  />
  <ol
    v-else-if="data"
    ref="container"
    class="flex flex-col gap-2 overflow-y-auto grow"
  >
    <li
      v-for="item in data?.playlists.items"
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
</template>
