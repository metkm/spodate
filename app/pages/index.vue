<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { SearchResponse } from '~/models/search'

const route = useRoute()

const query = useRouteQuery('q', '')
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
</script>

<template>
  <UIcon
    v-if="isLoading"
    name="i-heroicons-arrow-path"
    class="animate-spin size-10 mx-auto mt-4"
  />
  <ol
    v-else-if="data"
    class="space-y-2"
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
