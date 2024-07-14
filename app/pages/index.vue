<script setup lang="ts">
import { MagnifyingGlassIcon, ReloadIcon } from '@radix-icons/vue';
import { refDebounced } from '@vueuse/core';
import type { SearchResponse } from '~/models/search';
import type { Tokens } from '~/models/tokens';

const tokenStore = useTokenStore();
const route = useRoute();
const code = route.query.code?.toString();

const loading = ref(false);
const query = ref('');
const queryDebounced = refDebounced(query, 1000);

const { data, status, execute } = await useSpotifyFetch<SearchResponse>('/search', {
  query: {
    q: queryDebounced,
    type: 'playlist',
  },
  watch: false,
  immediate: false,
});

watch(queryDebounced, () => execute());

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
        <Input
          id="search"
          v-model="query"
          type="text"
          placeholder="Search..."
          class="pl-10"
          :disabled="!tokenStore.accessToken"
        />
        <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
          <ReloadIcon
            v-if="status === 'pending'"
            class="size-[18px] text-muted-foreground animate-spin"
          />
          <MagnifyingGlassIcon
            v-else
            class="size-6 text-muted-foreground"
          />
        </span>
      </div>
    </div>

    <div v-if="data">
      <ol class="divide-y">
        <li
          v-for="item in data.playlists.items"
          :key="item.id"
          class="p-2 rounded hover:bg-neutral-200"
        >
          <button class="flex items-center gap-2 text-left">
            <img
              :src="item.images?.at(0)?.url"
              class="object-cover rounded size-20"
            >

            <div>
              <p>{{ item.name }}</p>
              <p class="text-sm opacity-50">
                By {{ item.owner.display_name }}
              </p>
            </div>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>
