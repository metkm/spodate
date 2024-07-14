<script setup lang="ts">
import { ReloadIcon } from '@radix-icons/vue';

defineProps<{
  loading?: boolean;
}>();

const config = useRuntimeConfig();

const url = new URL('https://accounts.spotify.com/authorize');

url.searchParams.append('client_id', config.public.SPOTIFY_CLIENT_ID);
url.searchParams.append('response_type', 'code');
url.searchParams.append('redirect_uri', config.public.SPOTIFY_REDIRECT_URI);

const redirectUri = url.toString();
</script>

<template>
  <Button as-child>
    <a :href="redirectUri">
      <ReloadIcon
        v-if="loading"
        class="w-4 h-4 mr-2 animate-spin"
      />
      Login
    </a>
  </Button>
</template>
