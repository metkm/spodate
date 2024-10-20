<script setup lang="ts">
import type { UseFetchOptions } from 'nuxt/app'
import type { Pagination } from '~/models/pagination'
import type { PlaylistDetail } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'
import type { TrackItem } from '~/models/track'

const router = useRouter()
const route = useRoute('playlist-id')
const id = route.params.id

const items = useState<TrackItem[]>(() => [])
const background = useState('background', () => '')

const offset = ref(0)
const limit = ref(20)

const { data: cache } = useNuxtData<SearchResponse>('playlists')
const { data } = await useSpotifyFetch<PlaylistDetail>(`/playlists/${id}`, {
  lazy: true,
  default: () => {
    return cache.value?.playlists.items.find(item => item.id === id)
  },
  onResponse: (response) => {
    const data = response.response._data as PlaylistDetail
    items.value.push(...(data.tracks?.items || []))
    background.value = data.images?.at(0)?.url || ''
  },
} as UseFetchOptions<PlaylistDetail>)

const {
  data: tracks,
  execute,
  status,
} = await useSpotifyFetch<Pagination<TrackItem>>(`/playlists/${id}/tracks`, {
  query: {
    offset,
    limit,
  },
  onResponse: (response) => {
    const data = response.response._data as Pagination<TrackItem>
    items.value.push(...data.items)
  },
  immediate: false,
  watch: false,
})

useInfiniteScroll(
  document,
  () => {
    limit.value = tracks.value?.limit || 20
    offset.value += limit.value

    execute()
  },
  {
    throttle: 1000,
    interval: 1000,
    canLoadMore: () =>
      status.value !== 'pending' && (!!tracks.value?.next || !!data.value?.tracks?.next)
    ,
  },
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="data"
      class="flex gap-4"
    >
      <img
        :src="data.images?.at(0)?.url"
        class="size-44 lg:size-80 transition-all rounded"
      >

      <div class="flex flex-col justify-between py-2">
        <div>
          <p class="text-xl">
            {{ data.name }}
          </p>

          <div class="text-[var(--ui-text-dimmed)]">
            <p v-if="data.tracks?.total">
              {{ data.tracks?.total }} songs
            </p>
            <p v-if="data.followers?.total">
              {{ data.followers?.total }} saves
            </p>
          </div>
        </div>

        <p><span class="text-[var(--ui-text-dimmed)]">Playlist by </span>{{ data.owner.display_name }}</p>
      </div>
    </div>

    <UButton
      block
      class="w-24"
      leading-icon="i-heroicons-arrow-left-circle"
      @click="router.back()"
    >
      Back
    </UButton>

    <ol
      v-if="items"
      class="flex flex-col gap-2"
    >
      <li
        v-for="item in items"
        :key="item.track.id"
        class="flex items-start gap-2 hover:bg-[var(--ui-color-neutral-100)]/10 rounded"
      >
        <img
          :src="item.track.album.images.at(1)?.url"
          class="size-20 lg:size-28 rounded"
        >

        <div class="py-2">
          <p class="line-clamp-2 w-full">
            {{ item.track.name }}
          </p>

          <ClientOnly>
            <p class="text-[var(--ui-text-dimmed)]">
              Added at {{ new Date(item.added_at).toLocaleString() }}
            </p>
          </ClientOnly>
        </div>
      </li>

      <TheLoadingSpinner v-if="status === 'pending'" />
    </ol>
  </div>
</template>
