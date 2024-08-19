<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import type { SearchResponse } from '~/models/search';
import type { Tokens } from '~/models/tokens';

const tokenStore = useTokenStore();
const route = useRoute();
const code = route.query.code?.toString();

const loading = ref(false);
const query = ref('');
const queryDebounced = refDebounced(query, 1000);

const { data, status, execute, clear } = await useSpotifyFetch<SearchResponse>(
  '/search',
  {
    key: 'playlists',
    query: {
      q: queryDebounced,
      type: 'playlist',
    },
    watch: false,
    immediate: false,
  },
);

watch(queryDebounced, () => {
  if (!queryDebounced.value) {
    clear();
    return;
  }

  execute();
});

onMounted(async () => {
  if (!code) return;
  loading.value = true;

  try {
    const response = await $fetch<Tokens>('/api/token', {
      query: {
        code,
      },
    });

    tokenStore.accessToken = response.access_token;
    tokenStore.refreshToken = response.refresh_token;
  }
  finally {
    loading.value = false;
    await navigateTo('/');
  }
});
</script>

<template>
  <div class="flex flex-col w-full gap-4">
    <div class="flex justify-center gap-4">
      <TheLoginButton
        v-if="!tokenStore.accessToken"
        :loading="loading"
      />

      <div class="relative items-center w-full">
        <UInput
          id="search"
          v-model="query"
          type="text"
          placeholder="Search..."
          leading-icon="i-heroicons-magnifying-glass-16-solid"
          size="lg"
          :disabled="!tokenStore.accessToken"
          :loading="status === 'pending'"
        />
      </div>
    </div>

    <ol v-if="data">
      <li
        v-for="item in data.playlists.items"
        :key="item.id"
        class="rounded hover:bg-neutral-200/20"
      >
        <NuxtLink
          :to="{ name: 'playlist-id', params: { id: item.id } }"
          class="flex items-center w-full gap-2 p-2 text-left"
        >
          <img
            :src="item.images?.at(0)?.url"
            class="object-cover rounded size-20"
            :style="{ viewTransitionName: `cover-${item.id}` }"
          >

          <div>
            <p
              class="w-fit"
              :style="{
                viewTransitionName: `title-${removeSpecialCharacters(item.name)}-${item.id}`,
              }"
            >
              {{ item.name }}
            </p>
            <p
              class="text-sm opacity-50 w-fit"
              :style="{
                viewTransitionName: `by-${removeSpecialCharacters(item.owner.display_name)}-${item.id}`,
              }"
            >
              By {{ item.owner.display_name }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>
