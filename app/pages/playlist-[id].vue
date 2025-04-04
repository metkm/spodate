<script setup lang="ts">
import type { UseFetchOptions } from 'nuxt/app'
import type { Pagination } from '~/models/pagination'
import type { PlaylistDetail } from '~/models/playlist'
import type { SearchResponse } from '~/models/search'
import type { TrackItem } from '~/models/track'

const router = useRouter()
const route = useRoute('playlist-id')
const id = route.params.id

const items = useState<TrackItem[]>(`playlist-items-${id}`, () => [])
const background = useState('background', () => '')

const offset = ref(0)
const limit = ref(20)

const { data: cache } = useNuxtData<SearchResponse>('playlists')
const { data } = await useSpotifyFetch<PlaylistDetail>(`/playlists/${id}`, {
  lazy: true,
  default: () => {
    return cache.value?.playlists.items.find(item => item?.id === id)
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
    const trackItems = data.items.filter(item => !!item.track)

    items.value.push(...trackItems)
  },
  immediate: false,
  watch: false,
})

useInfiniteScroll(
  document,
  () => {
    limit.value = data.value?.tracks?.limit || tracks.value?.limit || 20
    offset.value += limit.value

    execute()
  },
  {
    throttle: 1000,
    interval: 1000,
    distance: 50,
    canLoadMore: () =>
      status.value !== 'pending' && (!!tracks.value?.next || !!data.value?.tracks?.next),
  },
)
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div
      v-if="data"
      class="flex flex-col sm:flex-row gap-4"
    >
      <Motion :layout-id="`image-${data.id}`">
        <img
          :src="data.images?.at(0)?.url"
          class="w-full sm:size-44 lg:size-80 transition-all rounded"
        >
      </Motion>

      <div class="flex flex-col gap-4 justify-between py-2">
        <div class="flex flex-col gap-2 [&_span]:text-(--ui-text-dimmed)">
          <p class="lg:text-xl">
            {{ data.name }}
          </p>

          <p
            v-if="data.tracks?.total"
            class="bg-(--ui-bg-elevated) rounded-full w-fit px-4 py-1"
          >
            {{ data.tracks?.total }} <span>songs</span>
          </p>
          <p
            v-if="data.followers?.total"
            class="bg-(--ui-bg-elevated) rounded-full w-fit px-4 py-1"
          >
            {{ data.followers?.total }} <span>saves</span>
          </p>
        </div>

        <a
          :href="data.external_urls.spotify"
          target="_blank"
          class="bg-(--ui-bg-elevated) rounded-full w-fit px-4 py-1"
        >
          <span class="text-(--ui-text-dimmed)">Playlist by</span>
          {{ data.owner.display_name }}
        </a>
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

    <ol v-if="items">
      <li
        v-for="(item, index) in items"
        :key="item.track?.id"
        class="flex items-center gap-2 px-2 p-2 hover:bg-[var(--ui-color-neutral-100)]/10 rounded"
      >
        <p class="w-9 shrink-0 text-center">
          {{ index + 1 }}
        </p>

        <ExpandableImage
          v-if="item.track?.album.images.at(1)?.url"
          :src="item.track?.album.images.at(1)!.url"
        >
          <img
            :src="item.track?.album.images.at(1)?.url"
            class="size-20 lg:size-28 rounded"
          >
        </ExpandableImage>

        <div class="py-2">
          <p class="line-clamp-2 w-full">
            {{ item.track?.name }}
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
