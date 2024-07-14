<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core';
import { ArrowLeftIcon } from '@radix-icons/vue';
import type { Playlists } from '~/models/playlist';

const route = useRoute('playlist-id');
const id = route.params.id;

const { data } = await useSpotifyFetch<Playlists>(`/playlists/${id}`);
</script>

<template>
  <div class="relative flex flex-col gap-4">
    <Button
      as-child
      class="w-fit"
    >
      <NuxtLink
        to="/"
        class="flex items-center"
      >
        <ArrowLeftIcon class="mr-2 size-4" />
        Back
      </NuxtLink>
    </Button>

    <div class="z-50 flex gap-2">
      <img
        :src="data?.images?.at(0)?.url"
        class="transition-all rounded shadow size-64"
        :style="{ viewTransitionName: `cover-${id}` }"
      >

      <div class="flex flex-col p-2">
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

        <a
          :href="data?.owner.uri"
          class="mt-auto opacity-50"
        >
          Playlist by {{ data?.owner.display_name }}
        </a>
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

    <img
      :src="data?.images?.at(0)?.url"
      class="absolute object-cover w-full blur-[200px] h-72 pointer-events-none"
    >
  </div>
</template>
