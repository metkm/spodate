<script setup lang="ts">
import { formatTimeAgo, createReusableTemplate, useImage, useInfiniteScroll } from '@vueuse/core';
import { ArrowLeftIcon } from '@radix-icons/vue';
import type { Playlist, Playlists } from '~/models/playlist';
import type { Pagination } from '~/models/pagination';
import type { TrackItem } from '~/models/track';

const selectedPlaylist = useState<Playlist>('playlist:selected');
const router = useRouter();
const route = useRoute('playlist-id');
const id = route.params.id;

const config = useRuntimeConfig();
const tokenStore = useTokenStore();
const { data, error, status } = await useSpotifyFetch<Playlists>(`/playlists/${id}`, {
  lazy: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  default: () => (selectedPlaylist.value
    ? {
        ...selectedPlaylist.value,
        tracks: undefined,
        followers: {
          href: null,
          total: 0,
        },
      }
    : undefined),
});
const { isReady } = useImage({ src: data.value?.images?.at(0)?.url || '' });

const LIMIT = 20;
let offset = data.value?.tracks?.items?.length || LIMIT;

const { isLoading } = useInfiniteScroll(document, async () => {
  const response = await $fetch<Pagination<TrackItem>>(`${config.public.SPOTIFY_BASE_URI}/playlists/${id}/tracks`, {
    query: {
      offset,
      limit: LIMIT,
    },
    headers: {
      Authorization: `Bearer ${tokenStore.accessToken}`,
    },
  });

  data.value?.tracks?.items.push(...response.items);
  offset += 20;
}, {
  canLoadMore: () => {
    return data.value?.tracks ? (offset < data.value?.tracks?.total) : false;
  },
});

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      class="w-fit"
      @click="router.back()"
    >
      <ArrowLeftIcon class="mr-2 size-4" />
      Back
    </Button>

    <template v-if="data">
      <div class="z-50 flex flex-wrap gap-2">
        <img
          :src="data?.images?.at(0)?.url"
          class="object-cover transition-all rounded shadow size-64"
          :style="{ viewTransitionName: `cover-${id}` }"
        >

        <div class="flex flex-col p-2">
          <p
            class="text-xl font-semibold w-fit"
            :style="{
              viewTransitionName: `title-${removeSpecialCharacters(data?.name || '')}-${data?.id}`,
            }"
          >
            {{ data?.name }}
          </p>

          <ul class="flex gap-8 pl-5 list-disc opacity-50">
            <li>{{ data?.followers.total }} saves</li>
            <li>{{ data?.tracks?.total }} songs</li>
          </ul>

          <a
            :href="data?.owner.uri"
            class="mt-auto opacity-50 w-fit"
            :style="{
              viewTransitionName: `by-${removeSpecialCharacters(data?.owner.display_name || '')}-${data?.id}`,
            }"
          >
            by {{ data?.owner.display_name }}
          </a>
        </div>
      </div>

      <ReloadIcon
        v-if="status === 'pending'"
        class="size-[18px] text-muted-foreground animate-spin"
      />
      <ol v-else>
        <li
          v-for="(item, index) in data.tracks?.items"
          :key="item.track?.id"
          class="flex items-center gap-4 p-2 hover:bg-neutral-200/20"
        >
          <p class="w-8 text-right shrink-0">
            #{{ index + 1 }}
          </p>

          <img
            :src="item.track?.album?.images.at(0)?.url"
            class="object-cover rounded size-20"
          >

          <div class="w-full overflow-x-hidden">
            <p>
              {{ item.track?.name }}
            </p>

            <p class="text-sm opacity-50">
              {{ formatTimeAgo(new Date(item.added_at)) }} - {{ item.added_at }}
            </p>
          </div>
        </li>
      </ol>

      <p v-if="isLoading">
        Loading...
      </p>
    </template>
    <p v-else>
      Something happened while loading the playlist {{ error }}
    </p>

    <DefineTemplate>
      <img
        :src="data?.images?.at(0)?.url"
        class="absolute object-cover w-1/2 rounded-full aspect-square animate-spin blur-[120px] duration-15000"
      >
    </DefineTemplate>

    <div
      v-if="isReady"
      class="absolute inset-0 max-w-4xl mx-auto pointer-events-none animation-appear -z-10"
    >
      <ReuseTemplate class="direction-reverse" />
      <ReuseTemplate class="right-0 w-3/5" />
    </div>
  </div>
</template>

<style>
.animation-appear {
  animation: appear 2.5s cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes appear {
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}
</style>
