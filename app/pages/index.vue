<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { Playlist } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'

const query = useRouteQuery('q', '')
const router = useRouter()
const route = useRoute()

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
    const results = data.playlists.items.filter(item => !!item)

    items.value.push(...results)
  },
  watch: false,
  immediate: false,
})

const isLoading = computed(() => status.value === 'pending')

watch(
  queryDebounced,
  async () => {
    items.value = []

    if (!queryDebounced.value) {
      return
    }

    execute()
  },
  {
    immediate: true,
  },
)

useInfiniteScroll(
  document,
  async () => {
    if (!data.value) return

    limit.value = data.value.playlists.limit
    offset.value += limit.value

    execute()
  },
  {
    throttle: 1000,
    interval: 1000,
    distance: 20,
    canLoadMore: () =>
      !!data.value?.playlists.next
      && router.currentRoute.value.name === 'index'
      && status.value !== 'pending',
  },
)
</script>

<template>
  <div class="flex flex-col grow">
    <ol
      v-if="data"
      ref="container"
      class="flex flex-col gap-2 overflow-y-auto"
    >
      <li
        v-for="item in items"
        :key="item.id"
      >
        <NuxtLink
          class="flex items-center gap-2 hover:bg-[var(--ui-color-neutral-100)]/10 rounded"
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

    <TheLoadingSpinner v-if="isLoading" />
    <p
      v-else-if="!queryDebounced"
      class="self-center"
    >
      Search Something
    </p>
  </div>
</template>
