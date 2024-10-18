<script setup lang="ts">
import type { UseFetchOptions } from 'nuxt/app'
import type { PlaylistDetail } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'
import type { TrackItem } from '~/models/track'

const router = useRouter()
const route = useRoute('playlist-id')
const id = route.params.id

const items = useState<TrackItem[]>(() => [])

const { data: cache } = useNuxtData<SearchResponse>('playlists')
const { data } = await useSpotifyFetch<PlaylistDetail>(`/playlists/${id}`, {
  lazy: true,
  default: () => {
    return cache.value?.playlists.items.find(item => item.id === id)
  },
  onResponse: (response) => {
    const data = response.response._data as PlaylistDetail
    items.value.push(...(data.tracks?.items || []))
  },
} as UseFetchOptions<PlaylistDetail>)
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
        <p>{{ data.name }}</p>
        <p>{{ data.owner.display_name }}</p>
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
        class="flex items-start gap-2"
      >
        <img
          :src="item.track.album.images.at(1)?.url"
          class="size-20 lg:size-28 rounded"
        >

        <p class="line-clamp-2 w-full">
          {{ item.track.name }}
        </p>
      </li>
    </ol>
  </div>
</template>
