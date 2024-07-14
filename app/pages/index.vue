<script setup lang="ts">
import { ReloadIcon } from '@radix-icons/vue';
import type { Tokens } from '~/models/tokens';

const tokenStore = useTokenStore();
const config = useRuntimeConfig();
const route = useRoute();

const url = new URL('https://accounts.spotify.com/authorize');
const code = route.query.code?.toString();

url.searchParams.append('client_id', config.public.SPOTIFY_CLIENT_ID);
url.searchParams.append('response_type', 'code');
url.searchParams.append('redirect_uri', config.public.SPOTIFY_REDIRECT_URI);

const redirectUri = url.toString();

const { status } = await useAsyncData<Tokens | undefined>(async () => {
  if (!code) return;

  try {
    const response = await $fetch<Tokens>('/api/token', {
      query: {
        code,
      },
    });

    tokenStore.accessToken = response.access_token;
    tokenStore.refreshToken = response.refresh_token;

    return response;
  }
  finally {
    await navigateTo('/');
  }
}, {
  server: false,
});
</script>

<template>
  <Button
    as-child
    :disabled="status === 'pending'"
  >
    <a :href="redirectUri">
      <ReloadIcon
        v-if="status === 'pending'"
        class="w-4 h-4 mr-2 animate-spin"
      />
      Login
    </a>
  </Button>
</template>
