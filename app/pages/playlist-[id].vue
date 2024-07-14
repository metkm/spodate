<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core';
import type { Playlists } from '~/models/playlist';

const route = useRoute('playlist-id');
const id = route.params.id;

const { data } = await useSpotifyFetch<Playlists>(`/playlists/${id}`);
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-2">
      <img
        :src="data?.images?.at(0)?.url"
        class="transition-all rounded shadow size-64 hover:size-96"
        :style="{ viewTransitionName: `cover-${id}` }"
      >

      <div class="p-2">
        <p class="text-xl font-semibold">
          {{ data?.name }}
        </p>

        <ul class="flex gap-8 pl-5 list-disc opacity-50">
          <li>
            {{ data?.followers.total }} saves
          </li>
          <li>
            {{ data?.tracks.total }} songs
          </li>
        </ul>
      </div>
    </div>

    <ol
      v-if="data"
      class="divide-y"
    >
      <li
        v-for="item in data.tracks.items"
        :key="item.track.id"
        class="flex items-center gap-2 p-2 hover:bg-neutral-200"
      >
        <img
          :src="item.track.album.images.at(0)?.url"
          class="object-cover rounded size-20"
        >

        <div>
          <p>{{ item.track.name }}</p>

          <p class="text-sm opacity-50">
            {{ formatTimeAgo(new Date(item.added_at)) }} - {{ item.added_at }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
